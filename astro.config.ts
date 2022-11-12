import { defineConfig, getViteConfig } from 'astro/config'
import type { AstroUserConfig } from 'astro/config'
import { readFileSync } from 'node:fs'
import node from '@astrojs/node'
import preact from '@astrojs/preact'

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
const astro: AstroUserConfig = {
  output: 'server',
  adapter: node({
    mode: 'middleware'
  }),
  vite,
  integrations: [preact({ compat: true })]
}

if (process.env.RENDER_EXTERNAL_URL) {
  const renderUrl = process.env.RENDER_EXTERNAL_URL

  // Remove trailing slash
  astro.site = renderUrl.replace(/\/$/, '')
}

export default defineConfig(astro)
