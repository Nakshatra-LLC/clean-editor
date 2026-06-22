# Glass Editor (`@nakshatra.io/glass-editor`) — Design

**Date:** 2026-06-22
**Repo:** `glass-editor` · **Package:** `@nakshatra.io/glass-editor` (Nakshatra LLC scope)
**Scope:** A small, reusable **React + TipTap** rich-text editor with pluggable blocks, a
slash-command registry, and an **injected AI adapter** — domain-agnostic, consumed by any host
app (React + Vite + Tailwind).

## Why

Multiple apps need a Notion-like rich-text editor with inline AI. As separate repos they can't
share a `workspace:*` package — the editor must be its own **published library**. Building it
once, decoupled, avoids divergent editors and makes the AI/authoring investment reusable.
Tiptap's polished "Notion"/"Agent" editors are **Pro/Cloud (not OSS)**, so we replicate the UX
from **free MIT primitives** and own the result.

## Principles

1. **OSS only.** TipTap **StarterKit** + free MIT extensions (`Link`, `TaskList`/`TaskItem`,
   `Image`, `Placeholder`, `BubbleMenu`) + the **`@tiptap/suggestion`** utility for the slash
   menu. **No Tiptap Pro/Cloud** (no Content AI, Collaboration, drag-handle, or prebuilt
   templates).
2. **Zero domain coupling.** The editor knows nothing about the host's content model, backend,
   or AI provider. Everything host-specific is **injected**.
3. **Controlled.** `value` is a ProseMirror JSON doc; `onChange(doc)` fires on edits. The host
   owns persistence.
4. **Small public API.** One component + a few types. Defaults work out of the box; props
   override.
5. **Host themes it.** Ship structural/unstyled CSS with stable class hooks; both consumers theme
   via Tailwind. No bundled design system.
6. **Peer-dependency model.** `react`, `react-dom`, and the `@tiptap/*` packages are
   **peerDependencies** — the host provides one copy (no duplicate React/PM instances).

## Public API (the contract)

```ts
import type { Editor, JSONContent, Extension } from "@tiptap/react";

export type AiAdapter = {
  /** Extend prose from the given context. Returns text/markdown to insert. */
  continue: (context: string) => Promise<string>;
  /** Apply a freeform instruction to the context. Returns text/markdown. */
  ask: (context: string, instruction: string) => Promise<string>;
};

export type SlashItem = {
  id: string;
  label: string;
  group?: string;            // e.g. "AI" | "Blocks"
  keywords?: string[];       // for filtering
  run: (editor: Editor) => void;
};

export type GlassEditorProps = {
  value: JSONContent;                          // ProseMirror doc (source of truth)
  onChange: (doc: JSONContent) => void;
  ai?: AiAdapter;                              // optional → enables AI slash items
  extensions?: Extension[];                    // replace the default extension set
  slashItems?: SlashItem[];                    // appended to (or replacing) defaults
  placeholder?: string;
  className?: string;
  editable?: boolean;                          // default true
};

export function GlassEditor(props: GlassEditorProps): JSX.Element;
export const defaultExtensions: (opts?: { placeholder?: string }) => Extension[];
export const defaultSlashItems: SlashItem[];
export const aiSlashItems: (ai: AiAdapter) => SlashItem[];   // Continue Writing / Ask AI
```

**Default behavior:** StarterKit + Link + TaskList + Image + Placeholder; a selection
**bubble menu** (bold / italic / link); a **`/` slash menu** with default block items (Text,
Heading 1–3, Bullet/Numbered/To-do list, Quote, Code, Divider). If `ai` is provided, the slash
menu gains **Continue Writing** and **Ask AI** items that call the adapter and insert the result
at the cursor (or replace the selection). The host can append `slashItems` (e.g. a host could
add an "Insert image from library" command).

## Architecture / units

- `src/extensions.ts` — `defaultExtensions(opts)`: the free extension set; configurable.
- `src/slash/registry.ts` — `defaultSlashItems` + a merge helper.
- `src/slash/SlashMenu.tsx` + `src/slash/suggestion.ts` — the `@tiptap/suggestion`-driven popup
  (filter input, grouped list, keyboard nav) anchored at the caret.
- `src/ai/aiSlashItems.ts` — builds the Continue/Ask items from an `AiAdapter`.
- `src/GlassEditor.tsx` — the React component (`useEditor`, `BubbleMenu`, slash wiring).
- `src/index.ts` — public exports (the API above).
- `src/styles.css` — minimal structural styles + class hooks (`.glass-editor`, `.glass-slash`…).
- Build: **Vite library mode** → ESM + `.d.ts` (via `vite-plugin-dts`); externalize peers.
- Tests: **vitest + @testing-library/react + jsdom** (mirrors both consumers).

## Data flow

Host renders `<GlassEditor value={doc} onChange={setDoc} ai={adapter} />`. Edits → TipTap
transaction → `onChange(editor.getJSON())`. Slash block items run editor commands. AI items call
`ai.continue/ask(editor.getText(), …)` → insert returned text. The host's adapter is where the
network/provider lives — the editor never imports `fetch`/a backend.

## Consumers (integration, out of this repo's scope)

A host app renders `<GlassEditor value={doc} onChange={setDoc} ai={adapter} />` and supplies the
`AiAdapter` — the editor never imports a backend or AI provider. Example hosts:
- A **CMS**: an adapter that proxies AI through its own backend; the PM `doc` is its content.
- A **document/résumé builder**: the same component with its own adapter and domain slash items.

During development a host can consume `@nakshatra.io/glass-editor` via a **local link**
(`file:`/`link:`); the package is **published to npm** once the API stabilizes — no per-change
publish churn.

## Error handling

- AI adapter rejects → the slash action shows a brief inline error and inserts nothing; the
  editor stays usable. The editor never throws into the host on an AI failure.
- Invalid/empty `value` → renders an empty doc.

## Testing

- `GlassEditor` renders a doc; `onChange` fires on edit; bubble menu toggles marks.
- Slash menu: typing `/` opens it; selecting a block item runs the command; with an `ai` adapter,
  "Continue Writing"/"Ask AI" call the adapter (mocked) and insert the returned text; without
  `ai`, those items are absent.
- `defaultExtensions`/`defaultSlashItems`/`aiSlashItems` unit-tested.
- Build smoke: `vite build` produces ESM + types; peers externalized.

## Out of scope (v1)

Collaboration / Tiptap Cloud; drag handle (Pro); image **upload** (host injects an image slash
item); markdown import/export; non-React bindings; mobile-specific UX; bundled theme. The API is
designed to add these without breaking consumers.

## Decisions (glass-editor ledger)

- **GE-D1** OSS-only TipTap (StarterKit + free MIT extensions + `@tiptap/suggestion`); no
  Pro/Cloud.
- **GE-D2** Dependency injection for **AI adapter**, **slash items**, and **extensions**; zero
  domain coupling (no host backend/domain imports).
- **GE-D3** Published as **`@nakshatra.io/glass-editor`**; `react`/`react-dom`/`@tiptap/*` are
  **peerDependencies**; **Vite library** build (ESM + d.ts).
- **GE-D4** Controlled editor: `value` (PM JSON) + `onChange`; host owns persistence.
- **GE-D5** Unstyled/structural CSS with class hooks; hosts theme via Tailwind.
- **GE-D6** Consumed via local link during dev; npm publish when stable (no churn-publishing).
