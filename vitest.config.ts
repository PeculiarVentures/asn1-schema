import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["packages/**/*.spec.ts", "packages/**/test/**/*.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "text-summary"],
      include: ["packages/**/*.ts", "!packages/**/*.spec.ts"],
      exclude: ["**/*.d.ts"],
    },
  },
});
