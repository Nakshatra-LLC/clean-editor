import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import type { Extension } from "@tiptap/core";

export function defaultExtensions(opts?: { placeholder?: string }): Extension[] {
  return [
    StarterKit,
    Link.configure({ openOnClick: false }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Image,
    Placeholder.configure({ placeholder: opts?.placeholder ?? "Write something, or press / for blocks…" }),
  ] as unknown as Extension[];
}
