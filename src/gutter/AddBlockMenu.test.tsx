// src/gutter/AddBlockMenu.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { expect, test, vi } from "vitest";
import { AddBlockMenu } from "./AddBlockMenu";
import type { SlashItem } from "../slash/items";

function makeEditor() {
  const element = document.createElement("div");
  return new Editor({ element, extensions: [StarterKit], content: "<p></p>" });
}

const items: SlashItem[] = [
  { id: "h1", label: "Heading 1", group: "Style", run: vi.fn() },
  { id: "text", label: "Text", group: "Style", run: vi.fn() },
];

test("renders the slash menu with the given items", () => {
  const editor = makeEditor();
  render(<AddBlockMenu editor={editor} items={items} onClose={() => {}} />);
  expect(screen.getByRole("menu")).toBeInTheDocument();
  expect(screen.getByText("Heading 1")).toBeInTheDocument();
  editor.destroy();
});

test("clicking an item runs it and closes", async () => {
  const editor = makeEditor();
  const onClose = vi.fn();
  render(<AddBlockMenu editor={editor} items={items} onClose={onClose} />);
  await userEvent.click(screen.getByText("Heading 1"));
  expect(items[0].run).toHaveBeenCalledWith(editor);
  expect(onClose).toHaveBeenCalled();
  editor.destroy();
});

test("Escape closes without running an item", async () => {
  const editor = makeEditor();
  const onClose = vi.fn();
  render(<AddBlockMenu editor={editor} items={items} onClose={onClose} />);
  await userEvent.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalled();
  editor.destroy();
});

test("ArrowDown + Enter runs the second item", async () => {
  const editor = makeEditor();
  const onClose = vi.fn();
  render(<AddBlockMenu editor={editor} items={items} onClose={onClose} />);
  await userEvent.keyboard("{ArrowDown}{Enter}");
  expect(items[1].run).toHaveBeenCalledWith(editor);
  expect(onClose).toHaveBeenCalled();
  editor.destroy();
});
