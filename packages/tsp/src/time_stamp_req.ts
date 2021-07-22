import { AsnIntegerArrayBufferConverter, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { Extensions } from "@peculiar/asn1-x509";
import { MessageImprint } from "./message_imprint";

export enum TimeStampReqVersion {
  v1 = 1,
}

/**
 * ```
 * TSAPolicyId ::= OBJECT IDENTIFIER
 * ```
 */

export type TSAPolicyId = string;
/**
 * ```
 * TimeStampReq ::= SEQUENCE  {
 *   version                  INTEGER  { v1(1) },
 *   messageImprint           MessageImprint,
 *     --a hash algorithm OID and the hash value of the data to be
 *     --time-stamped
 *   reqPolicy                TSAPolicyId                OPTIONAL,
 *   nonce                    INTEGER                    OPTIONAL,
 *   certReq                  BOOLEAN                    DEFAULT FALSE,
 *   extensions               [0] IMPLICIT Extensions    OPTIONAL  }
 * ```
 */

export class TimeStampReq {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version = TimeStampReqVersion.v1;

  @AsnProp({ type: MessageImprint })
  public messageImprint = new MessageImprint();

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier, optional: true })
  public reqPolicy?: TSAPolicyId;

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter, optional: true })
  public nonce?: ArrayBuffer;

  @AsnProp({ type: AsnPropTypes.Boolean, defaultValue: false })
  public certReq = false;

  @AsnProp({ type: Extensions, optional: true, context: 0, implicit: true })
  public extensions?: Extensions;

  constructor(params: Partial<TimeStampReq> = {}) {
    Object.assign(this, params);
  }

}
