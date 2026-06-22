# @nakshatra/glass-editor

A small, reusable **React + TipTap** rich-text (WYSIWYG) editor built on the OSS TipTap
StarterKit — with pluggable blocks, a `/` slash-command menu, and an **injected AI adapter**
(`Continue Writing` / `Ask AI`). Domain-agnostic: the editor knows nothing about your backend
or AI provider — you inject them.

> Status: early. Design: `docs/superpowers/specs/2026-06-22-glass-editor-design.md`.

## Why

The polished "Notion-like" TipTap editors are Pro/Cloud. Glass Editor replicates that UX from
**free MIT primitives** (StarterKit + `@tiptap/suggestion` + a few extensions) and owns the
result, so it can be shared across apps via a single dependency-injected component.

## License

MIT © Nakshatra LLC
