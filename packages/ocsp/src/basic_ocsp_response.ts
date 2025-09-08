import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier, Certificate } from "@peculiar/asn1-x509";
import { ResponseData } from "./response_data";

// basicResponse RESPONSE ::=
//  { BasicOCSPResponse IDENTIFIED BY id-pkix-ocsp-basic }

/**
 * ```asn1
 * BasicOCSPResponse ::= SEQUENCE {
 *   tbsResponseData          ResponseData,
 *   signatureAlgorithm       AlgorithmIdentifier,
 *   signature                BIT STRING,
 *   certs                [0] EXPLICIT SEQUENCE OF Certificate OPTIONAL }
 * ```
 */
export class BasicOCSPResponse {
  @AsnProp({ type: ResponseData, raw: true })
  public tbsResponseData = new ResponseData();

  public tbsResponseDataRaw?: ArrayBuffer;

  @AsnProp({ type: AlgorithmIdentifier })
  public signatureAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public signature = new ArrayBuffer(0);

  @AsnProp({ type: Certificate, repeated: "sequence", optional: true, context: 0 })
  public certs?: Certificate[];

  constructor(params: Partial<BasicOCSPResponse> = {}) {
    Object.assign(this, params);
  }
}
