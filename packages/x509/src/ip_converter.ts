import { Convert } from "pvtsutils";

export class IpConverter {
  private static isIPv4(ip: string): boolean {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
  }

  private static parseIPv4(ip: string): number[] {
    const parts = ip.split(".");
    if (parts.length !== 4) {
      throw new Error("Invalid IPv4 address");
    }

    return parts.map((part) => {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255) {
        throw new Error("Invalid IPv4 address part");
      }
      return num;
    });
  }

  private static parseIPv6(ip: string): number[] {
    // Handle compressed notation
    const expandedIP = this.expandIPv6(ip);
    const parts = expandedIP.split(":");

    if (parts.length !== 8) {
      throw new Error("Invalid IPv6 address");
    }

    return parts.reduce((bytes: number[], part) => {
      const num = parseInt(part, 16);
      if (isNaN(num) || num < 0 || num > 0xffff) {
        throw new Error("Invalid IPv6 address part");
      }
      bytes.push((num >> 8) & 0xff);
      bytes.push(num & 0xff);
      return bytes;
    }, []);
  }

  private static expandIPv6(ip: string): string {
    if (!ip.includes("::")) {
      return ip;
    }

    const parts = ip.split("::");
    if (parts.length > 2) {
      throw new Error("Invalid IPv6 address");
    }

    const left = parts[0] ? parts[0].split(":") : [];
    const right = parts[1] ? parts[1].split(":") : [];
    const missing = 8 - (left.length + right.length);

    if (missing < 0) {
      throw new Error("Invalid IPv6 address");
    }

    return [...left, ...Array(missing).fill("0"), ...right].join(":");
  }

  private static formatIPv6(bytes: Uint8Array): string {
    const parts: string[] = [];
    for (let i = 0; i < 16; i += 2) {
      parts.push(((bytes[i] << 8) | bytes[i + 1]).toString(16));
    }
    return this.compressIPv6(parts.join(":"));
  }

  private static compressIPv6(ip: string): string {
    // Find longest sequence of zeros
    const parts = ip.split(":");
    let longestZeroStart = -1;
    let longestZeroLength = 0;
    let currentZeroStart = -1;
    let currentZeroLength = 0;

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "0") {
        if (currentZeroStart === -1) {
          currentZeroStart = i;
        }
        currentZeroLength++;
      } else {
        if (currentZeroLength > longestZeroLength) {
          longestZeroStart = currentZeroStart;
          longestZeroLength = currentZeroLength;
        }
        currentZeroStart = -1;
        currentZeroLength = 0;
      }
    }

    if (currentZeroLength > longestZeroLength) {
      longestZeroStart = currentZeroStart;
      longestZeroLength = currentZeroLength;
    }

    if (longestZeroLength > 1) {
      const before = parts.slice(0, longestZeroStart).join(":");
      const after = parts.slice(longestZeroStart + longestZeroLength).join(":");
      return `${before}::${after}`;
    }

    return ip;
  }

  private static parseCIDR(text: string): [number[], number] {
    const [addr, prefixStr] = text.split("/");
    const prefix = parseInt(prefixStr, 10);

    if (this.isIPv4(addr)) {
      if (prefix < 0 || prefix > 32) {
        throw new Error("Invalid IPv4 prefix length");
      }
      return [this.parseIPv4(addr), prefix];
    } else {
      if (prefix < 0 || prefix > 128) {
        throw new Error("Invalid IPv6 prefix length");
      }
      return [this.parseIPv6(addr), prefix];
    }
  }

  private static decodeIP(value: string): string {
    if (value.length === 64 && parseInt(value, 16) === 0) {
      return "::/0";
    }

    if (value.length !== 16) {
      return value;
    }

    const mask = parseInt(value.slice(8), 16)
      .toString(2)
      .split("")
      .reduce((a, k) => a + +k, 0);
    let ip = value.slice(0, 8).replace(/(.{2})/g, (match) => `${parseInt(match, 16)}.`);

    ip = ip.slice(0, -1);

    return `${ip}/${mask}`;
  }

  public static toString(buf: ArrayBuffer): string {
    const uint8 = new Uint8Array(buf);

    // Handle plain IPv4 or IPv6
    if (uint8.length === 4) {
      return Array.from(uint8).join(".");
    }
    if (uint8.length === 16) {
      return this.formatIPv6(uint8);
    }

    // Handle IP + mask (NameConstraints)
    if (uint8.length === 8 || uint8.length === 32) {
      const half = uint8.length / 2;
      const addrBytes = uint8.slice(0, half);
      const maskBytes = uint8.slice(half);

      const isAllZeros = uint8.every((byte) => byte === 0);
      if (isAllZeros) {
        return uint8.length === 8 ? "0.0.0.0/0" : "::/0";
      }

      const prefixLen = maskBytes.reduce((a, b) => a + (b.toString(2).match(/1/g) || []).length, 0);

      if (uint8.length === 8) {
        const addrStr = Array.from(addrBytes).join(".");
        const maskStr = Array.from(maskBytes).join(".");
        return `${addrStr}/${prefixLen} (mask ${maskStr})`;
      } else {
        const addrStr = this.formatIPv6(addrBytes);
        return `${addrStr}/${prefixLen}`;
      }
    }

    return this.decodeIP(Convert.ToHex(buf));
  }

  public static fromString(text: string): ArrayBuffer {
    const ipText = text.split(" (mask ")[0];

    if (ipText.includes("/")) {
      const [addr, prefix] = this.parseCIDR(ipText);
      const maskBytes = new Uint8Array(addr.length);

      let bitsLeft = prefix;
      for (let i = 0; i < maskBytes.length; i++) {
        if (bitsLeft >= 8) {
          maskBytes[i] = 0xff;
          bitsLeft -= 8;
        } else if (bitsLeft > 0) {
          maskBytes[i] = 0xff << (8 - bitsLeft);
          bitsLeft = 0;
        }
      }

      const out = new Uint8Array(addr.length * 2);
      out.set(addr, 0);
      out.set(maskBytes, addr.length);
      return out.buffer;
    }

    // Parse single IP address
    const bytes = this.isIPv4(ipText) ? this.parseIPv4(ipText) : this.parseIPv6(ipText);
    return new Uint8Array(bytes).buffer;
  }
}
