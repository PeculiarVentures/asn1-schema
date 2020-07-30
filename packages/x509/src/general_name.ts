import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, AsnOctetStringConverter, IAsnConverter } from "@peculiar/asn1-schema";
import { IpConverter } from "./ip_converter";
import { DirectoryString, Name } from "./name";

export const AsnIpConverter: IAsnConverter<string> = {
  fromASN: (value: any) => IpConverter.toString(AsnOctetStringConverter.fromASN(value)),
  toASN: (value: string) => AsnOctetStringConverter.toASN(IpConverter.fromString(value)),
};

/**
 * ```
 * OtherName ::= SEQUENCE {
 *   type-id    OBJECT IDENTIFIER,
 *   value      [0] EXPLICIT ANY DEFINED BY type-id }
 * ```
 */
export class OtherName {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public typeId: string = "";

  @AsnProp({ type: AsnPropTypes.Any, context: 0 })
  public value: ArrayBuffer = new ArrayBuffer(0);

  constructor(params: Partial<OtherName> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * EDIPartyName ::= SEQUENCE {
 *   nameAssigner            [0]     DirectoryString OPTIONAL,
 *   partyName               [1]     DirectoryString }
 * ```
 */
export class EDIPartyName {

  @AsnProp({ type: DirectoryString, optional: true, context: 0, implicit: true })
  public nameAssigner?: DirectoryString;

  @AsnProp({ type: DirectoryString, context: 1, implicit: true })
  public partyName: ArrayBuffer = new ArrayBuffer(0);

  constructor(params: Partial<EDIPartyName> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * GeneralName ::= CHOICE {
 *   otherName                       [0]     OtherName,
 *   rfc822Name                      [1]     IA5String,
 *   dNSName                         [2]     IA5String,
 *   x400Address                     [3]     ORAddress,
 *   directoryName                   [4]     Name,
 *   ediPartyName                    [5]     EDIPartyName,
 *   uniformResourceIdentifier       [6]     IA5String,
 *   iPAddress                       [7]     OCTET STRING,
 *   registeredID                    [8]     OBJECT IDENTIFIER }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class GeneralName {

  @AsnProp({ type: OtherName, context: 0, implicit: true })
  public otherName?: OtherName;

  @AsnProp({ type: AsnPropTypes.IA5String, context: 1, implicit: true })
  public rfc822Name?: string;

  @AsnProp({ type: AsnPropTypes.IA5String, context: 2, implicit: true })
  public dNSName?: string;

  @AsnProp({ type: AsnPropTypes.Any, context: 3, implicit: true })
  public x400Address?: ArrayBuffer; // TODO: Implement ORAddress

  @AsnProp({ type: Name, context: 4, implicit: false })
  public directoryName?: Name;

  @AsnProp({ type: EDIPartyName, context: 5 })
  public ediPartyName?: EDIPartyName;

  @AsnProp({ type: AsnPropTypes.IA5String, context: 6, implicit: true })
  public uniformResourceIdentifier?: string;

  @AsnProp({ type: AsnPropTypes.OctetString, context: 7, implicit: true, converter: AsnIpConverter })
  public iPAddress?: string;

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier, context: 8, implicit: true })
  public registeredID?: string;

  /**
   *
   * @param params
   */
  constructor(params: Partial<GeneralName> = {}) {
    Object.assign(this, params);
  }
}
