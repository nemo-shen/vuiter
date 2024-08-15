import { resolve } from "path";
import { defineConfig, UserConfig } from "vite";

export default defineConfig({
  esbuild: {
    target: "node16",
  },
  build: {
    minify: false,
    target: "node18",
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Vuiter",
      fileName: (format) => "index.js",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["node:process", "node:readline", "chalk"],
    },
  },
}) satisfies UserConfig;
