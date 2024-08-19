import { resolve } from "path";
import { defineConfig, UserConfig } from "vite";

export default defineConfig({
  esbuild: {
    target: "node18",
  },
  ssr: {
    noExternal: ["chalk"],
  },
  build: {
    minify: false,
    target: "node18",
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Vuiter",
      fileName: 'vuiter',
    },
    rollupOptions: {
      external: ["node:process", "node:os", "node:tty"],
    },
  },
}) satisfies UserConfig;
