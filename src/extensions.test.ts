import { defaultExtensions } from "./extensions";
test("includes core blocks and a placeholder", () => {
  const names = defaultExtensions({ placeholder: "Write…" }).map((e) => e.name);
  expect(names).toContain("starterKit");
  expect(names).toContain("taskList");
  expect(names).toContain("placeholder");
});
