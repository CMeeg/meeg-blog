import type { StoryData } from '@storyblok/js'
import type { MultilinkStoryblok } from './types/components'
import isAbsoluteUrl from 'is-absolute-url'

const getRelativeUrl = (
  url: string | null,
  basePath = '/'
): string | undefined => {
  if (!url) {
    return undefined
  }

  if (isAbsoluteUrl(url)) {
    return url
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
): string | undefined => {
  if ((link.linktype ?? '') === 'email') {
    return link.email ? `mailto:${link.email}` : undefined
  }

  const { cached_url, anchor } = link

  if (!cached_url) {
    return undefined
  }

  const url = getRelativeUrl(cached_url as string, basePath)

  if (anchor) {
    return `${url}#${anchor}`
  }

  return url
}

export { getRelativeUrl, getStoryUrl, getLinkUrl }
