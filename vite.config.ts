import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true, tsconfigPath: "./tsconfig.build.json" })],
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: "index" },
    rollupOptions: { external: ["react", "react-dom", "react/jsx-runtime", /^@tiptap\//, /^prosemirror-/] },
  },
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"], globals: true, include: ["src/**/*.test.{ts,tsx}"] },
});
