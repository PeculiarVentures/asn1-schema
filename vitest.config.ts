/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["packages/**/*.spec.ts", "packages/**/test/**/*.ts"],
    exclude: [
      // Exclude benchmark-like tests that require optional deps
      "packages/**/test/speed.ts",
    ],
  },
});
