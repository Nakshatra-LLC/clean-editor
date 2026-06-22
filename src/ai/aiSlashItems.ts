import type { Editor } from "@tiptap/react";
import type { SlashItem } from "../slash/items";

export type AiAdapter = {
  continue: (context: string) => Promise<string>;
  ask: (context: string, instruction: string) => Promise<string>;
};

export function aiSlashItems(ai: AiAdapter): SlashItem[] {
  return [
    {
      id: "ai-continue", label: "Continue Writing", group: "AI",
      run: async (e: Editor) => {
        try {
          const t = await ai.continue(e.getText());
          e.commands.insertContent(t);
        } catch (err) {
          console.error("glass-editor: AI request failed", err);
        }
      },
    },
    {
      id: "ai-ask", label: "Ask AI", group: "AI",
      run: async (e: Editor) => {
        const instruction = window.prompt("Ask AI to…");
        if (!instruction) return;
        try {
          const t = await ai.ask(e.getText(), instruction);
          e.commands.insertContent(t);
        } catch (err) {
          console.error("glass-editor: AI request failed", err);
        }
      },
    },
  ];
}
