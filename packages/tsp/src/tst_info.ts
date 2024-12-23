import { AsnIntegerArrayBufferConverter, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { Extensions, GeneralName } from "@peculiar/asn1-x509";
import { Accuracy } from "./accuracy";
import { MessageImprint } from "./message_imprint";

export enum TSTInfoVersion {
  v1 = 1,
}

/**
 * ```asn1
 * TSTInfo ::= SEQUENCE  {
 *   version                      INTEGER  { v1(1) },
 *   policy                       TSAPolicyId,
 *   messageImprint               MessageImprint,
 *     -- MUST have the same value as the similar field in
 *     -- TimeStampReq
 *   serialNumber                 INTEGER,
 *    -- Time-Stamping users MUST be ready to accommodate integers
 *    -- up to 160 bits.
 *   genTime                      GeneralizedTime,
 *   accuracy                     Accuracy                 OPTIONAL,
 *   ordering                     BOOLEAN             DEFAULT FALSE,
 *   nonce                        INTEGER                  OPTIONAL,
 *     -- MUST be present if the similar field was present
 *     -- in TimeStampReq.  In that case it MUST have the same value.
 *   tsa                          [0] GeneralName          OPTIONAL,
 *   extensions                   [1] IMPLICIT Extensions  OPTIONAL   }
 * ```
 */

export class TSTInfo {
  @AsnProp({ type: AsnPropTypes.Integer })
  public version = TSTInfoVersion.v1;

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public policy = "";

  /**
   * MUST have the same value as the similar field in TimeStampReq
   */
  @AsnProp({ type: MessageImprint })
  public messageImprint = new MessageImprint();

  /**
   * Time-Stamping users MUST be ready to accommodate integers up to 160 bits
   */
  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public serialNumber = new ArrayBuffer(0);

  @AsnProp({ type: AsnPropTypes.GeneralizedTime })
  public genTime = new Date();

  @AsnProp({ type: Accuracy, optional: true })
  public accuracy?: Accuracy;

  @AsnProp({ type: AsnPropTypes.Boolean, defaultValue: false })
  public ordering = false;

  /**
   * MUST be present if the similar field was present in TimeStampReq.
   * In that case it MUST have the same value
   */
  @AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter,
    optional: true,
  })
  public nonce?: ArrayBuffer;

  @AsnProp({ type: GeneralName, context: 0, optional: true })
  public tsa?: GeneralName;

  @AsnProp({ type: Extensions, context: 1, implicit: true, optional: true })
  public extensions?: Extensions;

  constructor(params: Partial<TSTInfo> = {}) {
    Object.assign(this, params);
  }
}
