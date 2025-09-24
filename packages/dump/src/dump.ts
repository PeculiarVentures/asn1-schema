import { AsnNode, DumpOptions } from "./types";
import { decodeAll } from "./ber";
import { DefaultOidRegistry } from "./registry";

const uni = {
  EOC: 0,
  BOOLEAN: 1,
  INTEGER: 2,
  BIT_STRING: 3,
  OCTET_STRING: 4,
  NULL: 5,
  OBJECT_IDENTIFIER: 6,
  UTF8String: 12,
  SEQUENCE: 16,
  SET: 17,
  PrintableString: 19,
  IA5String: 22,
  UTCTime: 23,
  GeneralizedTime: 24,
};

const defaultOpts: Required<DumpOptions> = {
  style: "dev",
  oidsMode: "both",
  oidRegistry: DefaultOidRegistry,
  maxDepth: Infinity,
  maxItems: 10,
  blobPreview: { head: 16, tail: 8 },
  indent: 2,
};

function padLeft(n: number, width: number) {
  const s = String(n);
  return s.length >= width ? s : " ".repeat(width - s.length) + s;
}

function prefixDev(offset?: number, len?: number) {
  if (offset === undefined || len === undefined) return " ".repeat(5) + " " + " ".repeat(5) + "  ";
  return padLeft(offset, 5) + " " + padLeft(len, 5) + "  ";
}

function indentStr(level: number, unit: number | string): string {
  if (typeof unit === "number") return " ".repeat(unit * level);
  return unit.repeat(level);
}

function hexBytes(u8: Uint8Array): string {
  let s = "";
  for (let i = 0; i < u8.length; i++) {
    if (i) s += " ";
    s += u8[i].toString(16).toUpperCase().padStart(2, "0");
  }
  return s;
}

function safeAscii(u8: Uint8Array): string | null {
  if (u8.length === 0 || u8.length > 64) return null;
  for (const b of u8) {
    if (b < 0x20 || b > 0x7e) return null;
  }
  let s = "";
  for (const b of u8) {
    const ch = String.fromCharCode(b);
    if (ch === "\\" || ch === '"') s += "\\" + ch;
    else s += ch;
  }
  return s;
}

function headTail<T>(items: T[], head: number, tail: number) {
  if (items.length <= head + tail) return { headA: items, omitted: 0, tailA: [] as T[] };
  return {
    headA: items.slice(0, head),
    omitted: items.length - head - tail,
    tailA: items.slice(items.length - tail),
  };
}

function oidToString(u8: Uint8Array): string {
  if (u8.length === 0) return "";
  const first = u8[0];
  const firstArc = Math.floor(first / 40);
  const secondArc = first % 40;
  const arcs = [firstArc, secondArc];
  let cur = 1;
  while (cur < u8.length) {
    let v = 0;
    while (cur < u8.length) {
      const b = u8[cur++];
      v = (v << 7) | (b & 0x7f);
      if ((b & 0x80) === 0) break;
    }
    arcs.push(v);
  }
  return arcs.join(".");
}

function twosComplementToBigInt(bytes: Uint8Array): bigint {
  if (bytes.length === 0) return 0n;
  const negative = (bytes[0] & 0x80) !== 0;
  let val = 0n;
  for (const b of bytes) val = (val << 8n) | BigInt(b);
  if (!negative) return val;
  const bits = BigInt(bytes.length * 8);
  const mask = (1n << bits) - 1n;
  const mag = ~val & mask;
  return -(mag + 1n);
}

// Note: time normalization is handled inline in dump for UTCTime/GeneralizedTime.

