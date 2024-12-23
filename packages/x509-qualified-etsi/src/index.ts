import { AsnArray, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

/**
 * Alphabetic or numeric currency code as defined in ISO 4217. It is recommended that the Alphabetic form is used
 * ```asn1
 * Iso4217CurrencyCode ::= CHOICE {
 *   alphabetic PrintableString (SIZE (3)), -- Recommended
 *   numeric INTEGER (1..999) }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class Iso4217CurrencyCode {
  /**
   * ```asn1
   * alphabetic PrintableString (SIZE (3)), -- Recommended
   * ```
   */
  @AsnProp({ type: AsnPropTypes.PrintableString })
  public alphabetic?: string;

  /**
   * ```asn1
   * numeric INTEGER (1..999)
   * ```
   */
  @AsnProp({ type: AsnPropTypes.PrintableString })
  public numeric?: number;

  /**
   * Creates a new instance of {@link Iso4217CurrencyCode}
   * @param alphabetic Alphabetic currency code (size 3). Recommended
   */
  public constructor(alphabetic?: string);
  /**
   * Creates a new instance of {@link Iso4217CurrencyCode}
   * @param numeric Numeric currency code (1..999)
   */
  public constructor(numeric?: number);
  public constructor(value?: string | number) {
    if (typeof value === "string") {
      this.alphabetic = value;
    } else if (typeof value === "number") {
      this.numeric = value;
    }
  }
}

/**
 * ```asn1
 * MonetaryValue::= SEQUENCE {
 *   currency Iso4217CurrencyCode,
 *   amount INTEGER,
 *   exponent INTEGER}
 *   -- value = amount * 10^exponent
 * ```
 */
export class MonetaryValue {
  /**
   * ```asn1
   * currency Iso4217CurrencyCode
   * ```
   */
  @AsnProp({ type: Iso4217CurrencyCode })
  public currency = new Iso4217CurrencyCode();

  /**
   * ```asn1
   * amount INTEGER
   * ```
   */
  @AsnProp({ type: AsnPropTypes.Integer })
  public amount = 0;

  /**
   * ```asn1
   * exponent INTEGER
   * ```
   */
  @AsnProp({ type: AsnPropTypes.Integer })
  public exponent = 0;

  public constructor(params: Partial<MonetaryValue> = {}) {
    Object.assign(this, params);
  }
}

/**
 * Declaration of limit value. Identified by {@link id_etsi_qcs_qcLimitValue}
 * ```asn1
 * QcEuLimitValue ::= MonetaryValue
 *
 *   MonetaryValue::= SEQUENCE {
 *     currency Iso4217CurrencyCode,
 *     amount INTEGER,
 *     exponent INTEGER}
 *     -- value = amount * 10^exponent
 *
 *   Iso4217CurrencyCode ::= CHOICE {
 *     alphabetic PrintableString (SIZE (3)), -- Recommended
 *     numeric INTEGER (1..999) }
 *     -- Alphabetic or numeric currency code as defined in ISO 4217
 *     -- It is recommended that the Alphabetic form is used
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class QcEuLimitValue extends MonetaryValue {}

/**
 * Retention period declaration. Identified by {@link id_etsi_qcs_qcRetentionPeriod}
 * ```asn1
 * QcEuRetentionPeriod ::= INTEGER
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class QcEuRetentionPeriod {
  @AsnProp({ type: AsnPropTypes.Integer })
  public value: number;

  public constructor(value = 0) {
    this.value = value;
  }
}

/**
 * ```asn1
 * PdsLocation::= SEQUENCE {
 *   url IA5String,
 *   language PrintableString (SIZE(2))} --ISO 639-1 language code
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class PdsLocation {
  /**
   * ```asn1
   * url IA5String
   * ```
   */
  @AsnProp({ type: AsnPropTypes.IA5String })
  public url = "";

  /**
   * ```asn1
   * language PrintableString (SIZE(2))} --ISO 639-1 language code
   * ```
   */
  @AsnProp({ type: AsnPropTypes.PrintableString })
  public language = "";

  public constructor(params: Partial<PdsLocation> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * PdsLocations ::= SEQUENCE SIZE (1..MAX) OF PdsLocation
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: PdsLocation })
export class PdsLocations extends AsnArray<PdsLocation> {
  constructor(items?: PdsLocation[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PdsLocations.prototype);
  }
}

