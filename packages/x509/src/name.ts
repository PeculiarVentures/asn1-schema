import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";
import { Convert } from "pvtsutils";

/**
 * ```
 * AttributeType ::= OBJECT IDENTIFIER
 * ```
 */
export type AttributeType = string;

/**
 * ```
 * DirectoryString ::= CHOICE {
 *       teletexString           TeletexString (SIZE (1..MAX)),
 *       printableString         PrintableString (SIZE (1..MAX)),
 *       universalString         UniversalString (SIZE (1..MAX)),
 *       utf8String              UTF8String (SIZE (1..MAX)),
 *       bmpString               BMPString (SIZE (1..MAX)) }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class DirectoryString {

  @AsnProp({ type: AsnPropTypes.TeletexString })
  public teletexString?: string;

  @AsnProp({ type: AsnPropTypes.PrintableString })
  public printableString?: string;

  @AsnProp({ type: AsnPropTypes.UniversalString })
  public universalString?: string;

  @AsnProp({ type: AsnPropTypes.Utf8String })
  public utf8String?: string;

  @AsnProp({ type: AsnPropTypes.BmpString })
  public bmpString?: string;

  constructor(params: Partial<DirectoryString> = {}) {
    Object.assign(this, params);
  }

  public toString() {
    return this.bmpString || this.printableString || this.teletexString || this.universalString
      || this.utf8String || "";
  }
}

/**
 * ```
 * AttributeValue ::= ANY -- DEFINED BY AttributeType
 * in general it will be a DirectoryString
 * ```
 */
export class AttributeValue extends DirectoryString {

  @AsnProp({ type: AsnPropTypes.IA5String })
  public ia5String?: string;

  @AsnProp({ type: AsnPropTypes.Any })
  public anyValue?: ArrayBuffer;

  constructor(params: Partial<AttributeValue> = {}) {
    super(params);
    Object.assign(this, params);
  }

  public toString() {
    return this.ia5String || (this.anyValue ? Convert.ToHex(this.anyValue) : super.toString());
  }
}

/**
 * ```
 * AttributeTypeAndValue ::= SEQUENCE {
 *   type     AttributeType,
 *   value    AttributeValue }
 * ```
 */
export class AttributeTypeAndValue {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public type: string = "";

  @AsnProp({ type: AttributeValue })
  public value = new AttributeValue();

  constructor(params: Partial<AttributeTypeAndValue> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * RelativeDistinguishedName ::= SET SIZE (1..MAX) OF AttributeTypeAndValue
 * ```
 */
@AsnType({ type: AsnTypeTypes.Set, itemType: AttributeTypeAndValue })
export class RelativeDistinguishedName extends AsnArray<AttributeTypeAndValue> { }

/**
 * ```
 * RDNSequence ::= SEQUENCE OF RelativeDistinguishedName
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: RelativeDistinguishedName })
export class RDNSequence extends AsnArray<RelativeDistinguishedName> { }

/**
 * ```
 * Name ::= CHOICE { -- only one possibility for now --
 *   rdnSequence  RDNSequence }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class Name {

  @AsnProp({ type: RDNSequence })
  public rdnSequence = new RDNSequence();

  constructor(params: Partial<Name> = {}) {
    Object.assign(this, params);
  }
}
