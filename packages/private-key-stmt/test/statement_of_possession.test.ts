import { describe, it, expect } from "vitest";
import { AsnParser } from "@peculiar/asn1-schema";
import { PrivateKeyPossessionStatement } from "../src";

const b64 = [
  "MIICfDBPMDcxCzAJBgNVBAYTAlVTMRMwEQYDVQQKEwpFeGFtcGxlIENBMRMwEQYD",
  "VQQDEwpjYS5leGFtcGxlAhR_dKP8A2ziFHhcWWFOb43yTEeoeTCCAicwggGuoAMC",
  "AQICFH90o_wDbOIUeFxZYU5vjfJMR6h5MAoGCCqGSM49BAMDMDcxCzAJBgNVBAYT",
  "AlVTMRMwEQYDVQQKEwpFeGFtcGxlIENBMRMwEQYDVQQDEwpjYS5leGFtcGxlMB4X",
  "DTI1MDEwOTE3MDM0OFoXDTI2MDEwOTE3MDM0OFowPDELMAkGA1UEBhMCVVMxCzAJ",
  "BgNVBAgTAlZBMRAwDgYDVQQHEwdIZXJuZG9uMQ4wDAYDVQQDEwVBbGljZTB2MBAG",
  "ByqGSM49AgEGBSuBBAAiA2IABIAc-6lXN1MIM_82QeWNb55H0zr-lVgWVeF0bf4j",
  "zxCb5MCjVaM0eFEvcjXMV5p4kzqiJTHC0V2JAoqYMX_DMFIcwZ7xP9uQd9ep6KZ-",
  "RXut211L8-W1QI1QJSDNxANRsaN2MHQwDAYDVR0TAQH_BAIwADALBgNVHQ8EBAMC",
  "B4AwHQYDVR0OBBYEFCMdANH-7Qs5EBGYGMx9zXDNi9OSMB8GA1UdIwQYMBaAFD6Y",
  "vLLv3DQbvnGS0qP6bbzyZkCqMBcGA1UdIAQQMA4wDAYKYIZIAWUDAgEwMDAKBggq",
  "hkjOPQQDAwNnADBkAjBrv1MqXewWlZ1Iwd-lLV_ZuWZj4u_MudUQPFoWzr9CkFa3",
  "GLY-KjnYjFSgXKFXHsgCMESelPddOPDQG954nB3KxhX9VGK4Ww5crSuLQmuRwcQ_",
  "6gIMuP3lMwOTWcFWiyu_Lg",
].join("");

describe("PrivateKeyPossessionStatement", () => {
  it("should decode DER", () => {
    const der = Buffer.from(b64.replace(/_/g, "/").replace(/-/g, "+"), "base64");
    const stmt = AsnParser.parse(der, PrivateKeyPossessionStatement);
    expect(stmt).toBeInstanceOf(PrivateKeyPossessionStatement);
    expect(stmt.signer).toBeDefined();
    expect(stmt.cert).toBeDefined();
  });
});
