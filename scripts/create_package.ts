import { execSync } from "child_process";
import * as rimraf from "rimraf";
import * as fs from "fs";
import * as path from "path";

async function main(name: string): Promise<void> {
  if (!name) {
    throw new Error("Argument 'name' is empty");
  }
  const moduleName = `@peculiar/asn1-${name}`;
  const projectDir = path.join(__dirname, "..");
  const moduleDir = path.join(projectDir, "packages", name);
  if (fs.existsSync(moduleDir)) {
    throw new Error(`Module '${name}' already exists`);
  }

  // Create package
  execSync(`lerna create ${moduleName} --dependencies @peculiar/asn1-schema asn1js tslib --keywords asn --yes`);
  fs.renameSync(path.join(projectDir, "packages", `asn1-${name}`), moduleDir);

  // Update package.json
  const packageJson = await import(path.join(moduleDir, "package.json"));
  Object.assign(packageJson, {
    description: "",
    files: [
      "build",
      "LICENSE",
      "README.md"
    ],
    author: "PeculiarVentures, LLC",
    license: "MIT",
    main: "build/cjs/index.js",
    module: "build/es2015/index.js",
    types: "build/types/index.d.ts",
    publishConfig: {
      access: "public"
    },
    scripts: {
      "test": "mocha",
      "clear": "rimraf build",
      "build": "npm run build:module && npm run build:types",
      "build:module": "npm run build:cjs && npm run build:es2015",
      "build:cjs": "tsc -p tsconfig.compile.json --removeComments --module commonjs --outDir build/cjs",
      "build:es2015": "tsc -p tsconfig.compile.json --removeComments --module ES2015 --outDir build/es2015",
      "prebuild:types": "rimraf build/types",
      "build:types": "tsc -p tsconfig.compile.json --outDir build/types --declaration --emitDeclarationOnly",
      "rebuild": "npm run clear && npm run build"
    },
  });
  delete packageJson.directories;
  fs.writeFileSync(path.join(moduleDir, "package.json"), JSON.stringify(packageJson, null, "  "), { flag: "w+" });

  rimraf.sync(path.join(moduleDir, "__tests__"));
  rimraf.sync(path.join(moduleDir, "lib"));
  fs.mkdirSync(path.join(moduleDir, "test"));
  fs.mkdirSync(path.join(moduleDir, "src"));

  const readme = `# \`${moduleName}\`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/packages/${name}/LICENSE.md)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-${name}.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-${name})

[![NPM](https://nodei.co/npm/@peculiar/asn1-${name}.png)](https://nodei.co/npm/@peculiar/asn1-${name}/)
`;
  fs.writeFileSync(path.join(moduleDir, "README.md"), readme, { flag: "w+" });

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
  fs.writeFileSync(path.join(moduleDir, "LICENSE"), license, { flag: "w+" });

  const tsconfig = {
    extends: "../../tsconfig.compile.json",
    include: ["src"],
  };
  fs.writeFileSync(path.join(moduleDir, "tsconfig.compile.json"), JSON.stringify(tsconfig, null, "  ")), { flag: "w+" };

  // Add TS alias
  const globalTsConfig = await import("../tsconfig.json");
  (globalTsConfig.compilerOptions.paths as Record<string, string[]>)[moduleName] = [`./packages/${name}/src`];
  fs.writeFileSync(path.join(projectDir, "tsconfig.json"), `${JSON.stringify(globalTsConfig, null, "  ")}\n`, { flag: "w+" });

  console.log(`Package '${moduleName}' created`);
}

main(process.argv.slice(2)[0])
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });