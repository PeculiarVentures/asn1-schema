// -- Biometric info extension

import { id_pe, AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";

/**
 * ```
 * id-pe-biometricInfo OBJECT IDENTIFIER  ::= {id-pe 2}
 * ```
 */
export const id_pe_biometricInfo = `${id_pe}.2`;

/**
 * ```
 * PredefinedBiometricType ::= INTEGER {
 *   picture(0), handwritten-signature(1)}
 *   (picture|handwritten-signature)
 * ```
 */
export enum PredefinedBiometricType {
  picture = 0,
  handwrittenSignature = 1,
}

/**
 * ```
 * TypeOfBiometricData ::= CHOICE {
 *     predefinedBiometricType   PredefinedBiometricType,
 *     biometricDataOid          OBJECT IDENTIFIER }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class TypeOfBiometricData {

  @AsnProp({ type: AsnPropTypes.Integer })
  public predefinedBiometricType?: PredefinedBiometricType;

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public biometricDataOid?: "";

  constructor(params: Partial<TypeOfBiometricData> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * BiometricData ::= SEQUENCE {
 *   typeOfBiometricData  TypeOfBiometricData,
 *   hashAlgorithm        AlgorithmIdentifier,
 *   biometricDataHash    OCTET STRING,
 *   sourceDataUri        IA5String OPTIONAL }
 * ```
 */
export class BiometricData {

  @AsnProp({ type: TypeOfBiometricData })
  public typeOfBiometricData = new TypeOfBiometricData();

  @AsnProp({ type: AlgorithmIdentifier })
  public hashAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.OctetString })
  public biometricDataHash = new ArrayBuffer(0);

  @AsnProp({ type: AsnPropTypes.IA5String, optional: true })
  public sourceDataUri?: string;

  constructor(params: Partial<BiometricData> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * BiometricSyntax ::= SEQUENCE OF BiometricData
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: BiometricData })
export class BiometricSyntax extends AsnArray<BiometricData> { }
