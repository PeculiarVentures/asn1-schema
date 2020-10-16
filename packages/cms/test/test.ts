import { AsnParser } from "@peculiar/asn1-schema";
import * as assert from "assert";
import { Convert } from "pvtsutils";
import { ContentInfo, EncapsulatedContentInfo, id_data, id_signedData, SignedData } from "../src";

import * as asn1 from "asn1js";

context("cms", () => {

  it("parse", () => {
    const pem =
      "MIIIfQYJKoZIhvcNAQcCoIIIbjCCCGoCAQExADALBgkqhkiG9w0BBwGggghSMIIC" +
      "wjCCAaygAwIBAgIBATALBgkqhkiG9w0BAQUwHjEcMAkGA1UEBhMCUlUwDwYDVQQD" +
      "HggAVABlAHMAdDAeFw0xMjEyMzEyMDAwMDBaFw0xNTEyMzEyMTAwMDBaMB4xHDAJ" +
      "BgNVBAYTAlJVMA8GA1UEAx4IAFQAZQBzAHQwggEiMA0GCSqGSIb3DQEBAQUAA4IB" +
      "DwAwggEKAoIBAQCk50GKJAc8kh8NEztm6ooRjDJNA7Awqn9uvSnsRad5C7tlyB+Y" +
      "pDiha0VteHKwU9br94RKQFyPV7+XDCZa2bLpiAApXYqPOkv4WUV8mmonhFS5ui9e" +
      "SIOmcwRt2eLyRIb9wQVaynXm0PyHEbRyLfKVAHSY2j01l1nMsOOfsIFSqJWjzXdK" +
      "XzexKlDP2axyNgOztuJcEvp6EYNj9pK1frZ2s52CrPbeJ4N3P4moS7VaWUJ5XPQM" +
      "7XHCGzrMTc+aQEMIya11HafL/L0kr3Kz/vZDkTvOXrMDpsnaCnbI3Fwaocr90gov" +
      "Qa7sr+MBkxvkAiZlhg4Omq/CbIBDLx+qAklDAgMBAAGjDzANMAsGA1UdDwQEAwIA" +
      "AjALBgkqhkiG9w0BAQUDggEBACHYNIjYrzmNP/nONpoBKGnctJisNZ+0k80dv2A8" +
      "83jZuXyk/YuPBgo3xThnHgdVW7xve17CnQx9018ulOWmYVB37BJahKeAYG20/vH4" +
      "osAZz2bwl5VIJNolwRvnK+bAoYJo6Nd8AWTm5UhJ9SIcUEfevBQmhAfuTJZHrU3U" +
      "2ab3Vbys6uCEnYtg9W1mhKmpJI2zhCM1sFWLnJ42La6f2ccaBWp5OAcnsmeolQJ1" +
      "CjEKvM2yCPUp6VhzZIzETnHWqQgMBZ1oIOJF1ZJaWtvpg0dRQjqN91pNf3gGkket" +
      "P8F9i9n0m8wVF3FkutnP0ef9P21QcfVBBDA25GULvEIl3RIwggLCMIIBrKADAgEC" +
      "AgEBMAsGCSqGSIb3DQEBBTAeMRwwCQYDVQQGEwJSVTAPBgNVBAMeCABUAGUAcwB0" +
      "MB4XDTEyMTIzMTIwMDAwMFoXDTE1MTIzMTIxMDAwMFowHjEcMAkGA1UEBhMCUlUw" +
      "DwYDVQQDHggAVABlAHMAdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB" +
      "AKTnQYokBzySHw0TO2bqihGMMk0DsDCqf269KexFp3kLu2XIH5ikOKFrRW14crBT" +
      "1uv3hEpAXI9Xv5cMJlrZsumIACldio86S/hZRXyaaieEVLm6L15Ig6ZzBG3Z4vJE" +
      "hv3BBVrKdebQ/IcRtHIt8pUAdJjaPTWXWcyw45+wgVKolaPNd0pfN7EqUM/ZrHI2" +
      "A7O24lwS+noRg2P2krV+tnaznYKs9t4ng3c/iahLtVpZQnlc9AztccIbOsxNz5pA" +
      "QwjJrXUdp8v8vSSvcrP+9kORO85eswOmydoKdsjcXBqhyv3SCi9Bruyv4wGTG+QC" +
      "JmWGDg6ar8JsgEMvH6oCSUMCAwEAAaMPMA0wCwYDVR0PBAQDAgACMAsGCSqGSIb3" +
      "DQEBBQOCAQEAIdg0iNivOY0/+c42mgEoady0mKw1n7STzR2/YDzzeNm5fKT9i48G" +
      "CjfFOGceB1VbvG97XsKdDH3TXy6U5aZhUHfsElqEp4BgbbT+8fiiwBnPZvCXlUgk" +
      "2iXBG+cr5sChgmjo13wBZOblSEn1IhxQR968FCaEB+5MlketTdTZpvdVvKzq4ISd" +
      "i2D1bWaEqakkjbOEIzWwVYucnjYtrp/ZxxoFank4ByeyZ6iVAnUKMQq8zbII9Snp" +
      "WHNkjMROcdapCAwFnWgg4kXVklpa2+mDR1FCOo33Wk1/eAaSR60/wX2L2fSbzBUX" +
      "cWS62c/R5/0/bVBx9UEEMDbkZQu8QiXdEjCCAsIwggGsoAMCAQICAQEwCwYJKoZI" +
      "hvcNAQEFMB4xHDAJBgNVBAYTAlJVMA8GA1UEAx4IAFQAZQBzAHQwHhcNMTIxMjMx" +
      "MjAwMDAwWhcNMTUxMjMxMjEwMDAwWjAeMRwwCQYDVQQGEwJSVTAPBgNVBAMeCABU" +
      "AGUAcwB0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApOdBiiQHPJIf" +
      "DRM7ZuqKEYwyTQOwMKp/br0p7EWneQu7ZcgfmKQ4oWtFbXhysFPW6/eESkBcj1e/" +
      "lwwmWtmy6YgAKV2KjzpL+FlFfJpqJ4RUubovXkiDpnMEbdni8kSG/cEFWsp15tD8" +
      "hxG0ci3ylQB0mNo9NZdZzLDjn7CBUqiVo813Sl83sSpQz9mscjYDs7biXBL6ehGD" +
      "Y/aStX62drOdgqz23ieDdz+JqEu1WllCeVz0DO1xwhs6zE3PmkBDCMmtdR2ny/y9" +
      "JK9ys/72Q5E7zl6zA6bJ2gp2yNxcGqHK/dIKL0Gu7K/jAZMb5AImZYYODpqvwmyA" +
      "Qy8fqgJJQwIDAQABow8wDTALBgNVHQ8EBAMCAAIwCwYJKoZIhvcNAQEFA4IBAQAh" +
      "2DSI2K85jT/5zjaaAShp3LSYrDWftJPNHb9gPPN42bl8pP2LjwYKN8U4Zx4HVVu8" +
      "b3tewp0MfdNfLpTlpmFQd+wSWoSngGBttP7x+KLAGc9m8JeVSCTaJcEb5yvmwKGC" +
      "aOjXfAFk5uVISfUiHFBH3rwUJoQH7kyWR61N1Nmm91W8rOrghJ2LYPVtZoSpqSSN" +
      "s4QjNbBVi5yeNi2un9nHGgVqeTgHJ7JnqJUCdQoxCrzNsgj1KelYc2SMxE5x1qkI" +
      "DAWdaCDiRdWSWlrb6YNHUUI6jfdaTX94BpJHrT/BfYvZ9JvMFRdxZLrZz9Hn/T9t" +
      "UHH1QQQwNuRlC7xCJd0SMQA=";

    const contentInfo = AsnParser.parse(Convert.FromBase64(pem), ContentInfo);
    assert.strictEqual(contentInfo.contentType, id_signedData);

    const signedData = AsnParser.parse(contentInfo.content, SignedData);
    assert.strictEqual(!!signedData, true);
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

  });

});
