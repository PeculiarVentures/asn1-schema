import { AsnConvert, AsnParser } from "@peculiar/asn1-schema";
import * as assert from "assert";
import { Convert } from "pvtsutils";
import { ContentInfo, EncapsulatedContentInfo, EnvelopedData, id_data, id_envelopedData, id_signedData, SignedData, SignerIdentifier } from "../src";

context("cms", () => {

  it("parse CMS with SignerInfo version 1", () => {
    const pem =
      "MIAGCSqGSIb3DQEHAqCAMIACAQExDzANBglghkgBZQMEAgEFADCABgkqhkiG9w0B" +
      "BwGggCSABAV0ZXN0CgAAAAAAAKCCAsYwggLCMIIBrKADAgECAgEBMAsGCSqGSIb3" +
      "DQEBCzAeMRwwCQYDVQQGEwJSVTAPBgNVBAMeCABUAGUAcwB0MB4XDTE2MDEzMTIx" +
      "MDAwMFoXDTE5MDEzMTIxMDAwMFowHjEcMAkGA1UEBhMCUlUwDwYDVQQDHggAVABl" +
      "AHMAdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAPHkz61wmuKdfIo/" +
      "USEOqZtypZel35gpTeEzrb92G6c9MySPFIb0aIaaJXg+g5cIi+do2EM4xib1h7Ba" +
      "BrkkQcpzPN/bBpagLfMD+0EFA8omJxbYiwIuzz3JHhrkV7/aOUzmZgjtq4rOHyMP" +
      "c8oD/by7rZYFFaCctrPKjUEFA19/mSCPmZXzY5ZMsL41qbURD35j4FqlbVXLkeVO" +
      "2EGW7537pI1ZG9c4bMhdZ6oCpqKZYZhSPHK3ZGrVmJHTRCPmL2n+vI+BYtQHfbaC" +
      "cD5wWn2ZZoGnuyAYn+4pjup/H+IKpBZ7uw0p715G65sX+aUm6Zb0v1iTF3QZ7mbV" +
      "9Psy3n0CAwEAAaMPMA0wCwYDVR0PBAQDAgACMAsGCSqGSIb3DQEBCwOCAQEANxUt" +
      "zRzgLI+8ixF8IP8DaTpVNb936zos7hTF/o0Hi1iPWC1WlXvu5FlhzFC0Zevk9h2D" +
      "Fs2IGjdPZGOLMpwVp00o3Z6PnBo0rIPNOH3ptxknch+Igj9K0DV/IpJXaf21u4MT" +
      "Q0/xUE9Lg2ap7eIVoReEYP8MvH/C3Geqg7hRfZ9bD0lltgpMKAMvFqf6ivM8xPDT" +
      "Jk3d3vCYIkKqiZxDMk4AhFgBveoWRgHm9n/TL5QnO0Qj5aK7oTtk86bHlYprMdQY" +
      "rqU/UgmA1q9P+vaIf83JaPIk9sVEL5EmAAOjbWGORxQhHp3rbqqjiTkEr9ACwTiM" +
      "OweFDzvXExm0El6HdjGCAbcwggGzAgEBMCMwHjEcMAkGA1UEBhMCUlUwDwYDVQQD" +
      "HggAVABlAHMAdAIBATANBglghkgBZQMEAgEFAKBpMBgGCSqGSIb3DQEJAzELBgkq" +
      "hkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTIxMDcyMTEyMDUyMFowLwYJKoZIhvcN" +
      "AQkEMSIEIPLKG7bH6QfQba/kaH5Xn852s35Ok7dgUCLaUubMwm/SMAsGCSqGSIb3" +
      "DQEBCwSCAQDIyv0B/Z7ylchO+4VKU3+83dmpnqeQa8UacNmoT9jmuRemXLkjDuCs" +
      "LQbmo0uZY6BUdhCSyegI5GaIhfkdlXALGyyMg+ZYrOabLJ9RQ1zlk6fD8UZL7ih8" +
      "0x1S7CN5Oq9FEMdyYSgNof3gP8k0BzEuQSFa1mRW1UHbzWkMx99DSi9DHdMPvIaB" +
      "Eky1LY3r+CU+kzV0+Al1WkfSXQ2w1gdr5vLrs1osmNhuK9LUfhYByYoAFxnwxEBP" +
      "xscwrRK2g4RdhmFvHhT3RKZT12p+NZqexzkkMIYso+DCYFT66Fy+yC9uTJ/7rARq" +
      "d4sO/vmLB9MFCMbdvsEJNvj/4/tedg8cAAAAAAAA";

    const contentInfo = AsnParser.parse(Convert.FromBase64(pem), ContentInfo);
    assert.strictEqual(contentInfo.contentType, id_signedData);

    const signedData = AsnParser.parse(contentInfo.content, SignedData);
    assert.strictEqual(!!signedData, true);

    const signer = signedData.signerInfos[0];
    assert.strictEqual(signer.version, 1);
    assert.ok(signer.sid.issuerAndSerialNumber);
  });

  it("parse CMS with SignerInfo version 3", () => {
    const rpkiMftB64 = "MIIHegYJKoZIhvcNAQcCoIIHazCCB2cCAQMxDzANBglghkgBZQMEAgEFADCB4gYLKoZIhvcNAQkQARqg" +
      "gdIEgc8wgcwCFAENDJ9DKFg6a/e5tj8Sq6XsJk0AGA8yMDIxMDYyOTE3MjAyM1oYDzIwMjExMjMwMTgy" +
      "MDIzWgYJYIZIAWUDBAIBMIGGME0WKDVlNGEyM2VhLWU4MGEtNDAzZS1iMDhjLTIxNzFkYTIxNTdkMy5j" +
      "ZXIDIQDdvsR8ZqiAhaeRC0XWNl8bv4tKPrF/pDghqotUc8nerzA1FhBhcmluLXJwa2ktdGEuY3JsAyEA" +
      "Q4DLnJEqUJsJavhuOSFbF7xURKeTtCqez5JptqZr5jSgggS6MIIEtjCCA56gAwIBAgIUAQ0Mn0MoWDpr" +
      "97miMnAxCovs+oAwDQYJKoZIhvcNAQELBQAwFzEVMBMGA1UEAxMMYXJpbi1ycGtpLXRhMB4XDTIxMDYy" +
      "OTE3MjAyM1oXDTIxMTIzMDE4MjAyM1owLzEtMCsGA1UEAxMkYTUxNGYzYmMtMmEyMC00ZGMzLTk1Mzgt" +
      "NWFiODhiZWMxYzZlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu0gRRsCGYdaNKSARedui" +
      "fDJBoN7O7DmWDES6XtImK/H2FFvOeTOhuh9l1V+JrG3jme2vLC2E6bNmbB3HrpnVZtqqgREIIKKdUsUz" +
      "Zf/ItCkQQ0TV0jrKFVRJWyBJyG7t/+U/gR5WX7ayzv45ka6kNES+p5iXuoSAadVOO4o0/vRr4geZ+hkK" +
      "CoUGvxPbyZHk4vRO8avDwbnRg44eS8SZYKXLsLnnKW6hhNHioRIyANABuqGf7427YESam1frGedWBMEV" +
      "UdzwFx4uO+kKFQzcdBSbDYq42GdAewZ+ukHSRs8hntEbb2ZjFEKyu8PaUiQ+c+DWj+7mR+Y5sS8LE8qb" +
      "DwIDAQABo4IB4DCCAdwwHQYDVR0OBBYEFESIeM9tGe3J1PC9I5FEEFS5uHBHMFoGCCsGAQUFBwELBE4w" +
      "TDBKBggrBgEFBQcwC4Y+cnN5bmM6Ly9ycGtpLmFyaW4ubmV0L3JlcG9zaXRvcnkvYXJpbi1ycGtpLXRh" +
      "L2FyaW4tcnBraS10YS5tZnQwTwYDVR0fBEgwRjBEoEKgQIY+cnN5bmM6Ly9ycGtpLmFyaW4ubmV0L3Jl" +
      "cG9zaXRvcnkvYXJpbi1ycGtpLXRhL2FyaW4tcnBraS10YS5jcmwwHwYDVR0jBBgwFoAUE9TyT5qfzZjb" +
      "NvkwYxgIyI85dLwwDgYDVR0PAQH/BAQDAgeAME0GCCsGAQUFBwEBBEEwPzA9BggrBgEFBQcwAoYxcnN5" +
      "bmM6Ly9ycGtpLmFyaW4ubmV0L3JlcG9zaXRvcnkvYXJpbi1ycGtpLXRhLmNlcjAhBggrBgEFBQcBBwEB" +
      "/wQSMBAwBgQCAAEFADAGBAIAAgUAMBUGCCsGAQUFBwEIAQH/BAYwBKACBQAwVAYDVR0gAQH/BEowSDBG" +
      "BggrBgEFBQcOAjA6MDgGCCsGAQUFBwIBFixodHRwczovL3d3dy5hcmluLm5ldC9yZXNvdXJjZXMvcnBr" +
      "aS9jcHMuaHRtbDANBgkqhkiG9w0BAQsFAAOCAQEAK7C1nrNoQD8OTX+XVbUK/kMltMgire0+QddU/XdX" +
      "Ko0wghXMe0Y+QnGTXCKjZTK7Z3ajOvdaeENiO/1EGe5Db3j2B9RsmLquySNcwCodajTOLsHavYWUQgql" +
      "RcEelbT3UwgCzihBnXZCoUyBaYQVyidyPnJr4AIc9RkC8w3jIutu2vewCRU1g7uYfiEaCv6J8+l2RpZc" +
      "aK+dbqNC6WhUDAxsmS0KjjFNK6bGRy+Od+zlMwS9P/Jkiw6q++ud+QzPhdcnZyHC7fe7f1QtbDEiKe5j" +
      "cNXkEPMVNXEbTXPJ1dmIBMF6dVGsVYiHlhifbgqg8pPYYeIeP0/09nWX5Med1zGCAawwggGoAgEDgBRE" +
      "iHjPbRntydTwvSORRBBUubhwRzANBglghkgBZQMEAgEFAKBrMBoGCSqGSIb3DQEJAzENBgsqhkiG9w0B" +
      "CRABGjAcBgkqhkiG9w0BCQUxDxcNMjEwNjI5MTcyMDIzWjAvBgkqhkiG9w0BCQQxIgQgmQgjda0elAPh" +
      "EuLwS72w6uxYjJi/J1grTnMx2ap2FKEwDQYJKoZIhvcNAQELBQAEggEArx6Zj/emmmn9VWjY5bzQPebI" +
      "lf6PHeW0Z2I9xZsQcIaNMNQQX4K+QyPmFe2i5WFeUExcaw3JM8l4EKg3EM9E0V7evkY1PilT/QbXm0bA" +
      "Q5vo1Vzfe/cgkHV051ySS3gkBaNfindua6rN7Bft25fKiBvWY0bmKkSUvFOOb+bUfr0Lw5LLdwfXFaN1" +
      "0l6lRMEg7jPbOABwQpc66dFb+lQc6bvn0kNMv5iLzlpYwe+PpH4cWhaJRq59bym3XOpBe6gkvGeHR0dC" +
      "TYbY3LQ33K7LWpVJwB9Oalvx6dvvU9zhwX+nE6oLPSkwbC5J9OIdIq8W62aEBsZ8qRJU79a/JM676Q==";
    const rpkiMftBuffer = Buffer.from(rpkiMftB64, "base64");

    const contentInfo = AsnConvert.parse(rpkiMftBuffer, ContentInfo);
    const signedData = AsnConvert.parse(contentInfo.content, SignedData);

    const signer = signedData.signerInfos[0];
    assert.strictEqual(signer.version, 3);
    assert.ok(signer.sid.subjectKeyIdentifier);
  });

  context("EncapsulatedContentInfo", () => {

    it("parse constructed OCTET STREAM", () => {
      const pem = "MIAGCSqGSIb3DQEHAaCAJIAAAAAAAAA=";

      const contentInfo = AsnParser.parse(Convert.FromBase64(pem), EncapsulatedContentInfo);
      assert.strictEqual(contentInfo.eContentType, id_data);
      assert.strictEqual(contentInfo.eContent?.any?.byteLength, 4);
    });

    it("parse single OCTET STREAM", () => {
      const pem = "308006092A864886F70D010701A080040000000000";

      const contentInfo = AsnParser.parse(Convert.FromHex(pem), EncapsulatedContentInfo);
      assert.strictEqual(contentInfo.eContentType, id_data);
      assert.strictEqual(contentInfo.eContent?.single?.byteLength, 0);
    });

    it("parse signer info", () => {
      const sidRaw = "8014448878CF6D19EDC9D4F0BD2391441054B9B87047";
      const sid = AsnConvert.parse(Buffer.from(sidRaw, "hex"), SignerIdentifier);

      assert.ok(sid.subjectKeyIdentifier);
      assert.strictEqual(Convert.ToHex(sid.subjectKeyIdentifier), "448878cf6d19edc9d4f0bd2391441054b9b87047");
    });

  });

  context("EnvelopedData", () => {

    it("parse CMS with EnvelopedData", () => {
      const pem = "MIAGCSqGSIb3DQEHA6CAMIACAQIxggFcMIIBWAIBADBAMCsxKTAnBgNVBAMeIAB0" +
      "AGUAcwB0AEAAZQB4AGEAbQBwAGwAZQAuAGMAbwBtAhEArCY1BXmx0dEycmMiIYRa" +
      "cDANBgkqhkiG9w0BAQEFAASCAQAfvvx+Gp/pI4NciVPywwu1l3ivfZ1K7s10RTf4" +
      "jgclZn3ShOvBDsxbnf/KcgpxIeKo3Ik6xHCS9TEu0caVb41VBsKKeHd3vfkeCFjO" +
      "kctoTiFoi03G5vZqAHBXOsM+9ngl2YYob22Wp9DPh6TuHzmyWNJv6XU86RePEk0m" +
      "O6bxRucYNyryOSy1tGnw1BksJdsKxJHsM93WpTNfJUPRM5GQpLnL4swE/czubnqL" +
      "LjeuAmGSWxjMgJCFBhEa1vGI85MlB5HVgMedlu/DlnKdTTKPATEX4HNVlTkxjw4U" +
      "QFbqLJUkZLYGt+PXMlbpTdC8o3Flh8z7NsbBCtjnCqEqjO+9MIAGCSqGSIb3DQEH" +
      "ATAdBglghkgBZQMEASoEEApTJq854NYO1bqCHf1wlJuggAQQGlV/5YkunKR5KRYg" +
      "L36BkQAAAAAAAAAAAAA="

      const contentInfo = AsnParser.parse(Convert.FromBase64(pem), ContentInfo);
      assert.strictEqual(contentInfo.contentType, id_envelopedData);

      const envelopedData = AsnParser.parse(contentInfo.content, EnvelopedData);
      assert.strictEqual(!!envelopedData, true);

      const recipientInfo = envelopedData.recipientInfos[0];
      assert.strictEqual(!!recipientInfo.ktri, true);

      assert.ok(recipientInfo?.ktri?.rid?.issuerAndSerialNumber);
    });

  });

});
