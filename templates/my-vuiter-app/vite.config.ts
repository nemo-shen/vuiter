import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default defineConfig({
  build: {
    minify: false,
    target: "node18",
    rollupOptions: {
      input: "src/main.ts",
      external: ["vue", "vuiter"],
      output: {
        entryFileNames: "main.js",
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [
    vue(),
    nodeResolve({
      exportConditions: ["node"],
    }),
  ],
});
