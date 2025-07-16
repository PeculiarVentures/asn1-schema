import * as assert from "node:assert";
import { AsnConvert } from "@peculiar/asn1-schema";
import { CertReqMsg, CertReqMessages, CertRequest } from "@peculiar/asn1-crmf";

describe("crmf", () => {
  const pem = [
    "MIIB+zCCAQkwga4CAQEwgailFzAVMRMwEQYDVQQDDApleGFtcGxlVGxzplkwEwYH",
    "KoZIzj0CAQYIKoZIzj0DAQcDQgAEZv2tY5prQl2Nr7ipI9yg2C/jR99LgkMz1pn46",
    "RzTQRdqWw5MswLu5tQf0IeYheKd18Z6BDqUMKahPqe7v93Pr6kyMA4GA1UdDwEB/w",
    "QEAwIDKDAgBgNVHSUBAf8EFjAUBggrBgEFBQcDAQYIKwYBBQUHAwKhVjAKBggqhkj",
    "OPQQDAgNIADBFAiBBZuqmWvT5lSdNJxHQl6D1IIrA6CWWHjfB+QoqQePvKwIhAPby",
    "3FK4z2JGRJgRuWvh7eIaHwJQF/RQM6qRpFPYDxqkMIHrMIGQAgECMIGKpRswGTEX",
    "MBUGA1UEAwwOZXhhbXBsZVNpZ25pbmemWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCA",
    "AQByF9AGolb5YZeOzTqp3t/BXcWCxyQUyS7OojJYXnNg8Y4tsokDYbbN60EcmAv2W",
    "c3O/+J+o6Wj17EmIdZicK6qRAwDgYDVR0PAQH/BAQDAgeAoVYwCgYIKoZIzj0EAwI",
    "DSAAwRQIhAPr9WaR5ygIjaJsj/3b0S8coMGlFd2NK2pCihFA8chWoAiBh+3AhfqUg",
    "soDjO6r783r4FUlN3PqOZCWzRwhDv3PlZQ==",
  ].join("\n");

  it("create CertReqMsg", () => {
    const certReq = new CertRequest({
      certReqId: 1,
    });

    const certReqMsg = new CertReqMsg({
      certReq,
    });

    const der = AsnConvert.serialize(certReqMsg);
    assert.ok(der.byteLength > 0);

    const parsed = AsnConvert.parse(der, CertReqMsg);
    assert.strictEqual(parsed.certReq.certReqId, 1);
  });

  it("parse CertReqMessages from PEM", () => {
    const certReqMessages = AsnConvert.parse(Buffer.from(pem, "base64"), CertReqMessages);
    assert.strictEqual(certReqMessages.length, 2);
    assert.strictEqual(certReqMessages[0].certReq.certReqId, 1);
  });

  describe("parse vectors", () => {
    const vectors = [
      {
        name: "01_minimal",
        base64:
          "MIIBMTCCAS0CAQEwggEmpoIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysG5HzkjzGK2w6z6jfCOwv3MVBUB9clVwn0neFxwmOPii3gkVz+FM3Q2Q6713fc9Wun9g/Ka7Sw5kINQ7rprvaiKKpcpdokCAKTSxw1Wf0gF8CIDXmHDUF4plq965jmuMNy0dFfOv7pkkAyJ8WSLu+Qi5uGiiGmn8nGOSCTOzTnGLF3Tt/yAm0F/DhAXk3YMa2mzmmRmPC20OTu3mxKkIqlCPRARzbPDIs2FvCDKljJk4OMOqxUBEcqpiPutpJ6ERoPoWhqn472klUqJdWN1PLfRCWMRccMxgBbNZOAJ8ofko67Ub0Kf+77FG5sfLuLEdY2ny0KcJblfwKTG96w/NQIDAQAB",
      },
      {
        name: "02_with_subject",
        base64:
          "MIIBdTCCAXECAQIwggFqpUIwQDEVMBMGA1UEAwwMVGVzdCBTdWJqZWN0MRowGAYDVQQKDBFUZXN0IE9yZ2FuaXphdGlvbjELMAkGA1UEBhMCVVOmggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDKwbkfOSPMYrbDrPqN8I7C/cxUFQH1yVXCfSd4XHCY4+KLeCRXP4UzdDZDrvXd9z1a6f2D8prtLDmQg1Duumu9qIoqlyl2iQIApNLHDVZ/SAXwIgNeYcNQXimWr3rmOa4w3LR0V86/umSQDInxZIu75CLm4aKIaafycY5IJM7NOcYsXdO3/ICbQX8OEBeTdgxrabOaZGY8LbQ5O7ebEqQiqUI9EBHNs8MizYW8IMqWMmTg4w6rFQERyqmI+62knoRGg+haGqfjvaSVSol1Y3U8t9EJYxFxwzGAFs1k4Anyh+SjrtRvQp/7vsUbmx8u4sR1jafLQpwluV/ApMb3rD81AgMBAAE=",
      },
      {
        name: "03_with_extensions",
        base64:
          "MIIBdjCCAXICAQMwggFrpRwwGjEYMBYGA1UEAwwPV2l0aCBFeHRlbnNpb25zpoIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysG5HzkjzGK2w6z6jfCOwv3MVBUB9clVwn0neFxwmOPii3gkVz+FM3Q2Q6713fc9Wun9g/Ka7Sw5kINQ7rprvaiKKpcpdokCAKTSxw1Wf0gF8CIDXmHDUF4plq965jmuMNy0dFfOv7pkkAyJ8WSLu+Qi5uGiiGmn8nGOSCTOzTnGLF3Tt/yAm0F/DhAXk3YMa2mzmmRmPC20OTu3mxKkIqlCPRARzbPDIs2FvCDKljJk4OMOqxUBEcqpiPutpJ6ERoPoWhqn472klUqJdWN1PLfRCWMRccMxgBbNZOAJ8ofko67Ub0Kf+77FG5sfLuLEdY2ny0KcJblfwKTG96w/NQIDAQABqSUwCwYDVR0PBAQDAgWgMBYGA1UdEQQPMA2CC2V4YW1wbGUuY29t",
      },
      {
        name: "03a_with_issuer_serial",
        base64:
          "MIIBkzCCAY8CAQQwggGIgQQ63mixozUwMzEVMBMGA1UEAwwMUmVxdWVzdGVkIENBMRowGAYDVQQKDBFUcnVzdGVkIEF1dGhvcml0eaUjMCExHzAdBgNVBAMMFldpdGggSXNzdWVyIGFuZCBTZXJpYWymggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDKwbkfOSPMYrbDrPqN8I7C/cxUFQH1yVXCfSd4XHCY4+KLeCRXP4UzdDZDrvXd9z1a6f2D8prtLDmQg1Duumu9qIoqlyl2iQIApNLHDVZ/SAXwIgNeYcNQXimWr3rmOa4w3LR0V86/umSQDInxZIu75CLm4aKIaafycY5IJM7NOcYsXdO3/ICbQX8OEBeTdgxrabOaZGY8LbQ5O7ebEqQiqUI9EBHNs8MizYW8IMqWMmTg4w6rFQERyqmI+62knoRGg+haGqfjvaSVSol1Y3U8t9EJYxFxwzGAFs1k4Anyh+SjrtRvQp/7vsUbmx8u4sR1jafLQpwluV/ApMb3rD81AgMBAAE=",
      },
      {
        name: "03b_with_validity",
        base64:
          "MIIBfDCCAXgCAQUwggFxpCagERgPMjAyNDAxMDEwMDAwMDBaoREYDzIwMjUxMjMxMjM1OTU5WqUhMB8xHTAbBgNVBAMMFFdpdGggVmFsaWRpdHkgUGVyaW9kpoIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysG5HzkjzGK2w6z6jfCOwv3MVBUB9clVwn0neFxwmOPii3gkVz+FM3Q2Q6713fc9Wun9g/Ka7Sw5kINQ7rprvaiKKpcpdokCAKTSxw1Wf0gF8CIDXmHDUF4plq965jmuMNy0dFfOv7pkkAyJ8WSLu+Qi5uGiiGmn8nGOSCTOzTnGLF3Tt/yAm0F/DhAXk3YMa2mzmmRmPC20OTu3mxKkIqlCPRARzbPDIs2FvCDKljJk4OMOqxUBEcqpiPutpJ6ERoPoWhqn472klUqJdWN1PLfRCWMRccMxgBbNZOAJ8ofko67Ub0Kf+77FG5sfLuLEdY2ny0KcJblfwKTG96w/NQIDAQAB",
      },
      {
        name: "04_ra_verified_pop",
        base64:
          "MIIBUTCCAUsCAQYwggFEpRwwGjEYMBYGA1UEAwwPUkEgVmVyaWZpZWQgUE9QpoIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysG5HzkjzGK2w6z6jfCOwv3MVBUB9clVwn0neFxwmOPii3gkVz+FM3Q2Q6713fc9Wun9g/Ka7Sw5kINQ7rprvaiKKpcpdokCAKTSxw1Wf0gF8CIDXmHDUF4plq965jmuMNy0dFfOv7pkkAyJ8WSLu+Qi5uGiiGmn8nGOSCTOzTnGLF3Tt/yAm0F/DhAXk3YMa2mzmmRmPC20OTu3mxKkIqlCPRARzbPDIs2FvCDKljJk4OMOqxUBEcqpiPutpJ6ERoPoWhqn472klUqJdWN1PLfRCWMRccMxgBbNZOAJ8ofko67Ub0Kf+77FG5sfLuLEdY2ny0KcJblfwKTG96w/NQIDAQABgAA=",
      },
      {
        name: "05_signature_pop",
        base64:
          "MIICZTCCAUkCAQcwggFCpRowGDEWMBQGA1UEAwwNU2lnbmF0dXJlIFBPUKaCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMrBuR85I8xitsOs+o3wjsL9zFQVAfXJVcJ9J3hccJjj4ot4JFc/hTN0NkOu9d33PVrp/YPymu0sOZCDUO66a72oiiqXKXaJAgCk0scNVn9IBfAiA15hw1BeKZaveuY5rjDctHRXzr+6ZJAMifFki7vkIubhoohpp/Jxjkgkzs05xixd07f8gJtBfw4QF5N2DGtps5pkZjwttDk7t5sSpCKpQj0QEc2zwyLNhbwgypYyZODjDqsVARHKqYj7raSehEaD6Foap+O9pJVKiXVjdTy30QljEXHDMYAWzWTgCfKH5KOu1G9Cn/u+xRubHy7ixHWNp8tCnCW5X8CkxvesPzUCAwEAAaGCARQwDQYJKoZIhvcNAQELBQADggEBAAKo6liF6u78GlHrg1zCEFdg1sxtCQArXGpRdHsGZNFAj88uIUqCCJEWhOB1YbmN05e9GQrPCQcqTp+jb6lxX5VlkKAfRqaeVDKB+jMQOPlP9MXi/LfIt+CZNNJxekhCRu5KiTHhG4smHvC0TR7zTJCHSmmy9d13xSVldMt03QjBMJw8ROeNwXdfOlyzrWPphoBFjvVxNrp7hhkwPuUIhl6JmcryRwHEPcDzy79y52D60oMWs4XeZaqEZyp/FgWBuiT5HefUbJUvfVVcNFdpoKDAkBXv2rS5UHaHQMHBRyc6+l0bnFyuHprwk6KFrRAYybkVCk7XxI1QnrXKOR/xJu4=",
      },
      {
        name: "06_keyenc_pop",
        base64:
          "MIIBWTCCAVACAQgwggFJpSEwHzEdMBsGA1UEAwwUS2V5IEVuY2lwaGVybWVudCBQT1CmggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDKwbkfOSPMYrbDrPqN8I7C/cxUFQH1yVXCfSd4XHCY4+KLeCRXP4UzdDZDrvXd9z1a6f2D8prtLDmQg1Duumu9qIoqlyl2iQIApNLHDVZ/SAXwIgNeYcNQXimWr3rmOa4w3LR0V86/umSQDInxZIu75CLm4aKIaafycY5IJM7NOcYsXdO3/ICbQX8OEBeTdgxrabOaZGY8LbQ5O7ebEqQiqUI9EBHNs8MizYW8IMqWMmTg4w6rFQERyqmI+62knoRGg+haGqfjvaSVSol1Y3U8t9EJYxFxwzGAFs1k4Anyh+SjrtRvQp/7vsUbmx8u4sR1jafLQpwluV/ApMb3rD81AgMBAAGiA4EBAA==",
      },
      {
        name: "06a_keyagree_pop",
        base64:
          "MIIBUTCCAU0CAQkwggFGpR4wHDEaMBgGA1UEAwwRS2V5IEFncmVlbWVudCBQT1CmggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDKwbkfOSPMYrbDrPqN8I7C/cxUFQH1yVXCfSd4XHCY4+KLeCRXP4UzdDZDrvXd9z1a6f2D8prtLDmQg1Duumu9qIoqlyl2iQIApNLHDVZ/SAXwIgNeYcNQXimWr3rmOa4w3LR0V86/umSQDInxZIu75CLm4aKIaafycY5IJM7NOcYsXdO3/ICbQX8OEBeTdgxrabOaZGY8LbQ5O7ebEqQiqUI9EBHNs8MizYW8IMqWMmTg4w6rFQERyqmI+62knoRGg+haGqfjvaSVSol1Y3U8t9EJYxFxwzGAFs1k4Anyh+SjrtRvQp/7vsUbmx8u4sR1jafLQpwluV/ApMb3rD81AgMBAAE=",
      },
      {
        name: "07_with_regtoken",
        base64:
          "MIIBfTCCAXkCAQowggFCpRowGDEWMBQGA1UEAwwNV2l0aCByZWdUb2tlbqaCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMrBuR85I8xitsOs+o3wjsL9zFQVAfXJVcJ9J3hccJjj4ot4JFc/hTN0NkOu9d33PVrp/YPymu0sOZCDUO66a72oiiqXKXaJAgCk0scNVn9IBfAiA15hw1BeKZaveuY5rjDctHRXzr+6ZJAMifFki7vkIubhoohpp/Jxjkgkzs05xixd07f8gJtBfw4QF5N2DGtps5pkZjwttDk7t5sSpCKpQj0QEc2zwyLNhbwgypYyZODjDqsVARHKqYj7raSehEaD6Foap+O9pJVKiXVjdTy30QljEXHDMYAWzWTgCfKH5KOu1G9Cn/u+xRubHy7ixHWNp8tCnCW5X8CkxvesPzUCAwEAATAuMCwGCSsGAQUFBwUBAQwfc2VjcmV0LXJlZ2lzdHJhdGlvbi10b2tlbi0xMjM0NQ==",
      },
      {
        name: "08_with_authenticator",
        base64:
          "MIIBfDCCAXgCAQswggFHpR8wHTEbMBkGA1UEAwwSV2l0aCBBdXRoZW50aWNhdG9ypoIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysG5HzkjzGK2w6z6jfCOwv3MVBUB9clVwn0neFxwmOPii3gkVz+FM3Q2Q6713fc9Wun9g/Ka7Sw5kINQ7rprvaiKKpcpdokCAKTSxw1Wf0gF8CIDXmHDUF4plq965jmuMNy0dFfOv7pkkAyJ8WSLu+Qi5uGiiGmn8nGOSCTOzTnGLF3Tt/yAm0F/DhAXk3YMa2mzmmRmPC20OTu3mxKkIqlCPRARzbPDIs2FvCDKljJk4OMOqxUBEcqpiPutpJ6ERoPoWhqn472klUqJdWN1PLfRCWMRccMxgBbNZOAJ8ofko67Ub0Kf+77FG5sfLuLEdY2ny0KcJblfwKTG96w/NQIDAQABMCgwJgYJKwYBBQUHBQECDBltb3RoZXItbWFpZGVuLW5hbWUtc2VjcmV0",
      },
      {
        name: "09_with_oldcertid",
        base64:
          "MIIBfjCCAXoCAQwwggFIpSAwHjEcMBoGA1UEAwwTQ2VydGlmaWNhdGUgUmVuZXdhbKaCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMrBuR85I8xitsOs+o3wjsL9zFQVAfXJVcJ9J3hccJjj4ot4JFc/hTN0NkOu9d33PVrp/YPymu0sOZCDUO66a72oiiqXKXaJAgCk0scNVn9IBfAiA15hw1BeKZaveuY5rjDctHRXzr+6ZJAMifFki7vkIubhoohpp/Jxjkgkzs05xixd07f8gJtBfw4QF5N2DGtps5pkZjwttDk7t5sSpCKpQj0QEc2zwyLNhbwgypYyZODjDqsVARHKqYj7raSehEaD6Foap+O9pJVKiXVjdTy30QljEXHDMYAWzWTgCfKH5KOu1G9Cn/u+xRubHy7ixHWNp8tCnCW5X8CkxvesPzUCAwEAATApMCcGCSsGAQUFBwUBBTAapBMwETEPMA0GA1UEAwwGT2xkIENBAgMB4kA=",
      },
      {
        name: "09a_with_protocol_encr_key",
        base64:
          "MIICjzCCAosCAQ0wggFLpSMwITEfMB0GA1UEAwwWV2l0aCBQcm90b2NvbCBFbmNyIEtleaaCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMrBuR85I8xitsOs+o3wjsL9zFQVAfXJVcJ9J3hccJjj4ot4JFc/hTN0NkOu9d33PVrp/YPymu0sOZCDUO66a72oiiqXKXaJAgCk0scNVn9IBfAiA15hw1BeKZaveuY5rjDctHRXzr+6ZJAMifFki7vkIubhoohpp/Jxjkgkzs05xixd07f8gJtBfw4QF5N2DGtps5pkZjwttDk7t5sSpCKpQj0QEc2zwyLNhbwgypYyZODjDqsVARHKqYj7raSehEaD6Foap+O9pJVKiXVjdTy30QljEXHDMYAWzWTgCfKH5KOu1G9Cn/u+xRubHy7ixHWNp8tCnCW5X8CkxvesPzUCAwEAATCCATUwggExBgkrBgEFBQcFAQYwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDKwbkfOSPMYrbDrPqN8I7C/cxUFQH1yVXCfSd4XHCY4+KLeCRXP4UzdDZDrvXd9z1a6f2D8prtLDmQg1Duumu9qIoqlyl2iQIApNLHDVZ/SAXwIgNeYcNQXimWr3rmOa4w3LR0V86/umSQDInxZIu75CLm4aKIaafycY5IJM7NOcYsXdO3/ICbQX8OEBeTdgxrabOaZGY8LbQ5O7ebEqQiqUI9EBHNs8MizYW8IMqWMmTg4w6rFQERyqmI+62knoRGg+haGqfjvaSVSol1Y3U8t9EJYxFxwzGAFs1k4Anyh+SjrtRvQp/7vsUbmx8u4sR1jafLQpwluV/ApMb3rD81AgMBAAE=",
      },
      {
        name: "09b_with_publication_info",
        base64:
          "MIIBjzCCAYsCAQ4wggFKpSIwIDEeMBwGA1UEAwwVV2l0aCBQdWJsaWNhdGlvbiBJbmZvpoIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysG5HzkjzGK2w6z6jfCOwv3MVBUB9clVwn0neFxwmOPii3gkVz+FM3Q2Q6713fc9Wun9g/Ka7Sw5kINQ7rprvaiKKpcpdokCAKTSxw1Wf0gF8CIDXmHDUF4plq965jmuMNy0dFfOv7pkkAyJ8WSLu+Qi5uGiiGmn8nGOSCTOzTnGLF3Tt/yAm0F/DhAXk3YMa2mzmmRmPC20OTu3mxKkIqlCPRARzbPDIs2FvCDKljJk4OMOqxUBEcqpiPutpJ6ERoPoWhqn472klUqJdWN1PLfRCWMRccMxgBbNZOAJ8ofko67Ub0Kf+77FG5sfLuLEdY2ny0KcJblfwKTG96w/NQIDAQABMDgwNgYJKwYBBQUHBQEDMCkCAQEwJDAiAgEDhh1sZGFwOi8vZGlyZWN0b3J5LmV4YW1wbGUuY29tLw==",
      },
      {
        name: "10_with_utf8pairs",
        base64:
          "MIIBhzCCAUoCAQ8wggFDpRswGTEXMBUGA1UEAwwOV2l0aCB1dGY4UGFpcnOmggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDKwbkfOSPMYrbDrPqN8I7C/cxUFQH1yVXCfSd4XHCY4+KLeCRXP4UzdDZDrvXd9z1a6f2D8prtLDmQg1Duumu9qIoqlyl2iQIApNLHDVZ/SAXwIgNeYcNQXimWr3rmOa4w3LR0V86/umSQDInxZIu75CLm4aKIaafycY5IJM7NOcYsXdO3/ICbQX8OEBeTdgxrabOaZGY8LbQ5O7ebEqQiqUI9EBHNs8MizYW8IMqWMmTg4w6rFQERyqmI+62knoRGg+haGqfjvaSVSol1Y3U8t9EJYxFxwzGAFs1k4Anyh+SjrtRvQp/7vsUbmx8u4sR1jafLQpwluV/ApMb3rD81AgMBAAEwNzA1BgkrBgEFBQcFAgEMKGVtcGxveWVlSUQ/MTIzNDUlZGVwYXJ0bWVudD9FbmdpbmVlcmluZyU=",
      },
      {
        name: "10a_with_nested_certreq",
        base64:
          "MIIBUzCCAU8CARAwggFIpSAwHjEcMBoGA1UEAwwTV2l0aCBuZXN0ZWQgY2VydFJlcaaCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMrBuR85I8xitsOs+o3wjsL9zFQVAfXJVcJ9J3hccJjj4ot4JFc/hTN0NkOu9d33PVrp/YPymu0sOZCDUO66a72oiiqXKXaJAgCk0scNVn9IBfAiA15hw1BeKZaveuY5rjDctHRXzr+6ZJAMifFki7vkIubhoohpp/Jxjkgkzs05xixd07f8gJtBfw4QF5N2DGtps5pkZjwttDk7t5sSpCKpQj0QEc2zwyLNhbwgypYyZODjDqsVARHKqYj7raSehEaD6Foap+O9pJVKiXVjdTy30QljEXHDMYAWzWTgCfKH5KOu1G9Cn/u+xRubHy7ixHWNp8tCnCW5X8CkxvesPzUCAwEAAQ==",
      },
      {
        name: "11_full_crmf",
        base64:
          "MIID/zCCApYCAREwggJlgQQ7msn/ozYwNDEYMBYGA1UEAwwPRXhhbXBsZSBSb290IENBMRgwFgYDVQQKDA9FeGFtcGxlIENBIENvcnClgY8wgYwxGjAYBgNVBAMMEUZ1bGwgQ1JNRiBFeGFtcGxlMRYwFAYDVQQLDA1TZWN1cml0eSBUZWFtMRwwGgYDVQQKDBNFeGFtcGxlIENvcnBvcmF0aW9uMRYwFAYDVQQHDA1TYW4gRnJhbmNpc2NvMRMwEQYDVQQIDApDYWxpZm9ybmlhMQswCQYDVQQGEwJVU6aCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMrBuR85I8xitsOs+o3wjsL9zFQVAfXJVcJ9J3hccJjj4ot4JFc/hTN0NkOu9d33PVrp/YPymu0sOZCDUO66a72oiiqXKXaJAgCk0scNVn9IBfAiA15hw1BeKZaveuY5rjDctHRXzr+6ZJAMifFki7vkIubhoohpp/Jxjkgkzs05xixd07f8gJtBfw4QF5N2DGtps5pkZjwttDk7t5sSpCKpQj0QEc2zwyLNhbwgypYyZODjDqsVARHKqYj7raSehEaD6Foap+O9pJVKiXVjdTy30QljEXHDMYAWzWTgCfKH5KOu1G9Cn/u+xRubHy7ixHWNp8tCnCW5X8CkxvesPzUCAwEAAaltMAsGA1UdDwQEAwIEsDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwPwYDVR0RBDgwNoIPd3d3LmV4YW1wbGUuY29tghBtYWlsLmV4YW1wbGUuY29tgRFhZG1pbkBleGFtcGxlLmNvbTAoMCYGCSsGAQUFBwUBAQwZZnVsbC1leGFtcGxlLXRva2VuLWFiY2RlZqGCARQwDQYJKoZIhvcNAQELBQADggEBAKdBCsADTgbT44h27iDNdmmN317Scs0ha/19Jq1KcSZWcFzGi9MyCDduMNcfi5G+T3QpV/kWNxjI1SYyQ/pxaGlE8U0LKOV/CqkDUbkWmGwyX7J6sfHCkP6SkGmIyZdpan3cr+1SiJ52bzBx3sB6dTCbqTYO0nPLZJ/8mqpHOXkG+STyy2NizP785rbxnhTzi3/cenMwx/YCVF60capbmoNKV+OUXJo/GD3I8B5FtQIiHbjDxaY4ID/SJna+qMiU4BEB3Gd3Jwq8/lN27Q39jZ5q8jCq/ROBu9WdIWPc0NO263GXr8aflAOL2DoTlQ2pZIM6FZdTeuQm1hyDGJJw9lQwSzBJBgkrBgEFBQcFAgEMPHZlcnNpb24/MiVjb21wYW55P0V4YW1wbGUgQ29ycCVjb250YWN0P3NlY3VyaXR5QGV4YW1wbGUuY29tJQ==",
      },
    ];

    vectors.forEach((vector) => {
      it(vector.name, () => {
        const asn1Data = Buffer.from(vector.base64, "base64");
        AsnConvert.parse(asn1Data, CertReqMsg);
      });
    });
  });
});
