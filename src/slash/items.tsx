import type { Editor } from "@tiptap/react";
import type { ReactNode } from "react";
import {
  IconText, IconH1, IconH2, IconH3, IconBullet, IconOrdered,
  IconTask, IconQuote, IconCode, IconDivider,
} from "./icons";

export type SlashItem = {
  id: string;
  label: string;
  group?: string;
  keywords?: string[];
  icon?: ReactNode;
  run: (editor: Editor) => void;
};

const c = (e: Editor) => e.chain().focus();

export const defaultSlashItems: SlashItem[] = [
  { id: "paragraph", label: "Text", group: "Style", icon: <IconText />, keywords: ["paragraph", "body"], run: (e) => c(e).setParagraph().run() },
  { id: "h1", label: "Heading 1", group: "Style", icon: <IconH1 />, keywords: ["title", "big"], run: (e) => c(e).toggleHeading({ level: 1 }).run() },
  { id: "h2", label: "Heading 2", group: "Style", icon: <IconH2 />, keywords: ["subtitle"], run: (e) => c(e).toggleHeading({ level: 2 }).run() },
  { id: "h3", label: "Heading 3", group: "Style", icon: <IconH3 />, keywords: ["subheading"], run: (e) => c(e).toggleHeading({ level: 3 }).run() },
  { id: "bulletList", label: "Bullet List", group: "Style", icon: <IconBullet />, keywords: ["unordered", "ul"], run: (e) => c(e).toggleBulletList().run() },
  { id: "orderedList", label: "Numbered List", group: "Style", icon: <IconOrdered />, keywords: ["ordered", "ol"], run: (e) => c(e).toggleOrderedList().run() },
  { id: "taskList", label: "To-do List", group: "Style", icon: <IconTask />, keywords: ["task", "checkbox"], run: (e) => c(e).toggleTaskList().run() },
  { id: "blockquote", label: "Quote", group: "Style", icon: <IconQuote />, keywords: ["blockquote"], run: (e) => c(e).toggleBlockquote().run() },
  { id: "codeBlock", label: "Code", group: "Style", icon: <IconCode />, keywords: ["pre", "snippet"], run: (e) => c(e).toggleCodeBlock().run() },
  { id: "divider", label: "Divider", group: "Style", icon: <IconDivider />, keywords: ["hr", "rule", "separator"], run: (e) => c(e).setHorizontalRule().run() },
];

export function filterSlashItems(items: SlashItem[], query: string): SlashItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => {
    const hay = [i.label, ...(i.keywords ?? [])].join(" ").toLowerCase();
    return hay.includes(q);
  });
}
