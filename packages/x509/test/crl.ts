import { AsnConvert } from "@peculiar/asn1-schema";
import * as asn1X509 from "@peculiar/asn1-x509";
import * as assert from "assert";
import { Convert } from "pvtsutils";

context("crl", () => {

  /**
   * Certs: 0
   * Extensions: authorityKeyIdentifier, cRLNumber, issuingDistributionPoint, freshestCRL
   */
  const crlExtRaw = Convert.FromBase64Url("MIICsjCCAZoCAQEwDQYJKoZIhvcNAQELBQAwKTEnMCUGA1UEAwweUGVjdWxpYXIgVmVudHVyZXMgUm9vdCBDQSAtIFIxFw0yMTEwMDQyMDIzMDBaFw0yMTEwMDUyMDIzMDBaoIIBOzCCATcwHwYDVR0jBBgwFoAUG9nYywiWI9ubW14Xs7LlP4l4nOYwCgYDVR0UBAMCAQEwfwYDVR0cBHgwdqB0oHKGcGh0dHA6Ly9rYXJhLnByaW1la2V5LnNlOjgwODAvZWpiY2EvcHVibGljd2ViL3dlYmRpc3QvY2VydGRpc3Q_Y21kPWNybCZpc3N1ZXI9Q04lM0RQZWN1bGlhcitWZW50dXJlcytSb290K0NBKy0rUjEwgYYGA1UdLgR_MH0we6B5oHeGdWh0dHA6Ly9rYXJhLnByaW1la2V5LnNlOjgwODAvZWpiY2EvcHVibGljd2ViL3dlYmRpc3QvY2VydGRpc3Q_Y21kPWRlbHRhY3JsJmlzc3Vlcj1DTiUzRFBlY3VsaWFyK1ZlbnR1cmVzK1Jvb3QrQ0ErLStSMTANBgkqhkiG9w0BAQsFAAOCAQEAmkPdMs7sgbfYWCPSlC_jMGVGg_C2yvD7Z-vqM21bF5muSiFvvmiDnrmaDwZmaxvVrqwXzgRfggKqP5SlYzIqjyejcbpCc6pouYu3LA7Lt9UncbVvw_dNYc0x7u1VB1e9XdV1W1OdKrhlz1O4dszsxvnuaYQQU7E3zyeOrtmKKznMo3CFYr3yGsrojvvZ3dM-toTUCZnVLg1TBkuS2XcMwQCdqaKFZUTQmkfvktQLTtdXiOgW050kpLR8HA23AuzHcvvrHp7GCuIGjmXCEXRB39BNzfmMs5wD4cN0sCmNURM821OF93KEWg93HFZik9SoSdAyxSPUSt3wz2W41e-vCw");
  /**
   * Certs: 4
   * Extensions: authorityKeyIdentifier, deltaCRLIndicator, cRLNumber
   */
  const crlExtDeltaRaw = Convert.FromBase64("MIICWjCCAUICAQEwDQYJKoZIhvcNAQELBQAwRTELMAkGA1UEBhMCVVMxHzAdBgNVBAoTFlRlc3QgQ2VydGlmaWNhdGVzIDIwMTExFTATBgNVBAMTDGRlbHRhQ1JMIENBMRcNMTEwMTAxMDgzMDAwWhcNMzAxMjMxMDgzMDAwWjCBiDAgAgEDFw0xMDA2MDEwODMwMDBaMAwwCgYDVR0VBAMKAQEwIAIBBBcNMTAwNjAxMDgzMDAwWjAMMAoGA1UdFQQDCgEIMCACAQUXDTEwMDEwMTA4MzAwMFowDDAKBgNVHRUEAwoBATAgAgEGFw0xMDA2MDEwODMwMDBaMAwwCgYDVR0VBAMKAQigPjA8MB8GA1UdIwQYMBaAFHcYI+V2hMgUlD+C0IHqdLHgpC8zMA0GA1UdGwEB/wQDAgEBMAoGA1UdFAQDAgEFMA0GCSqGSIb3DQEBCwUAA4IBAQAFVo99MjLWWcc8kdu/qveAAPZgvgHBAQqOygCNbu4J704lAb9wHTJoNvghxK7iGsCGd2O7l1ODdooPWNcY3NVkY2soZmevk5F19MQX7fr4HrLpDtcdfbby1PG2TX0MttfwpGDh8yfO1SFjkclmoP8f1f8mrmulJcy/sXK+H478JHO1lycEzMsvgGj2HCZvRziR+g3nH2AVMra4r6u+oo1ctwcWWGRkhfuyeBBJWDMh3T61gIbdB+Atjs3QBscvjPdU+F5XyuaBLbwEBYJOoTeSKTxfDVeYnPFghHyenItJsmII5IPocdTk/6/RB0wtDlMQwjNUXxe0/3WoHVy8bUQZ");
  /**
   * Certs: 3
   * Extensions: authorityKeyIdentifier, cRLNumber
   */
  const crlCertsRaw = Convert.FromBase64Url("MIICZzCCAU8CAQEwDQYJKoZIhvcNAQELBQAwfjELMAkGA1UEBhMCUEwxIjAgBgNVBAoTGVVuaXpldG8gVGVjaG5vbG9naWVzIFMuQS4xJzAlBgNVBAsTHkNlcnR1bSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTEiMCAGA1UEAxMZQ2VydHVtIFRydXN0ZWQgTmV0d29yayBDQRcNMjEwOTMwMDYzNDEwWhcNMjIwOTI5MDYzNDEwWjBsMCICAwR6WBcNMTkxMTI3MDk1MjM4WjAMMAoGA1UdFQQDCgEFMCICAwSScRcNMTkxMTI3MDk1MjQwWjAMMAoGA1UdFQQDCgEFMCICAwbW7hcNMTkxMTI3MDk1MjQyWjAMMAoGA1UdFQQDCgEFoC8wLTAfBgNVHSMEGDAWgBQIds3LB_8k9sXN7buQvOKEN0Z19zAKBgNVHRQEAwIBGDANBgkqhkiG9w0BAQsFAAOCAQEAL5oGWj50cZJZqFiM-gFHj8ateiML6DXuz49SppaM4_z6JUHPMw1q-5Ty1wb7aJmlnaYsaRA43o5BxlAVr3bLmCgNQcQvGrNQd5bMHhpecPUXCimEezCTLGiftHzUigssVGUeas2iE7-jB3AXyMZExe4D22eokFLJMKbW4s15GB1Lsk94UKxikgkzfxdNWPvk0pjhjQ4z4NgLQ1zqcdLk6NCi57mK5oUq2Or9mbr6w2kTuSXiKQ3l8X8pz_gdPz4WxFEc4YAH4IWeDSmEw1KjLhDYd_LxnP4jFGxnEijQgE46y0FMNPEKLSdtM8AGxvEmmmH2j8YKUj1qxRGibrO7ww");

  context("parse extensions", () => {

    let crl: asn1X509.CertificateList;

    before(() => {
      crl = AsnConvert.parse(crlExtRaw, asn1X509.CertificateList);
    });

    it("authorityKeyIdentifier", () => {
      assert.ok(crl.tbsCertList.crlExtensions);
      const ext = crl.tbsCertList.crlExtensions.find(o => o.extnID === asn1X509.id_ce_authorityKeyIdentifier);
      assert.ok(ext);
      const aki = AsnConvert.parse(ext.extnValue, asn1X509.AuthorityKeyIdentifier);
      assert.ok(aki.keyIdentifier);
      assert.strictEqual(Convert.ToHex(aki.keyIdentifier), "1bd9d8cb089623db9b5b5e17b3b2e53f89789ce6");
    });

    it("cRLNumber", () => {
      assert.ok(crl.tbsCertList.crlExtensions);
      const ext = crl.tbsCertList.crlExtensions.find(o => o.extnID === asn1X509.id_ce_cRLNumber);
      assert.ok(ext);
      const crlNumber = AsnConvert.parse(ext.extnValue, asn1X509.CRLNumber);
      assert.strictEqual(crlNumber.value, 1);
    });

    it("issuingDistributionPoint", () => {
      assert.ok(crl.tbsCertList.crlExtensions);
      const ext = crl.tbsCertList.crlExtensions.find(o => o.extnID === asn1X509.id_ce_issuingDistributionPoint);
      assert.ok(ext);
      const point = AsnConvert.parse(ext.extnValue, asn1X509.IssuingDistributionPoint);
      assert.strictEqual(point.onlyContainsAttributeCerts, false);
      assert.strictEqual(point.onlyContainsCACerts, false);
      assert.strictEqual(point.onlyContainsUserCerts, false);
      assert.strictEqual(point.indirectCRL, false);
      assert.strictEqual(point.distributionPoint?.fullName?.[0].uniformResourceIdentifier, "http://kara.primekey.se:8080/ejbca/publicweb/webdist/certdist?cmd=crl&issuer=CN%3DPeculiar+Ventures+Root+CA+-+R1");
    });

    it("freshestCRL", () => {
      assert.ok(crl.tbsCertList.crlExtensions);
      const ext = crl.tbsCertList.crlExtensions.find(o => o.extnID === asn1X509.id_ce_freshestCRL);
      assert.ok(ext);
      const freshest = AsnConvert.parse(ext.extnValue, asn1X509.FreshestCRL);
      assert.strictEqual(freshest[0].distributionPoint?.fullName?.[0].uniformResourceIdentifier, "http://kara.primekey.se:8080/ejbca/publicweb/webdist/certdist?cmd=deltacrl&issuer=CN%3DPeculiar+Ventures+Root+CA+-+R1");
    });

  });

  it("parse delta extension", () => {
    const crl = AsnConvert.parse(crlExtDeltaRaw, asn1X509.CertificateList);
    assert.ok(crl.tbsCertList.crlExtensions);

    const deltaExt = crl.tbsCertList.crlExtensions.find(o => o.extnID === asn1X509.id_ce_deltaCRLIndicator);
    assert.ok(deltaExt);

    const delta = AsnConvert.parse(deltaExt.extnValue, asn1X509.BaseCRLNumber);
    assert.strictEqual(delta.value, 1);
  });

  it("parse with revoked certs", () => {
    const crl = AsnConvert.parse(crlCertsRaw, asn1X509.CertificateList);
    assert.ok(crl.tbsCertList.revokedCertificates);
    const revokedCert = crl.tbsCertList.revokedCertificates[0];

    assert.ok(revokedCert.revocationDate.utcTime);
    assert.ok(Convert.ToHex(revokedCert.userCertificate), "047a58");

    assert.ok(revokedCert.crlEntryExtensions);
    const crlReasonExt = revokedCert.crlEntryExtensions.find(o => o.extnID === asn1X509.id_ce_cRLReasons);
    assert.ok(crlReasonExt);

    const crlReason = AsnConvert.parse(crlReasonExt.extnValue, asn1X509.CRLReason);
    assert.strictEqual(crlReason.reason, asn1X509.CRLReasons.cessationOfOperation);
  });

});