/**
 * PKI Disclosure statements. Identified by {@link id_etsi_qcs_qcPDS}
 * ```asn1
 * QcEuPDS ::= PdsLocations
 *   PdsLocations ::= SEQUENCE SIZE (1..MAX) OF PdsLocation
 *   PdsLocation::= SEQUENCE {
 *     url IA5String,
 *     language PrintableString (SIZE(2))} --ISO 639-1 language code
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: PdsLocation })
export class QcEuPDS extends PdsLocations {
  constructor(items?: PdsLocation[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, QcEuPDS.prototype);
  }
}

/**
 * Certificate type. Identified by {@link id_etsi_qcs_qcType}
 * ```asn1
 * QcType::= SEQUENCE OF OBJECT IDENTIFIER (id-etsi-qct-esign | id-etsi-qct-eseal |
 *                                         id-etsi-qct-web, ...)
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AsnPropTypes.ObjectIdentifier })
export class QcType extends AsnArray<string> {
  constructor(items?: string[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, QcType.prototype);
  }
}

/**
 * ```asn1
 * CountryName ::= PrintableString (SIZE (2)) (export constRAINED BY { -- ISO 3166 alpha-2 codes only -- })
 * ```
 */
export type CountryName = string;

/**
 * Country or set of countries under the legislation of which the certificate is issued as a
 * qualified certificate. Identified by {@link id_etsi_qcs_qcCClegislation}
 * ```asn1
 * QcCClegislation ::= SEQUENCE OF CountryName
 *
 *   CountryName ::= PrintableString (SIZE (2)) (export constRAINED BY { -- ISO 3166 alpha-2 codes only -- })
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AsnPropTypes.PrintableString })
export class QcCClegislation extends AsnArray<CountryName> {
  /**
   * Create a new insatnce of {@link QcCClegislation}
   * @param items The list of country names. ISO 3166 alpha-2 codes only.
   */
  constructor(items?: CountryName[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, QcCClegislation.prototype);
  }
}

//#region object identifiers

/**
 * ```asn1
 * id-etsi-qcs OBJECT IDENTIFIER ::= { itu-t(0) identified-organization(4) etsi(0) id-qc-profile(1862) 1 }
 * ```
 */
export const id_etsi_qcs = "0.4.0.1862.1";

/**
 * ```asn1
 * id-etsi-qcs-QcCompliance OBJECT IDENTIFIER ::= { id-etsi-qcs 1 }
 * ```
 */
export const id_etsi_qcs_qcCompliance = `${id_etsi_qcs}.1`;

/**
 * ```asn1
 * id-etsi-qcs-QcLimitValue OBJECT IDENTIFIER ::= { id-etsi-qcs 2 }
 * ```
 */
export const id_etsi_qcs_qcLimitValue = `${id_etsi_qcs}.2`;

/**
 * ```asn1
 * id-etsi-qcs-QcRetentionPeriod OBJECT IDENTIFIER ::= { id-etsi-qcs 3 }
 * ```
 */
export const id_etsi_qcs_qcRetentionPeriod = `${id_etsi_qcs}.3`;

/**
 * ```asn1
 * id-etsi-qcs-QcSSCD OBJECT IDENTIFIER ::= { id-etsi-qcs 4 }
 * ```
 */
export const id_etsi_qcs_qcSSCD = `${id_etsi_qcs}.4`;

/**
 * ```asn1
 * id-etsi-qcs-QcPDS OBJECT IDENTIFIER ::= { id-etsi-qcs 5 }
 * ```
 */
export const id_etsi_qcs_qcPDS = `${id_etsi_qcs}.5`;

/**
 * ```asn1
 * id-etsi-qcs-QcType OBJECT IDENTIFIER ::= { id-etsi-qcs 6 }
 * ```
 */
export const id_etsi_qcs_qcType = `${id_etsi_qcs}.6`;

/**
 * ```asn1
 * id-etsi-qcs-QcCClegislation OBJECT IDENTIFIER ::= { id-etsi-qcs 7 }
 * ```
 */
export const id_etsi_qcs_qcCClegislation = `${id_etsi_qcs}.7`;

//#endregion

//#region QC type identifiers
/**
 * Certificate for electronic signatures as defined in Regulation (EU) No 910/2014
 * ```asn1
 * id-etsi-qct-esign OBJECT IDENTIFIER ::= { id-etsi-qcs-QcType 1 }
 * ```
 */
export const id_etsi_qct_esign = `${id_etsi_qcs_qcType}.1`;

/**asn1
 * Certificate for electronic seals as defined in Regulation (EU) No 910/2014
 * ```asn1
 * id-etsi-qct-eseal OBJECT IDENTIFIER ::= { id-etsi-qcs-QcType 2 }
 * ```
 */
export const id_etsi_qct_eseal = `${id_etsi_qcs_qcType}.2`;

/**
 * Certificate for website authentication defined in Regulation (EU) No 910/2014
 * ```asn1
 * id-etsi-qct-web OBJECT IDENTIFIER ::= { id-etsi-qcs-QcType 3 }
 * ```
 */
export const id_etsi_qct_web = `${id_etsi_qcs_qcType}.3`;

//#endregion
