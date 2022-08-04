import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import * as oid from "./object_identifiers";

// See https://datatracker.ietf.org/doc/html/rfc5480#appendix-A

function create(algorithm: string): AlgorithmIdentifier {
  return new AlgorithmIdentifier({ algorithm });
}

/**
 * ECDSA with SHA-1
 * Parameters are ABSENT
 */
export const ecdsaWithSHA1 = create(oid.id_ecdsaWithSHA1);

/**
 * ECDSA with SHA-224. Parameters are ABSENT
 */
export const ecdsaWithSHA224 = create(oid.id_ecdsaWithSHA224);

/**
 * ECDSA with SHA-256. Parameters are ABSENT
 */
export const ecdsaWithSHA256 = create(oid.id_ecdsaWithSHA256);

/**
 * ECDSA with SHA-384. Parameters are ABSENT
 */
export const ecdsaWithSHA384 = create(oid.id_ecdsaWithSHA384);

/**
 * ECDSA with SHA-512. Parameters are ABSENT
 */
export const ecdsaWithSHA512 = create(oid.id_ecdsaWithSHA512);
