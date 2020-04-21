// -- QC Statements Extension
// -- NOTE: This extension does not allow to mix critical and
// -- non-critical Qualified Certificate Statements. Either all
// -- statements must be critical or all statements must be
// -- non-critical.

import { id_pe, GeneralName } from "@peculiar/asn1-x509";
import { AsnTypeTypes, AsnType, AsnArray, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { id_qcs } from "../object_identifiers";

/**
 * ```
 * id-pe-qcStatements OBJECT IDENTIFIER ::= { id-pe 3}
 * ```
 */
export const id_pe_qcStatements = `${id_pe}.3`;

/**
 * ```
 * QCStatement ::= SEQUENCE {
 *     statementId        OBJECT IDENTIFIER,
 *     statementInfo      ANY DEFINED BY statementId OPTIONAL}
 * ```
 */
export class QCStatement {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public statementId = "";

  @AsnProp({ type: AsnPropTypes.Any, optional: true })
  public statementInfo = new ArrayBuffer(0);
}

/**
 * ```
 * -- QC statements
 * id-qcs-pkixQCSyntax-v1   OBJECT IDENTIFIER ::= { id-qcs 1 }
 * --  This statement identifies conformance with requirements
 * --  defined in RFC 3039 (Version 1). This statement may
 * --  optionally contain additional semantics information as specified
 * --  below.
 * ```
 */
export const id_qcs_pkixQCSyntax_v1 = `${id_qcs}.1`;

/**
 * ```
 * id-qcs-pkixQCSyntax-v2   OBJECT IDENTIFIER ::= { id-qcs 2 }
 * --  This statement identifies conformance with requirements
 * --  defined in this Qualified Certificate profile
 * --  (Version 2). This statement may optionally contain
 * --  additional semantics information as specified below.
 * ```
 */
export const id_qcs_pkixQCSyntax_v2 = `${id_qcs}.2`;

/**
 * ```
 * NameRegistrationAuthorities ::= SEQUENCE SIZE (1..MAX) OF GeneralName
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: GeneralName })
export class NameRegistrationAuthorities extends AsnArray<GeneralName> { }

/**
 * ```
 * SemanticsInformation  ::= SEQUENCE {
 *     semanticsIdentifier        OBJECT IDENTIFIER OPTIONAL,
 *     nameRegistrationAuthorities NameRegistrationAuthorities OPTIONAL
 *     } -- At least one field shall be present
 * ```
 */
export class SemanticsInformation {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier, optional: true })
  public semanticsIdentifier?: string

  @AsnProp({ type: NameRegistrationAuthorities, optional: true })
  public nameRegistrationAuthorities?: NameRegistrationAuthorities;

  constructor(params: Partial<SemanticsInformation> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * QCStatements ::= SEQUENCE OF QCStatement
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: QCStatement })
export class QCStatements extends AsnArray<QCStatement> { }