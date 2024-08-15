import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: 'src/main.ts',
      external: ['vue'],
      output: {
        entryFileNames: 'main.js',
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue()],
})
