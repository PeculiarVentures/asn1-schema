import { AsnNode, TagClass } from "./types";

function readTag(view: Uint8Array, offset: number) {
  const b0 = view[offset];
  const tagClassIdx = (b0 & 0b1100_0000) >> 6;
  const tagClasses: TagClass[] = ["universal", "application", "context", "private"];
  const tagClass = tagClasses[tagClassIdx];
  const constructed = !!(b0 & 0b0010_0000);
  let tag = b0 & 0b0001_1111;
  let cursor = offset + 1;

  if (tag === 0x1f) {
    tag = 0;
    while (cursor < view.length) {
      const b = view[cursor++];
      tag = (tag << 7) | (b & 0x7f);
      if ((b & 0x80) === 0) break;
    }
  }
  return { tagClass, constructed, tag, cursor };
}

function readLen(view: Uint8Array, offset: number) {
  const b = view[offset];
  if ((b & 0x80) === 0) {
    return { length: b, cursor: offset + 1, indefinite: false };
  }
  const count = b & 0x7f;
  if (count === 0) {
    return { length: -1, cursor: offset + 1, indefinite: true }; // EOC terminated
  }
  let len = 0;
  let cursor = offset + 1;
  for (let i = 0; i < count; i++) {
    len = (len << 8) | view[cursor++];
  }
  return { length: len, cursor, indefinite: false };
}

export function decodeOne(view: Uint8Array, offset: number): { node: AsnNode; next: number } {
  const start = offset;
  const t = readTag(view, offset);
  const l = readLen(view, t.cursor);

  const headerLen = l.cursor - start;
  if (l.indefinite) {
    // Indefinite form — only valid for constructed in BER
    if (!t.constructed) {
      throw new Error("Indefinite length on primitive not supported");
    }
    const children: AsnNode[] = [];
    let cur = l.cursor;
    while (true) {
      if (cur + 1 <= view.length && view[cur] === 0x00 && view[cur + 1] === 0x00) {
        cur += 2; // EOC
        break;
      }
      const { node, next } = decodeOne(view, cur);
      children.push(node);
      cur = next;
    }
    const node: AsnNode = {
      offset: start,
      headerLen,
      length: cur - l.cursor - 2 /* exclude EOC */,
      tagClass: t.tagClass,
      tag: t.tag,
      constructed: true,
      children,
    };
    return { node, next: cur };
  }

  const valueStart = l.cursor;
  const valueEnd = valueStart + l.length;
  if (valueEnd > view.length) {
    throw new Error("Invalid ASN.1 length");
  }

  if (t.constructed) {
    const children: AsnNode[] = [];
    let cur = valueStart;
    const stop = valueEnd;
    while (cur < stop) {
      const { node, next } = decodeOne(view, cur);
      children.push(node);
      cur = next;
    }
    const node: AsnNode = {
      offset: start,
      headerLen,
      length: l.length,
      tagClass: t.tagClass,
      tag: t.tag,
      constructed: true,
      children,
    };
    return { node, next: valueEnd };
  } else {
    const value = view.subarray(valueStart, valueEnd);
    const node: AsnNode = {
      offset: start,
      headerLen,
      length: l.length,
      tagClass: t.tagClass,
      tag: t.tag,
      constructed: false,
      value,
    };
    return { node, next: valueEnd };
  }
}

export function decodeAll(buf: Uint8Array): AsnNode {
  const { node, next } = decodeOne(buf, 0);
  if (next !== buf.length) {
    throw new Error("Extra data after top-level ASN.1 element");
  }
  return node;
}
