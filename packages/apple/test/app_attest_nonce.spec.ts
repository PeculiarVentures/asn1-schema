import { AsnParser, AsnConvert, OctetString } from "@peculiar/asn1-schema";

import { AppAttestNonce } from "@peculiar/asn1-apple";

describe("AppAttestNonce", () => {
    const rawExtensionHex = "3024a1220420d7a86e7233fb843eb0eeb407d8b76ff7e4f82d218cf5dbb461d752073f5cb29a";
    const expectedNonceHex = "d7a86e7233fb843eb0eeb407d8b76ff7e4f82d218cf5dbb461d752073f5cb29a";

    test("Should parse buffer to extension", () => {
        const buffer = Buffer.from(rawExtensionHex, "hex");
        const parsed = AsnParser.parse(buffer, AppAttestNonce);

        expect(parsed).toBeInstanceOf(AppAttestNonce);
        expect(parsed.nonce).toBeInstanceOf(OctetString);

        const nonceHex = Buffer.from(parsed.nonce.buffer).toString("hex");
        expect(nonceHex).toBe(expectedNonceHex);
    });

    test("Should serialize extension to buffer", () => {
        const extension = new AppAttestNonce({
            nonce: new OctetString(Buffer.from(expectedNonceHex, "hex"))
        });

        const serialized = AsnConvert.serialize(extension);

        const serializedHex = Buffer.from(serialized).toString("hex");
        expect(serializedHex).toBe(rawExtensionHex);
    });
});