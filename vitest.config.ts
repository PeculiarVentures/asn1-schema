import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolve @peculiar/asn1-* imports to the package sources through the tsconfig paths.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["packages/*/src/**/*.spec.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["packages/*/src/**/*"],
      exclude: ["packages/*/src/**/*.spec.ts", "**/build/**"],
    },
  },
});
