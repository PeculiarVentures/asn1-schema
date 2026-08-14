/**
 * Object identifiers for Merkle Tree Certificates.
 *
 * The draft reserves `TBD` values under the PKIX arcs and pins the
 * `1.3.6.1.4.1.44363.47.*` arc "for initial experimentation". Only the
 * experimental values are exported, because the PKIX values are not yet
 * allocated. Deployed test hierarchies use the experimental arc.
 *
 * @see {@link https://datatracker.ietf.org/doc/draft-ietf-plants-merkle-tree-certs/ | draft-ietf-plants-merkle-tree-certs}
 */

/**
 * Experimental value for `id-alg-mtcProof`, the signature algorithm of a
 * Merkle Tree Certificate. The `signatureValue` holds an {@link MTCProof}
 * rather than a signature.
 */
export const id_alg_mtcProof_experimental = "1.3.6.1.4.1.44363.47.0";

/**
 * Experimental value for `id-rdna-trustAnchorID`, the relative distinguished
 * name attribute carrying a CA ID. The draft encodes the value as a
 * `UTF8String` during initial experimentation, and as a `RELATIVE-OID`
 * thereafter.
 */
export const id_rdna_trustAnchorID_experimental = "1.3.6.1.4.1.44363.47.1";

/**
 * Experimental value for `id-pe-mtcCertificationAuthority`, the critical
 * extension identifying an MTC CA certificate.
 */
export const id_pe_mtcCertificationAuthority_experimental = "1.3.6.1.4.1.44363.47.2";

/** Maximum serial number in this protocol, `2^64-1`. */
export const mtcMaxSerial = 18446744073709551615n;