function typeName(tagClass: string, tag: number): string {
  if (tagClass === "application") return `APPLICATION [${tag}]`;
  if (tagClass !== "universal") return `[${tag}]`;
  switch (tag) {
    case uni.SEQUENCE:
      return "SEQUENCE";
    case uni.SET:
      return "SET";
    case uni.INTEGER:
      return "INTEGER";
    case uni.BOOLEAN:
      return "BOOLEAN";
    case uni.NULL:
      return "NULL";
    case uni.OBJECT_IDENTIFIER:
      return "OBJECT IDENTIFIER";
    case uni.OCTET_STRING:
      return "OCTET STRING";
    case uni.BIT_STRING:
      return "BIT STRING";
    case uni.UTF8String:
      return "UTF8String";
    case uni.IA5String:
      return "IA5String";
    case uni.PrintableString:
      return "PrintableString";
    case uni.UTCTime:
      return "UTCTime";
    case uni.GeneralizedTime:
      return "GeneralizedTime";
    default:
      return `UNIVERSAL ${tag}`;
  }
}

function printBlob(u8: Uint8Array, head: number, tail: number): string {
  const { headA, omitted, tailA } = headTail([...u8], head, tail);
  const headHex = hexBytes(Uint8Array.from(headA));
  if (omitted === 0) return headHex;
  const tailHex = hexBytes(Uint8Array.from(tailA));
  return `${headHex} … (omitted ${omitted} bytes) … ${tailHex}`;
}

function getBlobPreview(opts: Required<DumpOptions>): { head: number; tail: number } {
  // Ensure numbers even if optional in type
  const bp = opts.blobPreview as NonNullable<Required<DumpOptions>["blobPreview"]>;
  const head = bp.head ?? 16;
  const tail = bp.tail ?? 8;
  return { head, tail };
}

function printBitString(value: Uint8Array, opts: Required<DumpOptions>): string {
  if (value.length === 0) return " (unused=0, 0 bytes)";
  const unused = value[0];
  const data = value.subarray(1);
  const totalBits = data.length * 8 - unused;
  if (totalBits <= 512) {
    // short: show bits grouped by 4
    const bits: string[] = [];
    for (let i = 0; i < data.length; i++) {
      const byte = data[i];
      const limit = i === data.length - 1 && unused ? 8 - unused : 8;
      for (let b = 7; b >= 8 - limit; b--) {
        bits.push(((byte >> b) & 1).toString());
      }
    }
    // group into nibbles
    const groups: string[] = [];
    for (let i = 0; i < bits.length; i += 4) {
      groups.push(bits.slice(i, i + 4).join(""));
    }
    const s = groups.join(" ");
    const hexPreview = hexBytes(data.slice(0, Math.min(4, data.length)));
    return `${s} (HEX: ${hexPreview})  (unused=${unused}, ${data.length} bytes)`;
  } else {
    const { head, tail } = getBlobPreview(opts);
    const hex = printBlob(data, head, tail);
    return `${hex}  (${totalBits} bits total)`;
  }
}

function printString(tag: number, value: Uint8Array): string {
  // Render string with non-printable as \xNN based on raw bytes to meet TASK2
  const type = typeName("universal", tag);
  // Build ASCII-safe representation from raw bytes, escaping non-printables
  const chars: string[] = new Array(value.length);
  for (let i = 0; i < value.length; i++) {
    const b = value[i];
    if (b >= 0x20 && b <= 0x7e) {
      const ch = String.fromCharCode(b);
      chars[i] = ch === '"' || ch === "\\" ? "\\" + ch : ch;
    } else {
      chars[i] = `\\x${b.toString(16).toUpperCase().padStart(2, "0")}`;
    }
  }
  const s = chars.join("");
  const len = s.length; // length in displayed characters (approx)
  if (len <= 64) {
    return `${type}: ${s}`;
  } else {
    // compute head/tail in terms of characters, preserving escapes
    const head = s.slice(0, 32);
    const tail = s.slice(len - 32);
    const omitted = len - 64;
    return `${type}: ${head}… (omitted ${omitted} chars) … ${tail}`;
  }
}

function printOid(value: Uint8Array, opts: Required<DumpOptions>): string {
  const numeric = oidToString(value);
  const name = opts.oidRegistry.lookup(numeric);
  switch (opts.oidsMode) {
    case "numeric":
      return `OBJECT IDENTIFIER: ${numeric}`;
    case "name":
      return `OBJECT IDENTIFIER: ${name ?? numeric}`;
    case "both":
    default:
      return name ? `OBJECT IDENTIFIER: ${numeric} | ${name}` : `OBJECT IDENTIFIER: ${numeric}`;
  }
}

