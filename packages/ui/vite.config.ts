import react from "@vitejs/plugin-react"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { externalizeDeps } from "vite-plugin-externalize-deps"
import tsconfigPaths from "vite-tsconfig-paths"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tsconfigPaths(), react(), externalizeDeps(), dts()],
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, "src/main.ts")
      },
      name: "phoriaexamples-ui",
      formats: ["es"]
    },
    copyPublicDir: false,
    outDir: resolve(__dirname, "dist")
  }
})
