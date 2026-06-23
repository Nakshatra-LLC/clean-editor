// src/gutter/AddBlockMenu.tsx
import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { SlashMenu, reduceSlashKey } from "../slash/SlashMenu";
import type { SlashItem } from "../slash/items";
import { clampPopup } from "../positioning";

export function AddBlockMenu({
  editor, items, onClose,
}: { editor: Editor; items: SlashItem[]; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const select = (item: SlashItem) => { item.run(editor); onClose(); };

  // Position the popup near the cursor (best-effort; jsdom returns zeros).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      const { from } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);
      const size = { width: el.offsetWidth, height: el.offsetHeight };
      const vp = { width: window.innerWidth, height: window.innerHeight };
      const { top, left } = clampPopup(
        { top: coords.top, bottom: coords.bottom, left: coords.left }, size, vp,
      );
      el.style.position = "fixed";
      el.style.top = `${top}px`;
      el.style.left = `${left}px`;
      el.style.zIndex = "50";
    } catch { /* coords not available (e.g. jsdom) */ }
  }, [editor]);

  // Keyboard handling mirrors the suggestion popup's reducer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const r = reduceSlashKey(e.key, { index, count: items.length });
      if (r.close) { e.preventDefault(); onClose(); return; }
      if (r.select) { e.preventDefault(); if (items[index]) select(items[index]); return; }
      if (r.handled) { e.preventDefault(); setIndex(r.index); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className="clean-addblock">
      <SlashMenu items={items} selectedIndex={index} onSelect={select} />
    </div>
  );
}
