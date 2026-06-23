import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { expect, test, vi } from "vitest";
import { GutterContent, Gutter } from "./Gutter";

// DragHandle uses tippy.js + ProseMirror plugin views that reparent DOM nodes,
// which is incompatible with jsdom (same class of issue as BubbleMenu in CleanEditor tests).
// Stub it to a capturing passthrough wrapper so:
//   a) the GutterContent markup remains testable, and
//   b) the onNodeChange callback passed by Gutter can be captured and exercised.
const hoisted = vi.hoisted(() => ({
  onNodeChange: undefined as undefined | ((a: any) => void),
}));
vi.mock("@tiptap/extension-drag-handle-react", () => ({
  DragHandle: ({ children, onNodeChange }: any) => {
    hoisted.onNodeChange = onNodeChange;
    return <>{children}</>;
  },
}));

test("GutterContent: clicking + calls onAdd", async () => {
  const onAdd = vi.fn();
  render(<GutterContent onAdd={onAdd} />);
  await userEvent.click(screen.getByRole("button", { name: /add block/i }));
  expect(onAdd).toHaveBeenCalledTimes(1);
});

test("GutterContent: renders the drag grip", () => {
  render(<GutterContent onAdd={() => {}} />);
  expect(screen.getByLabelText(/drag to reorder/i)).toBeInTheDocument();
});

test("Gutter renders GutterContent under a stubbed DragHandle without throwing", () => {
  const element = document.createElement("div");
  const editor = new Editor({ element, extensions: [StarterKit], content: "<p>hi</p>" });
  const { unmount } = render(<Gutter editor={editor} onAdd={() => {}} />);
  unmount();
  editor.destroy();
});

test("Gutter: onNodeChange updates posRef so + button calls onAdd with captured pos", async () => {
  const element = document.createElement("div");
  const editor = new Editor({ element, extensions: [StarterKit], content: "<p>hi</p>" });
  const onAdd = vi.fn();
  const { unmount } = render(<Gutter editor={editor} onAdd={onAdd} />);

  // Invoke the onNodeChange callback that Gutter passed to the stubbed DragHandle
  hoisted.onNodeChange?.({ pos: 42, node: null, editor });

  // Click the + button — it should call onAdd with the captured pos (42), not the fallback
  await userEvent.click(screen.getByRole("button", { name: /add block/i }));
  expect(onAdd).toHaveBeenCalledWith(42);

  unmount();
  editor.destroy();
});
