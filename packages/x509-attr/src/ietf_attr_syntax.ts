import { AsnProp, OctetString, AsnPropTypes } from "@peculiar/asn1-schema";
import { GeneralNames } from "@peculiar/asn1-x509";

/**
 * ```
 * CHOICE {
 *                    octets    OCTET STRING,
 *                    oid       OBJECT IDENTIFIER,
 *                    string    UTF8String
 * ```
 */
export class IetfAttrSyntaxValueChoices {

  @AsnProp({ type: OctetString })
  public cotets?: OctetString;

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public oid?: string;

  @AsnProp({ type: AsnPropTypes.Utf8String })
  public string?: string;

  constructor(params: Partial<IetfAttrSyntaxValueChoices> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * IetfAttrSyntax ::= SEQUENCE {
 *     policyAuthority[0] GeneralNames    OPTIONAL,
 *     values         SEQUENCE OF CHOICE {
 *                    octets    OCTET STRING,
 *                    oid       OBJECT IDENTIFIER,
 *                    string    UTF8String
 *    }
 * }
 * ```
 */
export class IetfAttrSyntax {

  @AsnProp({ type: GeneralNames, implicit: true, context: 0, optional: true })
  public policyAuthority?: GeneralNames;

  @AsnProp({ type: IetfAttrSyntaxValueChoices, repeated: "sequence" })
  public values: IetfAttrSyntaxValueChoices[] = [];

  constructor(params: Partial<IetfAttrSyntax> = {}) {
    Object.assign(this, params);
  }
}
