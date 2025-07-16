import { AsnArray, AsnProp, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { AttributeTypeAndValue } from "@peculiar/asn1-x509";
import { CertRequest } from "./cert_request";
import { ProofOfPossession } from "./proof_of_possession";

/**
 * ```asn1
 * CertReqMsg ::= SEQUENCE {
 *  certReq   CertRequest,
 *  popo       ProofOfPossession  OPTIONAL,
 *  -- content depends upon key type
 *  regInfo   SEQUENCE SIZE(1..MAX) OF AttributeTypeAndValue OPTIONAL }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class CertReqMsg {
  @AsnProp({ type: CertRequest })
  public certReq = new CertRequest();

  @AsnProp({ type: ProofOfPossession, optional: true })
  public popo?: ProofOfPossession;

  @AsnProp({ type: AttributeTypeAndValue, repeated: "sequence", optional: true })
  public regInfo?: AttributeTypeAndValue[];

  constructor(params: Partial<CertReqMsg> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * CertReqMessages ::= SEQUENCE SIZE (1..MAX) OF CertReqMsg
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: CertReqMsg })
export class CertReqMessages extends AsnArray<CertReqMsg> {
  constructor(items?: CertReqMsg[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CertReqMessages.prototype);
  }
}
