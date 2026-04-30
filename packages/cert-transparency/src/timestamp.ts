import { toArrayBuffer } from "@peculiar/utils/bytes";
import { hex, base64 } from "@peculiar/utils/encoding";
import { Structure } from "./structure";
import { ByteStream } from "./byte_stream";

export interface IJsonSignedCertificateTimestamp {
  version: number;
  logId: string;
  timestamp: Date;
  extensions: string;
  hashAlgorithm: string;
  signatureAlgorithm: string;
  signature: string;
}

export enum SignatureType {
  certificateTimestamp = 0,
  treeHash = 1,
}

export enum HashAlgorithm {
  none = 0,
  md5 = 1,
  sha1 = 2,
  sha224 = 3,
  sha256 = 4,
  sha384 = 5,
  sha512 = 6,
}

export enum SignatureAlgorithm {
  anonymous = 0,
  rsa = 1,
  dsa = 2,
  ecdsa = 3,
}

export class SignedCertificateTimestamp extends Structure {
  public version = 0;
  public logId: ArrayBuffer = new ArrayBuffer(32);
  public timestamp = new Date();
  public extensions: ArrayBuffer = new ArrayBuffer(0);
  public hashAlgorithm: HashAlgorithm = 0;
  public signatureAlgorithm: SignatureAlgorithm = 0;
  public signature = new ArrayBuffer(0);

  public constructor(stream: ByteStream) {
    super();
    if (stream) {
      this.parse(stream);
    }
  }

  public parse(stream: ByteStream): void {
    this.version = stream.readByte();

    stream.read(2); // struct
    this.logId = toArrayBuffer(stream.read(32));

    this.timestamp = new Date(stream.readNumber(8));

    const extLen = stream.readNumber(2);
    this.extensions = toArrayBuffer(stream.read(extLen));

    this.hashAlgorithm = stream.readByte();
    this.signatureAlgorithm = stream.readByte();
    this.signature = toArrayBuffer(stream.read(stream.readNumber(2)));
  }

  public toJSON(): IJsonSignedCertificateTimestamp {
    return {
      version: this.version,
      logId: hex.encode(this.logId),
      timestamp: this.timestamp,
      extensions: base64.encode(this.extensions),
      hashAlgorithm: HashAlgorithm[this.hashAlgorithm] || "undefined",
      signatureAlgorithm: SignatureAlgorithm[this.signatureAlgorithm] || "undefined",
      signature: base64.encode(this.signature),
    };
  }
}
