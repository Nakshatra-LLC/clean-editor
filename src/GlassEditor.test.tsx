import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { GlassEditor } from "./GlassEditor";
import type { JSONContent } from "@tiptap/react";

// TipTap's BubbleMenu calls tippy() during editor state updates; jsdom has no
// real layout engine so tippy throws. We stub out BubbleMenu entirely for testing.
vi.mock("@tiptap/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tiptap/react")>();
  return { ...actual, BubbleMenu: () => null };
});

test("renders the doc content", async () => {
  render(<GlassEditor value={{ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }] }} onChange={() => {}} />);
  expect(await screen.findByText("Hello")).toBeInTheDocument();
});

test("external value changes propagate into the editor after mount", async () => {
  const initialDoc: JSONContent = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Initial" }] }] };
  const updatedDoc: JSONContent = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Updated" }] }] };
  const { rerender } = render(<GlassEditor value={initialDoc} onChange={() => {}} />);
  expect(await screen.findByText("Initial")).toBeInTheDocument();
  rerender(<GlassEditor value={updatedDoc} onChange={() => {}} />);
  expect(await screen.findByText("Updated")).toBeInTheDocument();
  expect(screen.queryByText("Initial")).toBeNull();
});

test("AI slash items appear only when an adapter is provided", async () => {
  const ai = { continue: vi.fn(), ask: vi.fn() };
  const { rerender } = render(<GlassEditor value={{ type: "doc", content: [{ type: "paragraph" }] }} onChange={() => {}} />);
  // open the menu via the exposed control (a "/" button for testability)
  (await screen.findByRole("button", { name: /insert block/i })).click();
  expect(screen.queryByRole("button", { name: /continue writing/i })).toBeNull();
  rerender(<GlassEditor value={{ type: "doc", content: [{ type: "paragraph" }] }} onChange={() => {}} ai={ai} />);
  (await screen.findByRole("button", { name: /insert block/i })).click();
  expect(await screen.findByRole("button", { name: /continue writing/i })).toBeInTheDocument();
});
