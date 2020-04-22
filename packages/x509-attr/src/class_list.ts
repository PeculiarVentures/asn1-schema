import { BitString } from "@peculiar/asn1-schema";

export enum ClassListFlags {
  unmarked = 0x01,
  unclassified = 0x02,
  restricted = 0x04,
  confidential = 0x08,
  secret = 0x10,
  topSecret = 0x20,
}

/**
 * ```
 * ClassList  ::=  BIT STRING {
 *      unmarked       (0),
 *      unclassified   (1),
 *      restricted     (2),
 *      confidential   (3),
 *      secret         (4),
 *      topSecret      (5)
 * }
 * ```
 */
export class ClassList extends BitString<ClassListFlags> { }
