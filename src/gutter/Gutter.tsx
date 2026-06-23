import { useCallback, useMemo, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { IconPlus, IconGrip } from "./icons";

export function GutterContent({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="clean-gutter">
      <button
        type="button"
        aria-label="Add block"
        className="clean-gutter__add"
        onClick={onAdd}
      >
        <IconPlus />
      </button>
      <span className="clean-gutter__drag" aria-label="Drag to reorder" role="img">
        <IconGrip />
      </span>
    </div>
  );
}

export function Gutter({ editor, onAdd }: { editor: Editor; onAdd: (pos: number) => void }) {
  const posRef = useRef<number | null>(null);
  // Both props passed to <DragHandle> MUST be referentially stable. Its plugin-
  // registration effect depends on [element, editor, onNodeChange, pluginKey,
  // tippyOptions]; if any changes identity on render it unregisters + re-registers
  // the ProseMirror plugin, which calls editor.view.updateState() and tears down
  // ALL plugin views — including the slash/suggestion popup (firing its onExit
  // mid-open). The controlled component re-renders on every keystroke, so an inline
  // onNodeChange/tippyOptions would destroy the slash & add-block menus as they open.
  const tippyOptions = useMemo(() => ({ offset: [-4, 8] as [number, number] }), []);
  const onNodeChange = useCallback(
    ({ pos }: { node: import("@tiptap/pm/model").Node | null; editor: Editor; pos: number }) => {
      posRef.current = pos;
    },
    [],
  );
  return (
    <DragHandle editor={editor} tippyOptions={tippyOptions} onNodeChange={onNodeChange}>
      <GutterContent onAdd={() => onAdd(posRef.current ?? editor.state.selection.from)} />
    </DragHandle>
  );
}
