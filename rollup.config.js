import { ts, dts } from "rollup-plugin-dts";
// import builtins from "rollup-plugin-node-builtins";

const pkg = require("./package.json");
const external = [...Object.keys(pkg.dependencies)];
const input = "src/index.ts";

export default [
  { // CommonJS
    input,
    plugins: [
      ts({
        compilerOptions: {
          removeComments: true,
        },
      }),
    ],
    external,
    output: [
      {
        file: pkg.main,
        format: "cjs",
      },
      {
        file: pkg.module,
        format: "es",
      }
    ]
  },
  { // Definitions
    input,
    plugins: [
      dts({
        compilerOptions: {
          noResolve: true,
        }
      }),
    ],
    external,
    output: [
      {
        file: pkg.types,
        format: "es",
      }
    ]
  },
];