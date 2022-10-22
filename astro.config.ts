import { defineConfig, getViteConfig } from 'astro/config'
import { readFileSync } from 'fs'
import node from '@astrojs/node'
import react from '@astrojs/react'

const isDev = process.env.NODE_ENV === 'development'

const vite = getViteConfig({
  ssr: {
    noExternal: ['open-props']
  }
})

if (isDev) {
  vite.server = {
    https: {
      key: readFileSync('./localhost-key.pem', 'utf8'),
      cert: readFileSync('./localhost.pem', 'utf8')
    }
  }
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'middleware'
  }),
  vite,
  integrations: [react()]
})
