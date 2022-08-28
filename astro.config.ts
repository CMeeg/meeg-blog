import { defineConfig } from 'astro/config'
import { readFileSync } from 'fs'

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  vite: {
    server: {
      https: {
        key: readFileSync('./localhost-key.pem', 'utf8'),
        cert: readFileSync('./localhost.pem', 'utf8')
      }
    }
  }
})
