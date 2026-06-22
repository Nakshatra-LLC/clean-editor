import { vi, expect, test } from "vitest";
import { aiSlashItems } from "./aiSlashItems";

function fakeEditor() {
  const inserted: string[] = [];
  return { getText: () => "Seed.", commands: { insertContent: (t: string) => inserted.push(t) }, inserted } as any;
}

test("Continue Writing calls adapter.continue and inserts the result", async () => {
  const ai = { continue: vi.fn().mockResolvedValue(" More."), ask: vi.fn() };
  const ed = fakeEditor();
  const item = aiSlashItems(ai).find((i) => i.id === "ai-continue")!;
  await item.run(ed);
  expect(ai.continue).toHaveBeenCalledWith("Seed.");
  expect(ed.inserted).toContain(" More.");
});

test("Ask AI calls adapter.ask with context and instruction, then inserts the result", async () => {
  const ai = { continue: vi.fn(), ask: vi.fn().mockResolvedValue(" Formal text.") };
  const ed = fakeEditor();
  const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("Make it formal");
  const item = aiSlashItems(ai).find((i) => i.id === "ai-ask")!;
  await item.run(ed);
  expect(promptSpy).toHaveBeenCalled();
  expect(ai.ask).toHaveBeenCalledWith("Seed.", "Make it formal");
  expect(ed.inserted).toContain(" Formal text.");
  promptSpy.mockRestore();
});

test("ai-continue does not throw when adapter rejects and inserts nothing", async () => {
  const ai = { continue: vi.fn().mockRejectedValue(new Error("boom")), ask: vi.fn() };
  const ed = fakeEditor();
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const item = aiSlashItems(ai).find((i) => i.id === "ai-continue")!;
  await expect(item.run(ed)).resolves.toBeUndefined();
  expect(ed.inserted).toHaveLength(0);
  expect(errorSpy).toHaveBeenCalledWith("glass-editor: AI request failed", expect.any(Error));
  errorSpy.mockRestore();
});

test("ai-ask does not throw when adapter rejects and inserts nothing", async () => {
  const ai = { continue: vi.fn(), ask: vi.fn().mockRejectedValue(new Error("boom")) };
  const ed = fakeEditor();
  const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("Do something");
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const item = aiSlashItems(ai).find((i) => i.id === "ai-ask")!;
  await expect(item.run(ed)).resolves.toBeUndefined();
  expect(ed.inserted).toHaveLength(0);
  expect(errorSpy).toHaveBeenCalledWith("glass-editor: AI request failed", expect.any(Error));
  promptSpy.mockRestore();
  errorSpy.mockRestore();
});

test("Ask AI returns early when window.prompt is null", async () => {
  const ai = { continue: vi.fn(), ask: vi.fn() };
  const ed = fakeEditor();
  const promptSpy = vi.spyOn(window, "prompt").mockReturnValue(null);
  const item = aiSlashItems(ai).find((i) => i.id === "ai-ask")!;
  await item.run(ed);
  expect(promptSpy).toHaveBeenCalled();
  expect(ai.ask).not.toHaveBeenCalled();
  expect(ed.inserted).toHaveLength(0);
  promptSpy.mockRestore();
});
