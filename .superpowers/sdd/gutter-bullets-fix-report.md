# Fix Report: Visible List Markers + Cursor-Relative Gutter

## CSS Changes (`src/styles.css`)

### Fix 1 — Bullet/numbered list markers
Added explicit `list-style` rules after the existing `ul, ol` padding rule:
```css
.glass-editor__content ul { list-style: disc; }
.glass-editor__content ol { list-style: decimal; }
```
The existing `ul[data-type="taskList"] { list-style: none; ... }` rule follows immediately after, so task lists remain markerless (cascade order preserved).

### Fix 2 — Gutter inside document
- Changed `.glass-editor__content` left padding from `0` to `1.9rem` to make room for the gutter button.
- Changed `.glass-gutter` `left` from `-2.4rem` to `0.15rem` so the gutter sits just inside the document's left padding.

## GlassEditor Effect (`src/GlassEditor.tsx`)
- Added `rootRef = useRef<HTMLDivElement>(null)` and attached it to the root `.glass-editor` div.
- Added `gutterTop` state (`useState<number | null>(null)`).
- Added a `useEffect` that subscribes to `selectionUpdate` and `transaction` TipTap events. On each event it calls `editor.view.coordsAtPos(from)` and subtracts the root div's `getBoundingClientRect().top` to compute a document-relative `top` offset, stored in `gutterTop`.
- Passes `top={gutterTop}` to `<Gutter>`.

## Gutter Prop Change (`src/gutter/Gutter.tsx`)
- Extended prop type to `{ editor: Editor; top?: number | null }`.
- Applied `style={top == null ? undefined : { top }}` inline on the gutter root `<div>`.
- All existing behaviour preserved: `openSlashAt`, `aria-label="Insert block"`, `onMouseDown`, drag slot.

## Test / Typecheck / Build Results
- `pnpm test`: **35/35 tests passed** (14 test files), including `src/gutter/Gutter.test.tsx` (2 tests) — optional `top` prop defaults safely.
- `pnpm typecheck`: **clean** (no errors).
- `pnpm demo:build`: **succeeded** — emits `dist/index.html` + JS/CSS bundles.
