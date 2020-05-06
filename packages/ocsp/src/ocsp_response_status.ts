/**
 * ```
 * OCSPResponseStatus ::= ENUMERATED {
 *   successful          (0),  -- Response has valid confirmations
 *   malformedRequest    (1),  -- Illegal confirmation request
 *   internalError       (2),  -- Internal error in issuer
 *   tryLater            (3),  -- Try again later
 *                             -- (4) is not used
 *   sigRequired         (5),  -- Must sign the request
 *   unauthorized        (6)   -- Request unauthorized
 * }
 * ```
 */
export enum OCSPResponseStatus {
  /**
   * Response has valid confirmations
   */
  successful = 0,
  /**
   * Illegal confirmation request
   */
  malformedRequest = 1,
  /**
   * Internal error in issuer
   */
  internalError = 2,
  /**
   * Try again later
   */
  tryLater = 3,
  /**
   * Must sign the request
   */
  sigRequired = 5,
  /**
   * Request unauthorized
   */
  unauthorized = 6,
}
