import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  esbuild: {
    target: "node18",
  },
  build: {
    minify: false,
    target: "node18",
    rollupOptions: {
      input: "src/main.ts",
      external: ["vue", "node:process", "node:os", "node:tty", "vuiter"],
      output: {
        entryFileNames: "main.js",
        globals: {
          vue: "Vue",
          vuiter: "Vuiter",
        },
      },
    },
  },
  plugins: [vue()],
});
