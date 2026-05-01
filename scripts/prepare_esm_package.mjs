/* eslint-disable no-undef */
import { existsSync } from "node:fs";
import {
  readdir, readFile, writeFile,
} from "node:fs/promises";
import path from "node:path";

function addJsExtension(specifier, importerPath) {
  if (!specifier.startsWith(".") || path.extname(specifier)) {
    return specifier;
  }

  const resolved = path.resolve(path.dirname(importerPath), specifier);
  if (existsSync(`${resolved}.js`)) {
    return `${specifier}.js`;
  }
  if (existsSync(path.join(resolved, "index.js"))) {
    return `${specifier}/index.js`;
  }

  return `${specifier}.js`;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(entryPath);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      yield entryPath;
    }
  }
}

async function rewriteImports(dir) {
  for await (const filePath of walk(dir)) {
    const source = await readFile(filePath, "utf8");
    const updated = source
      .replace(/(from\s+["'])(\.{1,2}\/[^"']+)(["'])/g, (_, prefix, specifier, suffix) => {
        return `${prefix}${addJsExtension(specifier, filePath)}${suffix}`;
      })
      .replace(/(import\s*\(\s*["'])(\.{1,2}\/[^"']+)(["']\s*\))/g, (_, prefix, specifier, suffix) => {
        return `${prefix}${addJsExtension(specifier, filePath)}${suffix}`;
      });

    if (updated !== source) {
      await writeFile(filePath, updated);
    }
  }
}

async function main() {
  const targetDir = process.argv[2];
  if (!targetDir) {
    throw new Error("Usage: node scripts/prepare_esm_package.mjs <build/es2015-dir>");
  }

  const distDir = path.resolve(process.cwd(), targetDir);
  await rewriteImports(distDir);
  await writeFile(
    path.join(distDir, "package.json"),
    `${JSON.stringify({ type: "module" }, null, 2)}\n`,
  );
}

await main();
