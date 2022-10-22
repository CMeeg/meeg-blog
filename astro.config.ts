import { defineConfig } from 'astro/config'
import { readFileSync } from 'fs'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    ssr: {
      noExternal: ['open-props']
    },
    server: {
      https: {
        key: readFileSync('./localhost-key.pem', 'utf8'),
        cert: readFileSync('./localhost.pem', 'utf8')
      }
    }
  },
  integrations: [react()]
})
