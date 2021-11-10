import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";
import { CRLNumber } from "./crl_number";

/**
 * ```
 * id-ce-deltaCRLIndicator OBJECT IDENTIFIER ::= { id-ce 27 }
 * ```
 */
export const  id_ce_deltaCRLIndicator = `${id_ce}.27`;

/**
 * ```
 * BaseCRLNumber ::= CRLNumber
 * ```
 */
 @AsnType({ type: AsnTypeTypes.Choice })
export class BaseCRLNumber extends CRLNumber { }
