/**
 * Object Identifiers for CRMF (Certificate Request Message Format)
 * Based on RFC 4211
 */

// Base OIDs
const id_pkix = "1.3.6.1.5.5.7";
const id_pkip = `${id_pkix}.5`;
const id_smime = "1.2.840.113549.1.9.16";
const id_ct = `${id_smime}.1`;

// Registration Controls in CRMF
export const id_regCtrl = `${id_pkip}.1`;

export const id_regCtrl_regToken = `${id_regCtrl}.1`;
export const id_regCtrl_authenticator = `${id_regCtrl}.2`;
export const id_regCtrl_pkiPublicationInfo = `${id_regCtrl}.3`;
export const id_regCtrl_pkiArchiveOptions = `${id_regCtrl}.4`;
export const id_regCtrl_oldCertID = `${id_regCtrl}.5`;
export const id_regCtrl_protocolEncrKey = `${id_regCtrl}.6`;

// Additional OIDs used in OpenSSL implementation
export const id_regCtrl_algId = `${id_regCtrl}.7`;
export const id_regCtrl_rsaKeyLen = `${id_regCtrl}.8`;

// Registration Info in CRMF
export const id_regInfo = `${id_pkip}.2`;

export const id_regInfo_utf8Pairs = `${id_regInfo}.1`;
export const id_regInfo_certReq = `${id_regInfo}.2`;

// Content Types
export const id_ct_encKeyWithID = `${id_ct}.21`;
