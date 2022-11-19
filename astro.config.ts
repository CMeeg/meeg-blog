import { defineConfig, getViteConfig } from 'astro/config'
import type { AstroUserConfig } from 'astro/config'
import { readFileSync } from 'node:fs'
import node from '@astrojs/node'
import preact from '@astrojs/preact'
import { getServerEnv } from './src/features/infra/env.mjs'

const { environment, baseUrl } = getServerEnv()

const vite = getViteConfig({
  ssr: {
    noExternal: ['open-props']
  }
})

if (environment.isDev) {
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

if (baseUrl) {
  // Remove trailing slash
  astro.site = baseUrl.replace(/\/$/, '')
}

export default defineConfig(astro)
