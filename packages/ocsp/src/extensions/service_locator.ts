import { AsnProp } from "@peculiar/asn1-schema";
import { AuthorityInfoAccessSyntax, Name } from "@peculiar/asn1-x509";

// re-ocsp-service-locator EXTENSION ::= { SYNTAX ServiceLocator
//   IDENTIFIED BY
//   id-pkix-ocsp-service-locator }

/**
 * ```asn1
 * ServiceLocator ::= SEQUENCE {
 *   issuer    Name,
 *   locator   AuthorityInfoAccessSyntax }
 * ```
 */
export class ServiceLocator {
  @AsnProp({ type: Name })
  public issuer = new Name();

  @AsnProp({ type: AuthorityInfoAccessSyntax })
  public locator = new AuthorityInfoAccessSyntax();

  constructor(params: Partial<ServiceLocator> = {}) {
    Object.assign(this, params);
  }
}
