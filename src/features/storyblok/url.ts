import type { StoryData } from '@storyblok/js'
import type { MultilinkStoryblok } from './types/components'

const getRelativeUrl = (url: string | null, basePath = '/'): string | null => {
  if (!url) {
    return null
  }

  if (url === basePath) {
    return url
  }

  const path = url.endsWith('/') ? url.slice(0, -1) : url

  if (path.startsWith(basePath)) {
    return path
  }

  return `${basePath}${path}`
}

const getStoryUrl = (story: StoryData, basePath = '/') => {
  const { full_slug } = story

  return getRelativeUrl(full_slug, basePath)
}

const getLinkUrl = (
  link: MultilinkStoryblok,
  basePath = '/'
): string | null => {
  if ((link.linktype ?? '') === 'email') {
    return link.email ? `mailto:${link.email}` : null
  }

  const { cached_url } = link

  if (!cached_url) {
    return null
  }

  const url = cached_url as string

  return getRelativeUrl(url, basePath)
}

export { getRelativeUrl, getStoryUrl, getLinkUrl }
