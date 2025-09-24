import { AsnNode, AsnNodeUtils } from "@peculiar/asn1-codec";
import {
  LintOptions,
  LintReport,
  LintIssue,
  ValidationProfile,
  ValidationLevel,
  ValidationContext,
  ValidationRule,
} from "./types";
import { coreValidationRules } from "./rules";

/**
 * ASN.1 Linter - performs semantic validation on parsed ASN.1 structures
 */
export class AsnLinter {
  private rules: Map<string, ValidationRule> = new Map();

  constructor() {
    // Register core validation rules
    for (const rule of coreValidationRules) {
      this.rules.set(rule.id, rule);
    }
  }

  /**
   * Add custom validation rule
   */
  addRule(rule: ValidationRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove validation rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Get all registered rules
   */
  getRules(): ValidationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Lint ASN.1 structure
   */
  lint(root: AsnNode, options: LintOptions = {}): LintReport {
    const parseContext = AsnNodeUtils.getContext(root);

    const startTime = performance.now();

    const profile: ValidationProfile = options.profile || "der";
    const level: ValidationLevel = options.level || "basic";
    const maxIssues = options.maxIssues || 0;
    const stopOnError = options.stopOnError || false;
    const disabledRules = new Set(options.disabledRules || []);

    const issues: LintIssue[] = [];

    // Create validation context
    const context: ValidationContext = {
      profile,
      level,
      path: "root",
      parseContext,
      options,
    };

    // Get applicable rules
    const applicableRules = this.getApplicableRules(profile, level, disabledRules);

    // Add custom rules
    if (options.customRules) {
      for (const rule of options.customRules) {
        if (
          !disabledRules.has(rule.id) &&
          rule.profiles.includes(profile) &&
          this.isLevelApplicable(rule.level, level)
        ) {
          applicableRules.push(rule);
        }
      }
    }

    // Validate the tree
    this.validateNode(
      root,
      parseContext.data,
      context,
      applicableRules,
      issues,
      maxIssues,
      stopOnError,
    );

    const endTime = performance.now();

    // Group issues by severity
    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");
    const info = issues.filter((i) => i.severity === "info");

    return {
      issueCount: issues.length,
      issues: { errors, warnings, info },
      valid: errors.length === 0,
      profile,
      level,
      executionTime: endTime - startTime,
    };
  }

  /**
   * Validate a single node and its children recursively
   */
  private validateNode(
    node: AsnNode,
    data: Uint8Array,
    context: ValidationContext,
    rules: ValidationRule[],
    issues: LintIssue[],
    maxIssues: number,
    stopOnError: boolean,
  ): boolean {
    // Check if we've hit the issue limit
    if (maxIssues > 0 && issues.length >= maxIssues) {
      return false;
    }

    // Validate current node with all applicable rules
    for (const rule of rules) {
      try {
        const issue = rule.validate(node, data, context);
        if (issue) {
          issues.push(issue);

          if (stopOnError && issue.severity === "error") {
            return false;
          }

          if (maxIssues > 0 && issues.length >= maxIssues) {
            return false;
          }
        }
      } catch (error) {
        // Rule execution failed - add as internal error
        issues.push({
          severity: "error",
          rule: rule.id,
          message: `Rule execution failed: ${error instanceof Error ? error.message : String(error)}`,
          path: context.path,
          position: node.start,
          length: node.end - node.start,
        });
      }
    }

    // Recursively validate children
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childPath = `${context.path}[${i}]`;

        // If the child has a field name (from schema binding), use that
        const finalPath = child.fieldName ? `${context.path}.${child.fieldName}` : childPath;

        const childContext: ValidationContext = {
          ...context,
          path: finalPath,
        };

        const shouldContinue = this.validateNode(
          child,
          data,
          childContext,
          rules,
          issues,
          maxIssues,
          stopOnError,
        );

        if (!shouldContinue) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Get rules applicable for the given profile and level
   */
  private getApplicableRules(
    profile: ValidationProfile,
    level: ValidationLevel,
    disabledRules: Set<string>,
  ): ValidationRule[] {
    return Array.from(this.rules.values()).filter(
      (rule) =>
        !disabledRules.has(rule.id) &&
        rule.profiles.includes(profile) &&
        this.isLevelApplicable(rule.level, level),
    );
  }

  /**
   * Check if rule level is applicable for current validation level
   */
  private isLevelApplicable(ruleLevel: ValidationLevel, currentLevel: ValidationLevel): boolean {
    if (currentLevel === "strict") {
      return true; // Strict mode includes all rules
    }
    return ruleLevel === "basic"; // Basic mode only includes basic rules
  }
}

/**
 * Convenience function to create and use linter
 */
export function lint(root: AsnNode, options: LintOptions = {}): LintReport {
  const linter = new AsnLinter();
  return linter.lint(root, options);
}