function isConstructedOctetString(node: AsnNode): boolean {
  return node.tagClass === "universal" && node.tag === uni.OCTET_STRING && node.constructed;
}

function dumpNode(
  node: AsnNode,
  buf: Uint8Array,
  lines: string[],
  level: number,
  opts: Required<DumpOptions>,
) {
  const pre = opts.style === "dev" ? prefixDev(node.offset, node.length) : "";
  const ind = indentStr(level, opts.indent);
  const tn = typeName(node.tagClass, node.tag);

  // Max depth check occurs before recursing into children
  if (level >= opts.maxDepth) {
    const p = opts.style === "dev" ? prefixDev() : "";
    lines.push(`${p}${ind}…  (max depth reached)`);
    return;
  }

  if (node.tagClass === "context") {
    if (node.constructed) {
      lines.push(`${pre}${ind}[${node.tag}]`);
      // children
      if (node.children) {
        dumpChildren(node.children, buf, lines, level + 1, opts);
      }
      return;
    } else {
      // implicit primitive — show bytes preview
      const v = node.value ?? new Uint8Array();
      const { head, tail } = getBlobPreview(opts);
      const blob = printBlob(v, head, tail);
      lines.push(`${pre}${ind}[${node.tag}]: ${blob}`);
      return;
    }
  }

  if (node.tagClass !== "universal") {
    // Generic fallback
    if (node.constructed) {
      lines.push(`${pre}${ind}${tn}`);
      if (node.children) dumpChildren(node.children, buf, lines, level + 1, opts);
    } else {
      const v = node.value ?? new Uint8Array();
      const { head, tail } = getBlobPreview(opts);
      const blob = printBlob(v, head, tail);
      lines.push(`${pre}${ind}${tn}: ${blob}`);
    }
    return;
  }

  // Universal
  switch (node.tag) {
    case uni.SEQUENCE:
    case uni.SET: {
      const kind = tn;
      const count = node.children?.length ?? 0;
      lines.push(`${pre}${ind}${kind}${count ? ` (${count} elem)` : ""}`);
      if (node.children && count) {
        dumpChildren(node.children, buf, lines, level + 1, opts);
      }
      break;
    }
    case uni.NULL: {
      lines.push(`${pre}${ind}NULL`);
      break;
    }
    case uni.BOOLEAN: {
      const v = (node.value?.[0] ?? 0) !== 0;
      lines.push(`${pre}${ind}BOOLEAN: ${v ? "TRUE" : "FALSE"}`);
      break;
    }
    case uni.INTEGER: {
      const v = node.value ?? new Uint8Array();
      const bi = twosComplementToBigInt(v);
      const dec = bi.toString();
      if (v.length > 16) {
        const hxPrefix = hexBytes(v.slice(0, Math.min(8, v.length)));
        lines.push(`${pre}${ind}INTEGER: ${dec}…  (0x${hxPrefix}${v.length > 8 ? " …" : ""})`);
      } else {
        lines.push(`${pre}${ind}INTEGER: ${dec}`);
      }
      break;
    }
    case uni.OBJECT_IDENTIFIER: {
      const v = node.value ?? new Uint8Array();
      lines.push(`${pre}${ind}${printOid(v, opts)}`);
      break;
    }
    case uni.OCTET_STRING: {
      if (node.constructed && node.children) {
        // aggregated preview from concatenated bytes
        const concat = concatConstructedBytes(node.children);
        const { head, tail } = getBlobPreview(opts);
        const s = printBlob(concat, head, tail);
        lines.push(`${pre}${ind}OCTET STRING: ${s}`);
        // reveal children if depth allows
        dumpChildren(node.children, buf, lines, level + 1, opts);
      } else {
        const v = node.value ?? new Uint8Array();
        const { head, tail } = getBlobPreview(opts);
        const s = printBlob(v, head, tail);
        const ascii = safeAscii(v);
        lines.push(`${pre}${ind}OCTET STRING: ${s}${ascii ? `   "${ascii}"` : ""}`);
      }
      break;
    }
    case uni.BIT_STRING: {
      if (node.constructed && node.children && node.children.length) {
        // Constructed BIT STRING: print container, then children per rules
        lines.push(`${pre}${ind}BIT STRING`);
        dumpChildren(node.children, buf, lines, level + 1, opts);
      } else {
        const v = node.value ?? new Uint8Array();
        lines.push(`${pre}${ind}BIT STRING: ${printBitString(v, opts)}`);
      }
      break;
    }
    case uni.UTF8String:
    case uni.PrintableString:
    case uni.IA5String:
    case uni.UTCTime:
    case uni.GeneralizedTime: {
      if (node.tag === uni.UTCTime || node.tag === uni.GeneralizedTime) {
        const raw = new TextDecoder().decode(node.value ?? new Uint8Array());
        const norm = raw.endsWith("Z")
          ? raw.replace(
              /^(\d{2,4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/,
              (_m, y, mo, d, h, mi, s) => {
                const year = y.length === 2 ? (Number(y) >= 50 ? "19" + y : "20" + y) : y;
                return `${year}-${mo}-${d}T${h}:${mi}:${s}Z`;
              },
            )
          : raw;
        const type = typeName("universal", node.tag);
        lines.push(`${pre}${ind}${type}: ${norm}`);
      } else {
        lines.push(`${pre}${ind}${printString(node.tag, node.value ?? new Uint8Array())}`);
      }
      break;
    }
    default: {
      if (node.constructed && node.children) {
        lines.push(`${pre}${ind}${tn}`);
        dumpChildren(node.children, buf, lines, level + 1, opts);
      } else {
        const v = node.value ?? new Uint8Array();
        const { head, tail } = getBlobPreview(opts);
        lines.push(`${pre}${ind}${tn}: ${printBlob(v, head, tail)}`);
      }
      break;
    }
  }
}

function dumpChildren(
  children: AsnNode[],
  buf: Uint8Array,
  lines: string[],
  level: number,
  opts: Required<DumpOptions>,
) {
  const max = opts.maxItems;
  if (children.length <= max) {
    for (const ch of children) dumpNode(ch, buf, lines, level, opts);
    return;
  }
  // head..omitted..tail
  const headCount = Math.max(0, max - 1); // show first max-1, omit middle, show last
  const omitted = children.length - headCount - 1;
  for (let i = 0; i < headCount; i++) dumpNode(children[i], buf, lines, level, opts);
  const p = opts.style === "dev" ? prefixDev() : "";
  const ind = indentStr(level, opts.indent);
  lines.push(`${p}${ind}… (omitted ${omitted} items)`);
  dumpNode(children[children.length - 1], buf, lines, level, opts);
}

function concatConstructedBytes(children: AsnNode[]): Uint8Array {
  const parts: Uint8Array[] = [];
  for (const ch of children) {
    if (isConstructedOctetString(ch) && ch.children) {
      parts.push(concatConstructedBytes(ch.children));
    } else if (!ch.constructed && ch.value) {
      parts.push(ch.value);
    }
  }
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

export function dumpAsn(input: Uint8Array | AsnNode, options?: DumpOptions): string {
  const opts: Required<DumpOptions> = {
    ...defaultOpts,
    ...options,
    blobPreview: { ...defaultOpts.blobPreview, ...(options?.blobPreview ?? {}) },
    oidRegistry: options?.oidRegistry ?? defaultOpts.oidRegistry,
  };

  const node = input instanceof Uint8Array ? decodeAll(input) : input;
  const buf = input instanceof Uint8Array ? input : new Uint8Array(0);
  const lines: string[] = [];
  dumpNode(node, buf, lines, 0, opts);
  return lines.join("\n");
}
