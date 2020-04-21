
/**
 * ```
 * Version  ::=  INTEGER  {  v1(0), v2(1), v3(2)  }
 * ```
 */
export enum Version {
  v1 = 0,
  v2 = 1,
  v3 = 2,
};

/**
 * ```
 * CertificateSerialNumber  ::=  INTEGER
 * ```
 */
export type CertificateSerialNumber = ArrayBuffer;

/**
 * ```
 * UniqueIdentifier  ::=  BIT STRING
 * ```
 */
export type UniqueIdentifier = ArrayBuffer;
