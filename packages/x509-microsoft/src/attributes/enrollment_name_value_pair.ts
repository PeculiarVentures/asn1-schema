import { AsnArray, AsnType, AsnTypeTypes, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

export const id_enrollmenNameValuePair = "1.3.6.1.4.1.311.13.2.1";

/**
 * ```
 * EnrollmentNameValuePair ::= SEQUENCE {
 *   name                BMPSTRING,
 *   value               BMPSTRING
 * }  --#public
 * ```
 * [List of possible values](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-wcce/92f07a54-2889-45e3-afd0-94b60daa80ec)
 */
export class EnrollmentNameValuePair {

  @AsnProp({ type: AsnPropTypes.BmpString })
  public name = "";

  @AsnProp({ type: AsnPropTypes.BmpString })
  public value = "";

  constructor(params: Partial<EnrollmentNameValuePair> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * EnrollmentNameValuePairs ::= SEQUENCE OF EnrollmentNameValuePair
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: EnrollmentNameValuePair })
export class EnrollmentNameValuePairs extends AsnArray<EnrollmentNameValuePair> {

  constructor(items?: EnrollmentNameValuePair[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, EnrollmentNameValuePairs.prototype);
  }

}
