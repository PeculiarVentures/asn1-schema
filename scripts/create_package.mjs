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

const COMMON_FILES = ["build/**/*.{js,d.ts}", "build/es2015/package.json", "LICENSE", "README.md"];

const COMMON_SCRIPTS = {
  clear: "rimraf build",
  build: "npm run build:module && npm run build:types",
  "build:module": "npm run build:cjs && npm run build:es2015",
  "build:cjs": "tsc -p tsconfig.compile.json --removeComments --module commonjs --outDir build/cjs",
  "build:es2015": "tsc -p tsconfig.compile.json --removeComments --module ES2015 --outDir build/es2015",
  "postbuild:es2015": "node ../../scripts/prepare_esm_package.mjs build/es2015",
  "prebuild:types": "rimraf build/types",
  "build:types": "tsc -p tsconfig.compile.json --outDir build/types --declaration --emitDeclarationOnly",
  rebuild: "npm run clear && npm run build",
};

function orderedObject(entries) {
  return Object.fromEntries(entries.filter(([, value]) => value !== undefined));
}

function sortObject(input) {
  return Object.fromEntries(Object.entries(input).sort(([left], [right]) => left.localeCompare(right)));
}

function createPackageDescription(name) {
  return `ASN.1 schema definitions for ${name}.`;
}

function createPackageKeywords(name) {
  return ["asn", "asn1", name];
}

function createBadgeBlock(packageName, packageDirName) {
  const encodedName = encodeURIComponent(packageName);

  return [
    `[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/PeculiarVentures/asn1-schema/blob/master/packages/${packageDirName}/LICENSE)`,
    `[![npm version](https://badge.fury.io/js/${encodedName}.svg)](https://badge.fury.io/js/${encodedName})`,
    "",
    `[![NPM](https://nodei.co/npm/${packageName}.png)](https://nodei.co/npm/${packageName}/)`,
  ].join("\n");
}

function createReadme(moduleName, packageDirName) {
  return `# \`${moduleName}\`

${createBadgeBlock(moduleName, packageDirName)}

ASN.1 schema definitions for ${packageDirName}.

Use the exported classes with \`@peculiar/asn1-schema\` helpers such as
\`AsnConvert\`, \`AsnParser\`, and \`AsnSerializer\` to parse or serialize
DER-encoded data defined by the referenced specification.

## Installation

\`\`\`bash
npm install ${moduleName}
\`\`\`

## Specifications

- Add the primary RFC, draft, or vendor specification implemented by this package.
`;
}

function createPackageJson(packageJson, name, moduleName) {
  const dependencies = packageJson.dependencies ? sortObject(packageJson.dependencies) : undefined;

  return orderedObject([
    ["name", moduleName],
    ["version", packageJson.version],
    ["description", createPackageDescription(name)],
    ["keywords", createPackageKeywords(name)],
    ["author", "PeculiarVentures, LLC"],
    ["license", "MIT"],
    ["files", COMMON_FILES],
    ["main", "build/cjs/index.js"],
    ["module", "build/es2015/index.js"],
    ["types", "build/types/index.d.ts"],
    ["exports", {
      ".": {
        types: "./build/types/index.d.ts",
        import: "./build/es2015/index.js",
        require: "./build/cjs/index.js",
      },
      "./package.json": "./package.json",
    }],
    ["publishConfig", { access: "public" }],
    ["repository", {
      type: "git",
      url: "https://github.com/PeculiarVentures/asn1-schema",
      directory: `packages/${name}`,
    }],
    ["bugs", { url: "https://github.com/PeculiarVentures/asn1-schema/issues" }],
    ["homepage", `https://github.com/PeculiarVentures/asn1-schema/tree/master/packages/${name}#readme`],
    ["scripts", COMMON_SCRIPTS],
    ["dependencies", dependencies],
  ]);
}

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
    `lerna create ${moduleName} --dependencies @peculiar/asn1-schema asn1js tslib --yes`,
  );
  renameSync(join(projectDir, "packages", `asn1-${name}`), moduleDir);

  // Update package.json
  const packageJson = JSON.parse(readFileSync(join(moduleDir, "package.json"), "utf8"));
  const normalizedPackageJson = createPackageJson(packageJson, name, moduleName);
  writeFileSync(join(moduleDir, "package.json"), `${JSON.stringify(normalizedPackageJson, null, "  ")}\n`);

  rimraf.sync(join(moduleDir, "__tests__"));
  rimraf.sync(join(moduleDir, "lib"));
  mkdirSync(join(moduleDir, "test"));
  mkdirSync(join(moduleDir, "src"));

  writeFileSync(join(moduleDir, "README.md"), createReadme(moduleName, name));

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
