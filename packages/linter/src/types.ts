import { AsnNode, ParseContext } from "@peculiar/asn1-codec";

/**
 * Validation profile types
 */
export type ValidationProfile = "der" | "ber" | "x509";

/**
 * Validation level
 */
export type ValidationLevel = "basic" | "strict";

/**
 * Lint issue severity
 */
export type LintSeverity = "error" | "warning" | "info";

/**
 * Individual lint issue
 */
export interface LintIssue {
  /** Issue severity */
  severity: LintSeverity;
  /** Rule that triggered the issue */
  rule: string;
  /** Human-readable message */
  message: string;
  /** Path to the node (e.g., "root.tbsCertificate.subject") */
  path: string;
  /** Byte offset in the original data */
  position: number;
  /** Length of the problematic data */
  length?: number;
  /** Additional context information */
  context?: Record<string, unknown>;
}

/**
 * Lint report containing all issues found
 */
export interface LintReport {
  /** Total number of issues */
  issueCount: number;
  /** Issues grouped by severity */
  issues: {
    errors: LintIssue[];
    warnings: LintIssue[];
    info: LintIssue[];
  };
  /** Overall validation result */
  valid: boolean;
  /** Validation profile used */
  profile: ValidationProfile;
  /** Validation level used */
  level: ValidationLevel;
  /** Execution time in milliseconds */
  executionTime?: number;
}

/**
 * Validation rule function
 */
export interface ValidationRule {
  /** Rule identifier */
  id: string;
  /** Rule description */
  description: string;
  /** Profiles this rule applies to */
  profiles: ValidationProfile[];
  /** Minimum level required for this rule */
  level: ValidationLevel;
  /** Rule implementation */
  validate: (node: AsnNode, data: Uint8Array, context: ValidationContext) => LintIssue | null;
}

/**
 * Validation context passed to rules
 */
export interface ValidationContext {
  /** Current validation profile */
  profile: ValidationProfile;
  /** Current validation level */
  level: ValidationLevel;
  /** Current path in the ASN.1 tree */
  path: string;
  /** Parse context */
  parseContext: ParseContext;
  /** Current validation options */
  options: LintOptions;
}

/**
 * Lint options
 */
export interface LintOptions {
  /** Validation profile to use */
  profile?: ValidationProfile;
  /** Validation level */
  level?: ValidationLevel;
  /** Custom rules to add */
  customRules?: ValidationRule[];
  /** Rules to disable */
  disabledRules?: string[];
  /** Maximum number of issues to report (0 = unlimited) */
  maxIssues?: number;
  /** Stop on first error */
  stopOnError?: boolean;
}
