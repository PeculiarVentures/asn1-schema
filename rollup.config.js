import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

const external = [...Object.keys(pkg.dependencies)];
const input = "src/index.ts";

const banner = [
  "/**",
  " * Copyright (c) 2020, Peculiar Ventures, All rights reserved.",
  " */",
  "",
].join("\n");

export default {
  input,
  plugins: [
    typescript({
      check: true,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          module: "ES2015",
        }
      }
    }),
  ],
  external,
  output: [
    {
      banner,
      file: pkg.main,
      format: "cjs",
    },
    {
      banner,
      file: pkg.module,
      format: "es",
    },
  ],
};