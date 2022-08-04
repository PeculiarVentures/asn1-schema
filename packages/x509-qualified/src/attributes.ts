// -- Personal data attributes

import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { DirectoryString } from "@peculiar/asn1-x509";
import { id_pda } from "./object_identifiers";

/**
 * ```
 * id-pda-dateOfBirth          AttributeType ::= { id-pda 1 }
 * ```
 */
export const id_pds_dateOfBirth = `${id_pda}.1`;

 /**
  * ```
  * DateOfBirth ::=             GeneralizedTime
  * ```
  */
export type DateOfBirth = Date;

/**
 * ```
 * id-pda-placeOfBirth         AttributeType ::= { id-pda 2 }
 * ```
 */
export const id_pds_placeOfBirth = `${id_pda}.2`;

/**
 * ```
 * PlaceOfBirth ::=            DirectoryString
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class PlaceOfBirth extends DirectoryString {}

/**
 * ```
 * id-pda-gender               AttributeType ::= { id-pda 3 }
 * ```
 */
export const id_pda_gender = `${id_pda}.3`;

/**
 * ```
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
 * ```
 * id-pda-countryOfCitizenship AttributeType ::= { id-pda 4 }
 * ```
 */
export const id_pda_countryOfCitizenship = `${id_pda}.4`;

/**
 * ```
 * CountryOfCitizenship ::=    PrintableString (SIZE (2))
 *                             -- ISO 3166 Country Code
 * ```
 */
export type CountryOfCitizenship = string;

/**
 * ```
 * id-pda-countryOfResidence   AttributeType ::= { id-pda 5 }
 * ```
 */
export const id_pda_countryOfResidence = `${id_pda}.5`;

/**
 * ```
 * CountryOfResidence ::=      PrintableString (SIZE (2))
 *                             -- ISO 3166 Country Code
 * ```
 */
export type CountryOfResidence = string;
