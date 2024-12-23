/**
 * ```asn1
 * PKIStatus ::= INTEGER {
 *   granted                (0),
 *   -- when the PKIStatus contains the value zero a TimeStampToken, as
 *      requested, is present.
 *   grantedWithMods        (1),
 *    -- when the PKIStatus contains the value one a TimeStampToken,
 *      with modifications, is present.
 *   rejection              (2),
 *   waiting                (3),
 *   revocationWarning      (4),
 *    -- this message contains a warning that a revocation is
 *    -- imminent
 *   revocationNotification (5)
 *    -- notification that a revocation has occurred   }
 * ```
 */

export enum PKIStatus {
  /**
   * when the PKIStatus contains the value zero a TimeStampToken, as requested, is present
   */
  granted = 0,
  /**
   * when the PKIStatus contains the value one a TimeStampToken, with modifications, is present
   */
  grantedWithMods = 1,
  rejection = 2,
  waiting = 3,
  /**
   * this message contains a warning that a revocation is imminent
   */
  revocationWarning = 4,
  /**
   * notification that a revocation has occurred
   */
  revocationNotification = 5,
}
