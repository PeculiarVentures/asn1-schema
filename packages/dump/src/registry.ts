import { OidRegistry } from "./types";

export class MapOidRegistry implements OidRegistry {
  private map = new Map<string, string>();

  constructor(seed?: Record<string, string>) {
    if (seed) {
      for (const [k, v] of Object.entries(seed)) this.map.set(k, v);
    }
  }

  lookup(oid: string): string | undefined {
    return this.map.get(oid);
  }

  register(oid: string, name: string): void {
    this.map.set(oid, name);
  }
}

// Minimal useful defaults, can be extended by users.
export const DefaultOidRegistry = new MapOidRegistry({
  "1.2.840.113549.1.1.5": "sha1WithRSAEncryption",
  "0.9.2342.19200300.100.1.25": "domainComponent",
  "1.2.840.113549.1.7.1": "data",
});
