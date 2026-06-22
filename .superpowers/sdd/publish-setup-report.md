# npm Publish Setup Report — `@nakshatra.io/glass-editor`

**Date:** 2026-06-22  
**Commit:** see git log — `chore(release): rename to @nakshatra.io/glass-editor; add Changesets + OIDC publish workflow`

---

## Part A — Package rename (`@nakshatra/glass-editor` → `@nakshatra.io/glass-editor`)

Every occurrence of the old scope was replaced. Files changed:

| File | Change |
|---|---|
| `package.json` | `"name": "@nakshatra.io/glass-editor"` |
| `demo/package.json` | `"name": "@nakshatra.io/glass-editor-demo"` + dependency key |
| `demo/vite.config.ts` | Both resolve aliases updated (styles.css + main entry) |
| `demo/src/App.tsx` | Both import statements + JSX text updated |
| `README.md` | All install commands, import examples, `link:` example, heading |
| `AGENTS.md` | Title, prose references |
| `CONTRIBUTING.md` | All prose references |
| `SECURITY.md` | Scope notes section |
| `demo/index.html` | `<meta name="description">` |
| `src/guards.test.ts` | JSDoc comment |
| `docs/superpowers/specs/2026-06-22-glass-editor-design.md` | Title + prose |
| `docs/superpowers/plans/2026-06-22-glass-editor.md` | Title + prose |

`rg "@nakshatra/glass-editor"` (excluding pnpm-lock.yaml) returns zero results.  
`pnpm-lock.yaml` was updated by `pnpm install` and correctly reflects `@nakshatra.io/glass-editor`.

---

## Part B — `package.json` publish metadata

Added to root `package.json`:

```json
"repository": { "type": "git", "url": "git+https://github.com/Nakshatra-LLC/glass-editor.git" },
"homepage": "https://github.com/Nakshatra-LLC/glass-editor#readme",
"bugs": { "url": "https://github.com/Nakshatra-LLC/glass-editor/issues" },
"publishConfig": { "access": "public", "provenance": true },
"scripts": {
  ...,
  "prepublishOnly": "pnpm build",
  "release": "pnpm build && changeset publish"
}
```

Existing `files`, `exports`, `sideEffects`, `version: "0.1.0"`, `license: MIT`, and all dependency sections are unchanged.

---

## Part C — Changesets

- `@changesets/cli ^2.31.0` added to root `devDependencies`.
- `.changeset/config.json` configured:
  - `"access": "public"` (scoped public package)
  - `"baseBranch": "main"`
  - `"ignore": ["@nakshatra.io/glass-editor-demo"]` (private demo excluded from versioning)
- Initial changeset created: `.changeset/initial-release.md` — **minor** bump documenting the 0.1.0 editing-UX feature set.

---

## Part D — Release workflow (`.github/workflows/release.yml`)

Triggers on `push: branches: [main]`.

Permissions:
- `contents: write` — create tags + push version commits
- `pull-requests: write` — open/update "Version Packages" PR
- `id-token: write` — OIDC token for npm provenance attestation

Steps: checkout (full history) → pnpm setup → Node 20 → `pnpm install --frozen-lockfile` → `changesets/action@v1` with `publish: pnpm release`.

Env: `GITHUB_TOKEN`, `NPM_TOKEN` (from secret), `NPM_CONFIG_PROVENANCE: "true"`.

No untrusted input is interpolated into any `run:` command (injection-safe).

---

## Part E — Docs

`CONTRIBUTING.md` gained a **Releasing** subsection covering:
- `pnpm changeset` workflow for contributors
- How the changesets/action bot creates the "Version Packages" PR
- First-time maintainer setup steps (npm scope, NPM_TOKEN secret, Actions permissions)

`README.md` install command already updated to `@nakshatra.io/glass-editor` (Part A).

---

## Validation results

| Check | Result |
|---|---|
| `rg "@nakshatra/glass-editor"` (excl. lockfile) | CLEAN — 0 matches |
| `pnpm typecheck` | ✅ zero errors |
| `pnpm test` | ✅ 41/41 tests pass (14 test files) |
| `pnpm build` | ✅ dist/index.js 15.41 kB, dist/index.d.ts, dist/styles.css |
| `pnpm demo:build` | ✅ demo/dist emitted (535 kB bundle, expected for demo) |

---

## Manual steps the maintainer must still do

1. **Create the `@nakshatra.io` npm scope** — confirm the npm username `nakshatra.io` is registered and the scope `@nakshatra.io` is accessible at npmjs.com. Scopes are automatically available for your username on the public registry.

2. **Create an npm token** — at npmjs.com → Access Tokens, create either an **Automation token** or a **Granular Access Token** scoped to `@nakshatra.io/glass-editor` with publish permission.

3. **Add `NPM_TOKEN` repo secret** — GitHub repo → Settings → Secrets and variables → Actions → New repository secret → name: `NPM_TOKEN`, value: the token from step 2.

4. **Enable Actions write permissions** — GitHub repo → Settings → Actions → General → Workflow permissions → "Read and write permissions" (required for the Changesets action to push commits and open PRs).

5. **Trigger the first release** — push a commit to `main` (or merge the initial-release changeset PR). The `changesets/action` will detect the pending `.changeset/initial-release.md`, open a "Version Packages" PR. Merging that PR publishes `@nakshatra.io/glass-editor@0.1.0` to npm with OIDC provenance.

6. **Verify provenance** (optional) — after first publish, run `npm info @nakshatra.io/glass-editor` and check the provenance attestation at `https://www.npmjs.com/package/@nakshatra.io/glass-editor`.
