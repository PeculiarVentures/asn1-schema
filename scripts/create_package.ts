import * as fs from "fs";
import * as path from "path";
const pkg = require("../package.json");

async function main(name: string) {
  if (!name) {
    throw new Error("Argument 'name' is empty");
  }
  const moduleName = `@peculiar/asn1-${name}`;
  const projectDir = path.join(__dirname, "..");
  const moduleDir = path.join(projectDir, "packages", name);
  if (fs.existsSync(moduleDir)) {
    throw new Error(`Module '${name}' already exists`);
  }

  // Create project folder
  fs.mkdirSync(moduleDir);

  // Create package.json
  const packageJson = {
    name: moduleName,
    version: "0.0.0",
    description: "",
    bugs: {
      url: "https://github.com/PeculiarVentures/asn1-schema/issues"
    },
    homepage: `https://github.com/PeculiarVentures/asn1-schema/tree/master/packages/${name}#readme`,
    keywords: ["asn"],
    author: "PeculiarVentures, Inc",
    license: "MIT",
    main: "build/index.js",
    module: "build/index.es.js",
    types: "build/types/index.d.ts",
    publishConfig: {
      access: "public"
    },
    scripts: {
      test: "mocha",
      clear: "rimraf build/*",
      build: "npm run build:module && npm run build:types",
      "build:module": "rollup -c",
      "build:types": "tsc -p tsconfig.types.json",
      rebuild: "npm run clear && npm run build"
    },
    dependencies: {
      "@peculiar/asn1-schema": pkg.dependencies["@peculiar/asn1-schema"],
      "asn1js": pkg.dependencies["asn1js"],
      "tslib": pkg.dependencies["tslib"],
    }
  };
  fs.writeFileSync(path.join(moduleDir, "package.json"), JSON.stringify(packageJson, null, "  "));

  fs.mkdirSync(path.join(moduleDir, "test"));
  fs.mkdirSync(path.join(moduleDir, "src"));

  const npmignore = `src
test
rollup.config.js
ts*.json`;
  fs.writeFileSync(path.join(moduleDir, ".npmignore"), npmignore);

  const readme = `# \`${moduleName}\`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/packages/${name}/LICENSE.md)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-${name}.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-${name})
  
[![NPM](https://nodei.co/npm/@peculiar/asn1-${name}.png)](https://nodei.co/npm/@peculiar/asn1-${name}/)
`;
  fs.writeFileSync(path.join(moduleDir, "README.md"), readme);

  const license = `MIT License

Copyright (c) ${new Date().getFullYear()} 

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
  fs.writeFileSync(path.join(moduleDir, "LICENSE"), license);

  const rollup = `import config from "../../rollup.config";\nexport default config;`;
  fs.writeFileSync(path.join(moduleDir, "rollup.config.js"), rollup);

  const tsconfig = {
    extends: "../../tsconfig.json",
  };
  fs.writeFileSync(path.join(moduleDir, "tsconfig.json"), JSON.stringify(tsconfig, null, "  "));

  const tsconfigTypes = {
    extends: "../../tsconfig.types.json",
    compilerOptions: {
      declarationDir: "build/types"
    },
    exclude: ["build", "test"]
  };
  fs.writeFileSync(path.join(moduleDir, "tsconfig.types.json"), JSON.stringify(tsconfigTypes, null, "  "));

  // Add to main package
  pkg.dependencies[moduleName] = `file:packages/${name}`;
  const orderedDeps: { [key: string]: string } = {};
  Object.keys(pkg.dependencies).sort().forEach((key) => {
    orderedDeps[key] = pkg.dependencies[key];
  });
  pkg.dependencies = orderedDeps;
  fs.writeFileSync(path.join(projectDir, "package.json"), `${JSON.stringify(pkg, null, "  ")}\n`);

  console.log(`Package '${moduleName}' created`);
}

main.apply(null, process.argv.slice(2) as any)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });