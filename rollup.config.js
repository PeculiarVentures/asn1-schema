import typescript from "@rollup/plugin-typescript";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("package.json", { encoding: "utf8" }));

const banner = [].join("\n");
const input = "src/index.ts";
const external = Object.keys(pkg.dependencies);

export default [
  {
    input,
    plugins: [
      typescript({
        module: "ES2015",
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
  },
];
