import { defineConfig } from "vite"

// We need to disable minification as it's an issue with Kaboom
export default defineConfig({
  base: "./",
  build: {
    minify: false,
  },
})
