import { AsnConvert } from "@peculiar/asn1-schema";
import * as assert from "assert";
import { Convert } from "pvtsutils";
import {
  ContentInfo,
  EncapsulatedContentInfo,
  EnvelopedData,
  id_data,
  id_envelopedData,
  id_signedData,
  SignedData,
  SignerIdentifier,
} from "../src";

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

    const contentInfo = AsnConvert.parse(Convert.FromBase64(pem), ContentInfo);
    assert.strictEqual(contentInfo.contentType, id_signedData);

    const signedData = AsnConvert.parse(contentInfo.content, SignedData);
    assert.strictEqual(!!signedData, true);

    const signer = signedData.signerInfos[0];
    assert.strictEqual(signer.version, 1);
    assert.ok(signer.sid.issuerAndSerialNumber);
  });

  it("parse CMS with SignerInfo version 3", () => {
    const rpkiMftB64 =
      "MIIHegYJKoZIhvcNAQcCoIIHazCCB2cCAQMxDzANBglghkgBZQMEAgEFADCB4gYLKoZIhvcNAQkQARqg" +
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

      const contentInfo = AsnConvert.parse(Convert.FromBase64(pem), EncapsulatedContentInfo);
      assert.strictEqual(contentInfo.eContentType, id_data);
      assert.strictEqual(contentInfo.eContent?.any?.byteLength, 4);
    });

    it("parse single OCTET STREAM", () => {
      const pem = "308006092A864886F70D010701A080040000000000";

      const contentInfo = AsnConvert.parse(Convert.FromHex(pem), EncapsulatedContentInfo);
      assert.strictEqual(contentInfo.eContentType, id_data);
      assert.strictEqual(contentInfo.eContent?.single?.byteLength, 0);
    });

    it("parse signer info", () => {
      const sidRaw = "8014448878CF6D19EDC9D4F0BD2391441054B9B87047";
      const sid = AsnConvert.parse(Buffer.from(sidRaw, "hex"), SignerIdentifier);

      assert.ok(sid.subjectKeyIdentifier);
      assert.strictEqual(
        Convert.ToHex(sid.subjectKeyIdentifier),
        "448878cf6d19edc9d4f0bd2391441054b9b87047",
      );
    });
  });

  context("EnvelopedData", () => {
    const contentInfoPEMs = [
      {
        constructed: false,
        type: "KeyTransfer",
        pem:
          "MIIBtAYJKoZIhvcNAQcDoIIBpTCCAaECAQIxggFcMIIBWAIBADBAMCsxKTAnBgNV" +
          "BAMeIAB0AGUAcwB0AEAAZQB4AGEAbQBwAGwAZQAuAGMAbwBtAhEArCY1BXmx0dEy" +
          "cmMiIYRacDANBgkqhkiG9w0BAQEFAASCAQAfvvx+Gp/pI4NciVPywwu1l3ivfZ1K" +
          "7s10RTf4jgclZn3ShOvBDsxbnf/KcgpxIeKo3Ik6xHCS9TEu0caVb41VBsKKeHd3" +
          "vfkeCFjOkctoTiFoi03G5vZqAHBXOsM+9ngl2YYob22Wp9DPh6TuHzmyWNJv6XU8" +
          "6RePEk0mO6bxRucYNyryOSy1tGnw1BksJdsKxJHsM93WpTNfJUPRM5GQpLnL4swE" +
          "/czubnqLLjeuAmGSWxjMgJCFBhEa1vGI85MlB5HVgMedlu/DlnKdTTKPATEX4HNV" +
          "lTkxjw4UQFbqLJUkZLYGt+PXMlbpTdC8o3Flh8z7NsbBCtjnCqEqjO+9MDwGCSqG" +
          "SIb3DQEHATAdBglghkgBZQMEASoEEApTJq854NYO1bqCHf1wlJuAEBpVf+WJLpyk" +
          "eSkWIC9+gZE=",
      },
      {
        constructed: true,
        type: "KeyTransfer",
        pem:
          "MIAGCSqGSIb3DQEHA6CAMIACAQIxggFcMIIBWAIBADBAMCsxKTAnBgNVBAMeIAB0" +
          "AGUAcwB0AEAAZQB4AGEAbQBwAGwAZQAuAGMAbwBtAhEArCY1BXmx0dEycmMiIYRa" +
          "cDANBgkqhkiG9w0BAQEFAASCAQAfvvx+Gp/pI4NciVPywwu1l3ivfZ1K7s10RTf4" +
          "jgclZn3ShOvBDsxbnf/KcgpxIeKo3Ik6xHCS9TEu0caVb41VBsKKeHd3vfkeCFjO" +
          "kctoTiFoi03G5vZqAHBXOsM+9ngl2YYob22Wp9DPh6TuHzmyWNJv6XU86RePEk0m" +
          "O6bxRucYNyryOSy1tGnw1BksJdsKxJHsM93WpTNfJUPRM5GQpLnL4swE/czubnqL" +
          "LjeuAmGSWxjMgJCFBhEa1vGI85MlB5HVgMedlu/DlnKdTTKPATEX4HNVlTkxjw4U" +
          "QFbqLJUkZLYGt+PXMlbpTdC8o3Flh8z7NsbBCtjnCqEqjO+9MIAGCSqGSIb3DQEH" +
          "ATAdBglghkgBZQMEASoEEApTJq854NYO1bqCHf1wlJuggAQQGlV/5YkunKR5KRYg" +
          "L36BkQAAAAAAAAAAAAA=",
      },
      {
        constructed: true,
        type: "KeyAgreement",
        pem:
          "MIAGCSqGSIb3DQEHA6CAMIACAQIxggEvoYIBKwIBA6BboVkwEwYHKoZIzj0CAQYI" +
          "KoZIzj0DAQcDQgAEXYtv0mvYZS9r3T1ACG1snNX6rHze8c9WvN3GCpMECYnTUwk1" +
          "Oq6WOyZQK5DjOqE9QbvnagIGCeRW1hf0lFUwWqFCBEBicHhjiM0DncuQYs+uleiD" +
          "XUEusztkUu2KgTkmZe5WUuAiEMZZZEEv7rVOgjjOUJPPKrC3BoGe09AIP18vTwUm" +
          "MBUGBiuBBAELAzALBglghkgBZQMEAS0wbjBsMEAwKzEpMCcGA1UEAx4gAHQAZQBz" +
          "AHQAQABlAHgAYQBtAHAAbABlAC4AYwBvAG0CEQDt88GyTDvYPzAPACKBF9GRBCiE" +
          "/PPO0dDEeSaA+ZsPk5kyseTH+oF/17Vv1OOB/vteBuYOBzGvMU8ZMIAGCSqGSIb3" +
          "DQEHATAdBglghkgBZQMEASoEEF/kaKixfwI4FlzjI1SkA5mggAQQJB0YtxHaNhef" +
          "D3JOjs958wAAAAAAAAAAAAA=",
      },
      {
        constructed: true,
        type: "KeyAgreement",
        expected_buffer: Buffer.from("hello world; ".repeat(200), "ascii"),
        pem:
          "MIILrwYJKoZIhvcNAQcDoIILoDCCC5wCAQIxggEvoYIBKwIBA6BboVkwEwYHKoZIzj0CAQYIKoZIzj0D" +
          "AQcDQgAEXYtv0mvYZS9r3T1ACG1snNX6rHze8c9WvN3GCpMECYnTUwk1Oq6WOyZQK5DjOqE9QbvnagIG" +
          "CeRW1hf0lFUwWqFCBEBicHhjiM0DncuQYs+uleiDXUEusztkUu2KgTkmZe5WUuAiEMZZZEEv7rVOgjjO" +
          "UJPPKrC3BoGe09AIP18vTwUmMBUGBiuBBAELAzALBglghkgBZQMEAS0wbjBsMEAwKzEpMCcGA1UEAx4g" +
          "AHQAZQBzAHQAQABlAHgAYQBtAHAAbABlAC4AYwBvAG0CEQDt88GyTDvYPzAPACKBF9GRBCiE/PPO0dDE" +
          "eSaA+ZsPk5kyseTH+oF/17Vv1OOB/vteBuYOBzGvMU8ZMIIKYgYJKoZIhvcNAQcBMB0GCWCGSAFlAwQB" +
          "KgQQX+RoqLF/AjgWXOMjVKQDmaCCCjQEggQAaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3" +
          "b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhl" +
          "bGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3Js" +
          "ZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxv" +
          "IHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsg" +
          "aGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdv" +
          "cmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVs" +
          "bG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxk" +
          "OyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8g" +
          "d29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBo" +
          "ZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29y" +
          "bGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxs" +
          "byB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7" +
          "IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3" +
          "b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhl" +
          "bGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3Js" +
          "ZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxv" +
          "IHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybASCBABkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29y" +
          "bGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxs" +
          "byB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7" +
          "IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3" +
          "b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhl" +
          "bGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3Js" +
          "ZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxv" +
          "IHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsg" +
          "aGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdv" +
          "cmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVs" +
          "bG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxk" +
          "OyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8g" +
          "d29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBo" +
          "ZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29y" +
          "bGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxs" +
          "byB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7" +
          "IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3" +
          "b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3BIICKG9ybGQ7IGhlbGxvIHdvcmxk" +
          "OyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8g" +
          "d29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBo" +
          "ZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29y" +
          "bGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxs" +
          "byB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7" +
          "IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3" +
          "b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhl" +
          "bGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3Js" +
          "ZDsgaGVsbG8gd29ybGQ7IGhlbGxvIHdvcmxkOyBoZWxsbyB3b3JsZDsgaGVsbG8gd29ybGQ7IA==",
      },
    ];

    for (const { type, constructed, pem, expected_buffer } of contentInfoPEMs) {
      it(`parse CMS with ${type} EnvelopedData - ${constructed ? "constructed" : ""} OctetString`, () => {
        // parse contentInfo
        const contentInfo = AsnConvert.parse(Convert.FromBase64(pem), ContentInfo);
        assert.strictEqual(contentInfo.contentType, id_envelopedData);

        const envelopedData = AsnConvert.parse(contentInfo.content, EnvelopedData);
        assert.strictEqual(!!envelopedData, true);

        const recipientInfo = envelopedData.recipientInfos[0];

        switch (type) {
          case "KeyTransfer": {
            assert.strictEqual(!!recipientInfo.ktri, true);
            assert.ok(recipientInfo?.ktri?.rid?.issuerAndSerialNumber);
            break;
          }
          case "KeyAgreement": {
            assert.strictEqual(!!recipientInfo.kari, true);
            break;
          }
        }

        const encryptedContentInfo = envelopedData.encryptedContentInfo;
        assert.strictEqual(!!encryptedContentInfo, true);

        if (constructed) {
          const constructedValue = encryptedContentInfo.encryptedContent?.constructedValue;
          assert.strictEqual(!!constructedValue, true);

          if (constructedValue && expected_buffer) {
            const actualBuffer = Buffer.concat(constructedValue.map((o) => Buffer.from(o.buffer)));
            assert.notStrictEqual(actualBuffer, expected_buffer);
          }
        } else {
          assert.strictEqual(!!encryptedContentInfo.encryptedContent?.value, true);
        }
      });
    }
  });
});
