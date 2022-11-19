import type { StoryData } from '@storyblok/js'
import type { MultilinkStoryblok } from './types/components'
import { getRelativeUrl } from '~/features/common/url'

const getStoryUrl = (story: StoryData, basePath = '/') => {
  const { full_slug } = story

  // TODO: StoryData is missing a `path` field so we have to check the slug instead
  if (full_slug === 'home') {
    return '/'
  }

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

export { getStoryUrl, getLinkUrl }
