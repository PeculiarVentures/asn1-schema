import { AsnNodeUtils } from "../node-utils";
import {
  AsnNode,
  CompiledSchema,
  CompiledSchemaNode,
  AsnSchemaError,
  BindSchemaOptions,
} from "../types";

/**
 * Schema binder for two-phase parsing (simplified without byPath/byPredicate)
 */
export class SchemaBinder {
  /**
   * Bind schema to parsed AST
   */
  static bindSchema(
    root: AsnNode,
    schema: CompiledSchema,
    options: BindSchemaOptions = {},
  ): { root: AsnNode; errors: AsnSchemaError[] } {
    const ctx = AsnNodeUtils.getContext(root);
    const errors: AsnSchemaError[] = [];
    this.bindToSchema(root, schema.root, schema.root.name, errors, ctx.data);

    return { root, errors };
  }

  /**
   * Bind a single node to schema
   */
  private static bindToSchema(
    node: AsnNode,
    schemaNode: CompiledSchemaNode,
    fieldName: string,
    errors: AsnSchemaError[],
    data: Uint8Array,
  ): void {
    // Set schema information
    node.schemaId = schemaNode.id;
    node.fieldName = fieldName;
    node.typeName = schemaNode.typeName;

    // Set performance flags
    if (schemaNode.isSequenceOf) {
      node.isSequenceOf = true;
    }

    // Validate tag if expected
    if (schemaNode.expectedTag) {
      const matches = this.matchesSchema(node, schemaNode);
      if (!matches) {
        errors.push({
          path: fieldName,
          expected: schemaNode.expectedTag,
          actual: {
            cls: node.tagClass,
            tag: node.type,
            constructed: node.constructed,
          },
          position: node.start,
          message: `Expected tag [${schemaNode.expectedTag.cls}.${schemaNode.expectedTag.tag}] but got [${node.tagClass}.${node.type}]`,
        });
      }
    }

    // Special handling for CHOICE - find matching choice and set its decoder
    if (schemaNode.isChoice && schemaNode.children) {
      for (const choice of schemaNode.children) {
        if (this.matchesSchema(node, choice)) {
          // Set the choice name as field name
          node.fieldName = schemaNode.name;
          // Set typeName to CHOICE
          node.typeName = schemaNode.typeName;
          // Bind children if constructed
          if (node.constructed && choice.children) {
            this.bindChildren(node, choice, errors, data);
          }
          // For CHOICE, we don't bind children again
          return;
        }
      }
    }

    // Bind children if constructed
    if (node.constructed && node.children && schemaNode.children) {
      this.bindChildren(node, schemaNode, errors, data);
    }
  }

  /**
   * Bind children nodes
   */
  private static bindChildren(
    node: AsnNode,
    schemaNode: CompiledSchemaNode,
    errors: AsnSchemaError[],
    data: Uint8Array,
  ): void {
    if (!node.children || !schemaNode.children) return;

    // Special handling for SEQUENCE OF
    if (
      schemaNode.typeName &&
      (schemaNode.typeName.includes("SEQUENCE OF") || schemaNode.typeName.includes("SET OF")) &&
      schemaNode.children.length === 1
    ) {
      const itemSchema = schemaNode.children[0];
      for (let i = 0; i < node.children.length; i++) {
        const childNode = node.children[i];
        if (this.matchesSchema(childNode, itemSchema)) {
          this.bindToSchema(childNode, itemSchema, itemSchema.name, errors, data);
        } else {
          errors.push({
            path: `${node.fieldName || "root"}[${i}]`,
            expected: itemSchema.expectedTag || null,
            actual: {
              cls: childNode.tagClass,
              tag: childNode.type,
              constructed: childNode.constructed,
            },
            position: childNode.start,
            message: `SEQUENCE OF item ${i} does not match expected schema`,
          });
        }
      }
      return;
    }

    let childSchemaIndex = 0;
    let childNodeIndex = 0;

    while (childNodeIndex < node.children.length && childSchemaIndex < schemaNode.children.length) {
      const childNode = node.children[childNodeIndex];
      const childSchema = schemaNode.children[childSchemaIndex];

      if (this.matchesSchema(childNode, childSchema)) {
        // Bind this child
        this.bindToSchema(childNode, childSchema, childSchema.name, errors, data);
        childNodeIndex++;
        childSchemaIndex++;
      } else if (childSchema.optional) {
        // Skip optional schema child
        childSchemaIndex++;
      } else {
        // Required child not found - advance only schema index
        // Keep the current node to try matching against the next schema field
        errors.push({
          path: `${node.fieldName || "root"}.${childSchema.name}`,
          expected: childSchema.expectedTag || null,
          actual: {
            cls: childNode.tagClass,
            tag: childNode.type,
            constructed: childNode.constructed,
          },
          position: childNode.start,
          message: `Required field ${childSchema.name} not found, current node [${childNode.tagClass}.${childNode.type}] does not match`,
        });
        childSchemaIndex++;
      }
    }
  }

  /**
   * Check if node matches schema
   */
  static matchesSchema(node: AsnNode, schemaNode: CompiledSchemaNode): boolean {
    if (!schemaNode.expectedTag) return true;

    return (
      node.tagClass === schemaNode.expectedTag.cls &&
      node.type === schemaNode.expectedTag.tag &&
      (schemaNode.expectedTag.constructed === undefined ||
        node.constructed === schemaNode.expectedTag.constructed)
    );
  }
}
