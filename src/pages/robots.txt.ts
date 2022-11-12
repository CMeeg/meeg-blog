import type { APIContext } from 'astro'

export async function get(context: APIContext) {
  if (import.meta.env.DEV || import.meta.env.PREVIEW) {
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
