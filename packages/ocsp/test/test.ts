import * as assert from "assert";
import { AsnParser, AsnSerializer, OctetString } from "@peculiar/asn1-schema";
import { Convert } from "pvtsutils";
import { OCSPRequest, TBSRequest, CertID, Request } from "../src";
import { GeneralName, AlgorithmIdentifier } from "@peculiar/asn1-x509";

context("ocsp", () => {
  it("request", () => {
    const hex = "3060305ea122a420301e311c3009060355040613025255300f06035504031e080054006500730074301f301d301b300706052b0e03021a04047f01020304047f01020302047f010203a2173015301306092b0601050507300102040604047f010203";
    const request = AsnParser.parse(Convert.FromHex(hex), OCSPRequest);
    assert.strictEqual(request.tbsRequest.version, 0);
  });

  it("request with optionalSignature", () => {
    const base64url = "MIIEbDCBk6FKpEgwRjELMAkGA1UEBhMCVVMxEzARBgNVBAoTCkdvb2dsZSBJbmMxIjAgBgNVBAMTGUdvb2dsZSBJbnRlcm5ldCBBdXRob3JpdHkwRTBDMEEwBwYFKw4DAhoEFNQ7ZxOrGoZ58LcOFp6d-IntOHpLBBS_wDDr9UMRPme6npH7_Gra42sSJAIKQ8fjjgAAAABh3qCCA9IwggPOMAsGCSqGSIb3DQEBDQOCAQEAg3Z-FFijVF1WQJk3UxjMRDKZ25PQMvXAOclvC841jL1dx0Y-Z2oA-YLV4hKBAnZGUSs5sYHR34L0VWozBeO3gbHT_BkEOR0BeNoLj3Tpv4_0O7AGCYeX9s2dWpNP5tWYjhNnGhLCpNz1oC0DzCXMm-szDtvk7Fl78zdQAD6eJBQ7foLSQuBZym4ePjICfQAo60WZewDOck6QGdYrF7xcuKa8ieY3sP2c6BXdkKjYYWTGd0MEq7ggj1YHtxRGjKzdLygGCRTO47nNtT2b8UkwDdvP590fjiCI6fHZJmRIrm5VnhPIXUEJDVFY_FA-Ww-7FXFSeiHPWXbfiP1SR1kdD6CCArgwggK0MIICsDCCAhmgAwIBAgIDC2dxMA0GCSqGSIb3DQEBBQUAME4xCzAJBgNVBAYTAlVTMRAwDgYDVQQKEwdFcXVpZmF4MS0wKwYDVQQLEyRFcXVpZmF4IFNlY3VyZSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkwHhcNMDkwNjA4MjA0MzI3WhcNMTMwNjA3MTk0MzI3WjBGMQswCQYDVQQGEwJVUzETMBEGA1UEChMKR29vZ2xlIEluYzEiMCAGA1UEAxMZR29vZ2xlIEludGVybmV0IEF1dGhvcml0eTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAye23pIucV-eEPkB9hPSP0XFjU5nneXQUr0SZMyCSjXvlKAy6rWxJfoNfNFlOCnowzdDXxFdF7dWq1nMmzq0yE7jXDx07393cCDaob1FEm8rWIFJztyaHNWrbqeXUWaUr_GcZOfqTGBhs3t0lig4zFEfC7wFQeeT9adGnwKziV28CAwEAAaOBozCBoDAOBgNVHQ8BAf8EBAMCAQYwHQYDVR0OBBYEFL_AMOv1QxE-Z7qekfv8atrjaxIkMB8GA1UdIwQYMBaAFEjmaPkr0rKV10fYIyAQTzOYkJ_UMBIGA1UdEwEB_wQIMAYBAf8CAQAwOgYDVR0fBDMwMTAvoC2gK4YpaHR0cDovL2NybC5nZW90cnVzdC5jb20vY3Jscy9zZWN1cmVjYS5jcmwwDQYJKoZIhvcNAQEFBQADgYEAuIojxkiWsRF8YHdeBZqrocb6ghwYB8TrgbCoZutJqOkM0ymt9e8kTP3kS8p_XmOrmSfLnzYhLLkQYGfN0rTw8Ktx5YtaiScRhKqOv5nwnQkhClIZmloJ0pC3-gz4fniisIWvXEyZ2VxVKfmlUUIuOss4jHg7y_j7lYe8vJD5UDI";
    const request = AsnParser.parse(Convert.FromBase64Url(base64url), OCSPRequest);
    assert.strictEqual(request.tbsRequest.version, 0);
    assert(request.optionalSignature);
    assert(request.optionalSignature.certs);
    assert.strictEqual(request.optionalSignature.certs.length, 1);
  });

  it("request build", () => {
    var request = new OCSPRequest({
      tbsRequest: new TBSRequest({
        requestorName: new GeneralName({
          iPAddress: "1.0.1.0",
        }),
        requestList: [
          new Request({
            reqCert: new CertID({
              hashAlgorithm: new AlgorithmIdentifier({
                algorithm: "1.3.14.3.2.26",
              }),
              issuerNameHash: new OctetString(Convert.FromHex("7F010203")),
              issuerKeyHash: new OctetString(Convert.FromHex("7F010203")),
              serialNumber: Convert.FromHex("7F010203"),
            })
          }),
        ]
      }),
    });
    const der = AsnSerializer.serialize(request);
    assert.strictEqual(Convert.ToHex(der), "302b3029a106870401000100301f301d301b300706052b0e03021a04047f01020304047f01020302047f010203");
  })
});
