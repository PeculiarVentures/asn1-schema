import * as assert from "assert";
import { AsnParser, AsnConvert } from "@peculiar/asn1-schema";
import { Convert } from "pvtsutils";
import { Certificate, id_ce_cRLDistributionPoints, CRLDistributionPoints, id_ce_keyUsage, KeyUsage, id_ce_extKeyUsage, ExtendedKeyUsage, NameConstraints, GeneralSubtrees, GeneralSubtree, GeneralName, UserNotice, PrivateKeyUsagePeriod, EntrustVersionInfo } from "../src";
import { CertificateTemplate } from "@peculiar/asn1-x509-microsoft";

context("x509", () => {

  it("cert #1", () => {
    const pem = "MIIDljCCAn6gAwIBAgIOSETcxtRwD/qzf0FjVvEwDQYJKoZIhvcNAQELBQAwZjELMAkGA1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExGjAYBgNVBAsTEUZvciBEZW1vIFVzZSBPbmx5MSAwHgYDVQQDExdHbG9iYWxTaWduIERlbW8gUm9vdCBDQTAeFw0xNjA3MjAwMDAwMDBaFw0zNjA3MjAwMDAwMDBaMGYxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMRowGAYDVQQLExFGb3IgRGVtbyBVc2UgT25seTEgMB4GA1UEAxMXR2xvYmFsU2lnbiBEZW1vIFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC1i9RNgrJ4YAATN0J4KVGZjFGQVGFdcbKvfxrt0Bfusq2g81iVrZZjqTJnPSx4g6TdVcsEXU9GWlkFXKEtZzYM4ycbwLAeJQxQDEqkV03GV8ks2Jq/6jIm2DbByPiS5fvRQFQJLYuQHqXpjpOpmPiostUsg9ydMEqcacYV22a6A6Nrb1c1B6OL+X0u9bo30K+YYSw2Ngp3Tuuj9PDk6JS/0CPLcLo8JIFFc8t78lPDquNAOqTDwY/HTw4751iqLVem9q3EDKEeUS+x4gqsCD2pENA7PlQBza55BGOi/A+UAsmfee1oq2Glo9buXBgX+oJ3HnyelzJU9Ej4+yfH7rcvAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTqD8ID9OxgG83HZJVtOQMmftrrLzANBgkqhkiG9w0BAQsFAAOCAQEAAECKKpL0A2I+hsY881tIz7WqkLDuLh/ISzRVdsALYAxLhVDUHPckh5XyVRkpbTmirn+b5MpuwAI2R8A7Ld6aWWiibc7zGEZNvEKsUEYoJoYR0fuQs2cF7egiYjhFwFMX75w+kuI0Yelm3/3+BiJVtAXqmnQ4yRpGXqNJ4mQC8yWgQbZCLUpH/nqeQANeoaDr5Yg8IOuHRQzG6YNt/Cl9CetDd8WPrAkGm3T2iG0dXQ48VgkkXcNDtY+55nYjIO+N7i+WTh1fe3ArGxHBR3E44+WoA8ntfI1g65+GR0s6G8M7oS+kAFXIwugUGYEnTWp0m5bAn5NlD314IEOg4mnS8Q==";
    const cert = AsnParser.parse(Convert.FromBase64(pem), Certificate);
    assert.strictEqual(!!cert, true);
  });

  it("cert #2", () => {
    const pem = "MIIFjjCCBHagAwIBAgIMVcQBzZcO9v+nopB+MA0GCSqGSIb3DQEBCwUAMGkxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMRowGAYDVQQLExFGb3IgRGVtbyBVc2UgT25seTEjMCEGA1UEAxMaR2xvYmFsU2lnbiBEZW1vIElzc3VpbmcgQ0EwHhcNMjAwNDEyMDgyNTUzWhcNMjEwNDEzMDgyNTUzWjCBrTELMAkGA1UEBhMCVVMxFjAUBgNVBAgTDU5ldyBIYW1wc2hpcmUxEzARBgNVBAcTClBvcnRzbW91dGgxHTAbBgNVBAoTFEdNTyBHbG9iYWxTaWduLCBJbmMuMRcwFQYDVQQLEw5UZXN0IFByb2ZpbGUgMjERMA8GA1UEAxMIYWVnYWRtaW4xJjAkBgkqhkiG9w0BCQEWF2FlZ2FkbWluQGFlZ2RvbWFpbjIuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp6rQnYSkVFPQpAwyW74bCzITeb0cUqwlTOb+oWbySich01wjkCxSozRfddrE9pLrN+HAMp2IJpsSrg5tn7TVaJOhbJ1nW0kfRlBZ+3EvUcuUrsuHI2ntfFJu/JURkxSJa1A0eff7XoFQayXk4HL8Jx4d/7Vn0ky5BrFB7KW/7YHrxs5cFA5ESNcuESn9/aJvIfzDSZD6vqZM9avMAjT4Na78Wz5YPBzVClu/+HeaDL7iavbLieDwZNoSX+YpgCtmPcWCBGN1oDvv+LBL0ajZfVrhYcVPdfgo0APdHy0P06D9nIP+ajdtevOlyTcEdTDi0EhE2HZZ3cCsOoxXO7mQAQIDAQABo4IB7zCCAeswDgYDVR0PAQH/BAQDAgWgMH8GCCsGAQUFBwEBBHMwcTA5BggrBgEFBQcwAoYtaHR0cDovL3NlY3VyZS5nbG9iYWxzaWduLmNvbS9nc2RlbW9zaGEyZzMuY3J0MDQGCCsGAQUFBzABhihodHRwOi8vb2NzcDIuZ2xvYmFsc2lnbi5jb20vZ3NkZW1vc2hhMmczMD4GCSsGAQQBgjcVBwQxMC8GJysGAQQBgjcVCIKctRyHkpQFhcmDFIK1r3mEl94zgQaGrIEigpjgDQIBZAIBCDBNBgNVHSAERjBEMEIGCisGAQQBoDIBKAowNDAyBggrBgEFBQcCARYmaHR0cHM6Ly93d3cuZ2xvYmFsc2lnbi5jb20vcmVwb3NpdG9yeS8wCQYDVR0TBAIwADA7BgNVHR8ENDAyMDCgLqAshipodHRwOi8vY3JsLmdsb2JhbHNpZ24uY29tL2dzZGVtb3NoYTJnMy5jcmwwIgYDVR0RBBswGYEXYWVnYWRtaW5AYWVnZG9tYWluMi5jb20wHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMEMB8GA1UdIwQYMBaAFHWgf0jK74nlOaHa0qZD5p8+v0gEMB0GA1UdDgQWBBRNAPBJcnbCXITXO7RHXQVOtdH0djANBgkqhkiG9w0BAQsFAAOCAQEAqzlvDaNnrL+dnSB12hS6/ZHF9TTb1BegiOxv1b0d0zHfufiFWrBCAvZ0P9E1+jjLfiIJc23xsbaVyUmVobEPgCHV5lIC7u+9QTGF0R4hWFh0q6ZnytYoOa3KPkO+rQ5xhWMeZ7kETRePrf7fm89cysKEtvYgH7lSdWnyAujJukkoMB9NOxVbWmjdN2wymrtNWypgaC2TtM4DnBttR7Ke0SdMKN/apmsDlJ0Z8J+8B+sMbSVhOjLneXghpOy5uYIMT1FOvKoN8xn1Mp4h19FkTkNGDGCGWMsnQelfzaaOBaiBXSy/vc/qNt+ZHCiLvXBWEiC6qLVM2dKZ/Ab8Xv+/3Q==";
    const cert = AsnParser.parse(Convert.FromBase64(pem), Certificate);
    cert.tbsCertificate.extensions?.forEach((extension) => {
      if (extension.extnID === id_ce_cRLDistributionPoints) {
        const crlDistributionPoints = AsnParser.parse(extension.extnValue, CRLDistributionPoints);
        assert.strictEqual(
          crlDistributionPoints[0].distributionPoint?.fullName?.[0].uniformResourceIdentifier,
          "http://crl.globalsign.com/gsdemosha2g3.crl");
      }
      if (extension.extnID === id_ce_keyUsage) {
        const keyUsage = AsnParser.parse(extension.extnValue, KeyUsage);
        assert.strictEqual(keyUsage.toString(), "[digitalSignature, keyEncipherment]");
      }
    });
    assert.strictEqual(!!cert, true);
  });

  it("cert with 0 extensions", () => {
    const hex = "308202963082017e020101300d06092a864886f70d01010b0500300f310d300b0603550403130454657374301e170d3139313233313231303030305a170d3230303130313231303030305a300f310d300b060355040313045465737430820122300d06092a864886f70d01010105000382010f003082010a0282010100c12f5ed353a4ed77c5bae6df726bf68c2cb0659778eeb8bde3edfb62c3ef38169f5f35678d4ccd21bc45e1e0c6442dfc066e8565a5dea29b08502c4002c6e50746dec1f479b8379fbabd380bcb91a7cef524b413dc0f7e2ff77d8dbcdf6c55a5c8a1493333c9662f2a05801a19419fcc2c58dba55506440a2b5239035937b4265afb931a87cffbae0a690385ae9aa7e768660c1dcd6974bff85fe44aebb2fe9e8edb4648a5ec2d9f6797c1481041354413851d26d389b43c91c96f4ca9e481dca5b2f7d3d82858f159bbc6e6f21704aa15fce83a1e789ac1f3d2245455afb9b8d68b147632630e8ad2ce4d4bb39e83e9c0597d6a5a745061f4b08a5e2b8795b30203010001a3023000300d06092a864886f70d01010b05000382010100837a986d86594fc12ef06c748beece637fc81bbecda4d420e8db643d91a449a0c463735e55951cdaba86ebe23c17496b3938e0923335458f8cc0ae89a28dea69b8e9bcaf708e9f8623f42378fad1fe27073c20085817e2253cfb5f1d59f6f62d81a58d7f816b34bd8c4e5d586384a6f1b849f3a5881425013c11f71b764af5bde8469175b37d64ebf4007f279dd3570fff22e3bcda6b6ac6a7c88034e0a8b441466fb0b46eb329258bd4597eea8212929228ac1170d3825845701a6bbe9a844de117684e0eaa630e491e99f33b2e84802e43de0d91f8a678b8a268da882a49b71f96ea0791712ea71426e81b48b0cbda296f0b14249736a90bcbcafcb269a2cc";
    const certRaw = Buffer.from(hex, "hex");
    const cert = AsnConvert.parse(certRaw, Certificate);
    const certRaw2 = AsnConvert.serialize(cert);

    assert.strictEqual(hex, Buffer.from(certRaw2).toString("hex"));
  });

  it("Extended key usages", () => {
    const hex = `300c06042a030405060453040506`;
    const eku = AsnParser.parse(Convert.FromHex(hex), ExtendedKeyUsage);
    assert.strictEqual(eku.join(", "), "1.2.3.4.5, 2.3.4.5.6");
  });

  it("Name constrains", () => {
    var nameConstrains = new NameConstraints({
      permittedSubtrees: new GeneralSubtrees([
        new GeneralSubtree({
          base: new GeneralName({
            dNSName: "some.dns.com",
          })
        }),
        new GeneralSubtree({
          base: new GeneralName({
            iPAddress: "192.168.1.1",
          })
        }),
        new GeneralSubtree({
          base: new GeneralName({
            iPAddress: "2001:0db8:11a3:09d7:1f34:8a2e:07a0:765d",
          })
        }),
      ])
    });

    const der = AsnConvert.serialize(nameConstrains);

    const test = AsnParser.parse(der, NameConstraints);

    assert.strictEqual(test.permittedSubtrees![0].base.dNSName, "some.dns.com");
    assert.strictEqual(test.permittedSubtrees![1].base.iPAddress, "192.168.1.1");
    assert.strictEqual(test.permittedSubtrees![2].base.iPAddress, "2001:db8:11a3:9d7:1f34:8a2e:7a0:765d");
  });

  it("Certificate template", () => {
    const certTemplate = new CertificateTemplate({
      templateID: "1.2.3.4.5.6.7.8.9",
      templateMajorVersion: 101,
      templateMinorVersion: 0,
    });

    const der = AsnConvert.serialize(certTemplate);

    const test = AsnConvert.parse(der, CertificateTemplate);
    assert.strictEqual(test.templateID, "1.2.3.4.5.6.7.8.9");
    assert.strictEqual(test.templateMajorVersion, 101);
    assert.strictEqual(test.templateMinorVersion, 0);
  });

  it("UserNotice", () => {
    const hex = "3081991e81960049006d0070006c0065006d0065006e007400610020006c006100200050006f006c006900740069006300610020006400650020006c00610020005200610069007a00200043006f00730074006100720072006900630065006e00730065002000640065002000430065007200740069006600690063006100630069006f006e0020004400690067006900740061006c002000760032";
    const raw = Buffer.from(hex, "hex");

    const userNotice = AsnConvert.parse(raw, UserNotice);

    assert.strictEqual(userNotice.explicitText!.bmpString, "Implementa la Politica de la Raiz Costarricense de Certificacion Digital v2");
  });

  it("PrivateKeyUsagePeriod", () => {
    const hex = "3022800f32303033303130383233333732335a810f32303233303130393030303732335a";
    const raw = Buffer.from(hex, "hex");

    const privateKeyUsagePeriod = AsnConvert.parse(raw, PrivateKeyUsagePeriod);

    assert.strictEqual(privateKeyUsagePeriod.notBefore?.getTime(), 1042069043000);
    assert.strictEqual(privateKeyUsagePeriod.notAfter?.getTime(), 1673222843000);
  });

  it("EntrustVersionInfo", () => {
    const hex = "300e1b0856362e303a342e3003020490";
    const raw = Buffer.from(hex, "hex");

    const entrustVersionInfo = AsnConvert.parse(raw, EntrustVersionInfo);

    assert.strictEqual(entrustVersionInfo.entrustVers, "V6.0:4.0");
    assert.strictEqual(entrustVersionInfo.entrustInfoFlags.toString(), "[keyUpdateAllowed]");
  });

});
