import type { APIContext } from 'astro'
import { getAppEnv } from '~/features/infra/env.mjs'

export async function get(context: APIContext) {
  const { environment } = getAppEnv()

  if (!environment.isProd) {
    return {
      body: `User-agent: *
Disallow: /`
    }
  }

  const siteUrl = context.site ?? context.url.origin

  return {
    body: `User-agent: *
Disallow:

Sitemap: ${siteUrl}/sitemap.xml`
  }
}
