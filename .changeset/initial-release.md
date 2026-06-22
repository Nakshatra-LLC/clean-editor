---
"@nakshatra.io/glass-editor": minor
---

Initial public release of `@nakshatra.io/glass-editor` (v0.1.0).

Delivers a standalone React + TipTap WYSIWYG editor with:
- Slash-command menu (`/`) with caret-anchored popup, keyboard navigation, and gutter `＋` button
- Injected AI adapter — "Continue Writing" and "Ask AI" slash items (omit the adapter to hide them)
- Selection bubble menu — Bold, Italic, Link with inline URL input
- CSS-variable theme with automatic light/dark switching via `prefers-color-scheme`
- Controlled API: `value` (ProseMirror JSONContent) + `onChange`; fully overridable extensions, slash items, and bubble items
- Zero domain coupling — no backend, content-model, or AI provider baked in
- OSS only — TipTap StarterKit + free MIT extensions; no Pro/Cloud packages
