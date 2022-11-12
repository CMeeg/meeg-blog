import type { APIContext } from 'astro'

export async function get(context: APIContext) {
  if (import.meta.env.DEV || import.meta.env.PREVIEW) {
    return {
      body: `User-agent: *
Disallow: /`
    }
  }

  return {
    body: `User-agent: *
Disallow:

Sitemap: ${context.site ?? ''}/sitemap.xml`
  }
}
