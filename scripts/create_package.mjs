/* eslint-disable no-undef */
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import {
  dirname, join, resolve,
} from "node:path";
import { fileURLToPath } from "node:url";
import * as rimraf from "rimraf";

async function main(name) {
  if (!name) {
    throw new Error("Argument 'name' is empty");
  }
  const moduleName = `@peculiar/asn1-${name}`;
  const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const moduleDir = join(projectDir, "packages", name);
  if (existsSync(moduleDir)) {
    throw new Error(`Module '${name}' already exists`);
  }

  // Create package
  execSync(
    `lerna create ${moduleName} --dependencies @peculiar/asn1-schema asn1js tslib --keywords asn --yes`,
  );
  renameSync(join(projectDir, "packages", `asn1-${name}`), moduleDir);

  // Update package.json
  const packageJson = JSON.parse(readFileSync(join(moduleDir, "package.json"), "utf8"));
  Object.assign(packageJson, {
    description: "",
    files: ["build/**/*.{js,d.ts}", "build/es2015/package.json", "LICENSE", "README.md"],
    author: "PeculiarVentures, LLC",
    license: "MIT",
    main: "build/cjs/index.js",
    module: "build/es2015/index.js",
    types: "build/types/index.d.ts",
    publishConfig: { access: "public" },
    repository: {
      type: "git",
      url: "https://github.com/PeculiarVentures/asn1-schema",
      directory: `packages/${name}`,
    },
    exports: {
      ".": {
        types: "./build/types/index.d.ts",
        import: "./build/es2015/index.js",
        require: "./build/cjs/index.js",
      },
      "./package.json": "./package.json",
    },
    scripts: {
      clear: "rimraf build",
      build: "npm run build:module && npm run build:types",
      "build:module": "npm run build:cjs && npm run build:es2015",
      "build:cjs":
        "tsc -p tsconfig.compile.json --removeComments --module commonjs --outDir build/cjs",
      "build:es2015":
        "tsc -p tsconfig.compile.json --removeComments --module ES2015 --outDir build/es2015",
      "postbuild:es2015": "node ../../scripts/prepare_esm_package.mjs build/es2015",
      "prebuild:types": "rimraf build/types",
      "build:types":
        "tsc -p tsconfig.compile.json --outDir build/types --declaration --emitDeclarationOnly",
      rebuild: "npm run clear && npm run build",
    },
  });
  delete packageJson.directories;
  writeFileSync(join(moduleDir, "package.json"), `${JSON.stringify(packageJson, null, "  ")}\n`);

  rimraf.sync(path.join(moduleDir, "__tests__"));
  rimraf.sync(join(moduleDir, "lib"));
  mkdirSync(join(moduleDir, "test"));
  mkdirSync(join(moduleDir, "src"));

  const readme = `# \`${moduleName}\`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/packages/${name}/LICENSE.md)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-${name}.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-${name})

[![NPM](https://nodei.co/npm/@peculiar/asn1-${name}.png)](https://nodei.co/npm/@peculiar/asn1-${name}/)
`;
  writeFileSync(join(moduleDir, "README.md"), readme);

  const license = `MIT License

Copyright (c) ${new Date().getFullYear()} Peculiar Ventures, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
  writeFileSync(join(moduleDir, "LICENSE"), license);

  const tsconfig = {
    extends: "../../tsconfig.compile.json",
    compilerOptions: { rootDir: "src" },
    include: ["src"],
  };
  writeFileSync(
    join(moduleDir, "tsconfig.compile.json"),
    `${JSON.stringify(tsconfig, null, "  ")}\n`,
  );

  // Add TS alias
  const globalTsConfig = JSON.parse(readFileSync(join(projectDir, "tsconfig.json"), "utf8"));
  globalTsConfig.compilerOptions.paths[moduleName] = [
    `./packages/${name}/src`,
  ];
  writeFileSync(join(projectDir, "tsconfig.json"), `${JSON.stringify(globalTsConfig, null, "  ")}\n`);

  console.log(`Package '${moduleName}' created`);
}

main(process.argv.slice(2)[0]).catch((error) => {
  console.error(error);
  process.exit(1);
});
