import { defaultSlashItems, filterSlashItems, type SlashItem } from "./items";

function fakeEditor() {
  const calls: string[] = [];
  const chain: any = new Proxy({}, { get: (_t, p) => (..._a: unknown[]) => { if (p !== "run" && p !== "focus") calls.push(String(p)); return chain; } });
  return { calls, chain: () => chain } as any;
}

test("ships block items that run editor commands", () => {
  const ids = defaultSlashItems.map((i) => i.id);
  expect(ids).toEqual(expect.arrayContaining(["h2", "bulletList", "taskList", "codeBlock", "divider"]));
  const ed = fakeEditor();
  defaultSlashItems.find((i) => i.id === "h2")!.run(ed);
  expect(ed.calls).toContain("toggleHeading");
});

test("filterSlashItems matches label and keywords, case-insensitively", () => {
  const items: SlashItem[] = [
    { id: "h1", label: "Heading 1", keywords: ["title", "big"], run: () => {} },
    { id: "todo", label: "To-do List", keywords: ["task", "checkbox"], run: () => {} },
  ];
  expect(filterSlashItems(items, "").map((i) => i.id)).toEqual(["h1", "todo"]);
  expect(filterSlashItems(items, "HEAD").map((i) => i.id)).toEqual(["h1"]);
  expect(filterSlashItems(items, "checkbox").map((i) => i.id)).toEqual(["todo"]);
  expect(filterSlashItems(items, "zzz")).toEqual([]);
});

test("default slash items all carry an icon", () => {
  expect(defaultSlashItems.length).toBeGreaterThan(0);
  for (const item of defaultSlashItems) expect(item.icon).toBeDefined();
});
