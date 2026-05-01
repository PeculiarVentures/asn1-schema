# AGENTS.md

## Repository Shape

- This repository is an npm workspaces + Lerna monorepo.
- Package sources live in `packages/*/src`.
- Tests live mainly in `packages/*/test`, with a smaller number of source-adjacent `*.spec.ts` files.
- Many packages also commit generated `build` output. Do not hand-edit `build` files; change `src` first and regenerate when needed.
- Use npm for package management. Do not switch the repo to yarn or pnpm.

## Package README

- Keep each package README short, factual, and aligned with the existing pattern in `packages/*/README.md`.
- Start with the published package name as the main heading, usually wrapped in backticks.
- Include the common badge block when the package is published on npm, especially license and npm version badges.
- Open with a one-sentence description of what the package provides.
- If the package is a schema module, mention how it works with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer`.
- Include an `Installation` section with the exact `npm install @peculiar/...` command for the package.
- Include a `Specifications`, `References`, or `Overview` section as appropriate, with links to the relevant RFCs or standards when the package models one.
- Add a short example only when it helps explain the public API or usage pattern; keep it close to the actual exported surface.
- Keep README text focused on package purpose and usage, not on repository internals, build steps, or test commands.
- Make sure the package name, npm install command, and linked files such as `LICENSE` all match the package directory and `package.json` metadata.

## Environment

- Install dependencies with `npm ci`.
- CI currently runs tests on Node 20, and the release workflow uses Node 24. Prefer a current LTS release or match CI when validating changes.

## Commit Messages

- Commit messages must be in English.
- Follow Conventional Commits: `type(scope): imperative summary`.
- Keep the type lowercase and the summary concise.
- Do not end the summary with a period.
- Use a scope when the change is package-specific or clearly limited to one area.
- Common scopes in this repo include package names and repo areas such as `x509`, `csr`, `schema`, `ci`, and `deps`.
- Prefer these types:
  - `feat` for new functionality
  - `fix` for bug fixes
  - `refactor` for internal code reshaping without behavior changes
  - `test` for test-only changes
  - `docs` for documentation-only changes
  - `ci` for workflow and automation changes
  - `build` for build tooling and packaging changes
  - `chore` for maintenance work that does not fit the types above
- Recent history follows this pattern, for example:
  - `chore: migrate testing framework from Jest to Vitest`
  - `chore(ci): update GitHub Actions workflow to trigger on specific pull request types and branches`
  - `fix(x509): strip milliseconds from GeneralizedTime to comply with RFC 5280`
  - `feat(schema): add support for raw ASN.1 encoded bytes in parsing logic`

## Test Expectations

- Any feature change or bug fix should add or update tests in the affected package.
- The canonical repo-level test runner is Vitest from the workspace root.
- Root `npm test` runs `vitest run`.
- Vitest includes:
  - `packages/**/*.spec.ts`
  - `packages/**/test/**/*.ts`
- Prefer placing new tests under `packages/<package>/test`.
- Use source-adjacent `*.spec.ts` files only when keeping the test next to the implementation materially improves clarity.
- The test environment is Node, and Vitest globals are enabled. Existing tests commonly use `describe` and `it` without importing them.
- Existing tests mostly use `node:assert`; Vitest `expect` is also acceptable when it makes the assertion clearer. Follow the surrounding style in the package you touch.
- Keep tests deterministic. Avoid hidden dependencies on wall-clock time, randomness, network access, or external services.
- For ASN.1 parsing or serialization changes, prefer tests that verify the exact decoded values, serialized output, or a round-trip/regression scenario.
- Do not treat package-level `npm test` scripts as the source of truth. Some packages still contain legacy `mocha` scripts, while root CI and local full-suite runs now use Vitest.

## Validation Commands

- Minimum validation before handing work off:
  - `npm run lint`
  - `npm test`
  - `npm run build` when changing source, exported types, or tracked build output
- For CI parity, also run:
  - `npm run coverage`
- Useful targeted checks while iterating:
  - `npm run lint -- packages/<package>`
  - `npx vitest run "packages/<package>/test/**/*.ts"`
  - `npx vitest run "packages/<package>/src/**/*.spec.ts"`
  - `npx lerna run build --scope <package-name>`
- Build maintenance commands:
  - `npm run clear` removes package build directories
  - `npm run rebuild` runs clear + build across packages
- The main GitHub workflows enforce the same root-level expectations:
  - test workflow: `npm ci`, `npm run lint`, `npm run coverage`
  - release workflow: `npm ci`, `npm run lint`, `npm test`, `npm run build`
