// -- Personal data attributes

import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { DirectoryString } from "@peculiar/asn1-x509";
import { id_pda } from "./object_identifiers";

/**
 * ```asn1
 * id-pda-dateOfBirth          AttributeType ::= { id-pda 1 }
 * ```
 */
export const id_pds_dateOfBirth = `${id_pda}.1`;

/**
 * ```asn1
 * DateOfBirth ::=             GeneralizedTime
 * ```
 */
export type DateOfBirth = Date;

/**
 * ```asn1
 * id-pda-placeOfBirth         AttributeType ::= { id-pda 2 }
 * ```
 */
export const id_pds_placeOfBirth = `${id_pda}.2`;

/**
 * ```asn1
 * PlaceOfBirth ::=            DirectoryString
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class PlaceOfBirth extends DirectoryString {}

/**
 * ```asn1
 * id-pda-gender               AttributeType ::= { id-pda 3 }
 * ```
 */
export const id_pda_gender = `${id_pda}.3`;

/**
 * ```asn1
 * Gender ::=                  PrintableString (SIZE(1))
 *                             -- "M", "F", "m" or "f"
 * ```
 */
export enum Gender {
  M = "M",
  F = "F",
  m = "m",
  f = "f",
}

/**
 * ```asn1
 * id-pda-countryOfCitizenship AttributeType ::= { id-pda 4 }
 * ```
 */
export const id_pda_countryOfCitizenship = `${id_pda}.4`;

/**
 * ```asn1
 * CountryOfCitizenship ::=    PrintableString (SIZE (2))
 *                             -- ISO 3166 Country Code
 * ```
 */
export type CountryOfCitizenship = string;

/**
 * ```asn1
 * id-pda-countryOfResidence   AttributeType ::= { id-pda 5 }
 * ```
 */
export const id_pda_countryOfResidence = `${id_pda}.5`;

/**
 * ```asn1
 * CountryOfResidence ::=      PrintableString (SIZE (2))
 *                             -- ISO 3166 Country Code
 * ```
 */
export type CountryOfResidence = string;
