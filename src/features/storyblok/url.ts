import type { StoryData } from '@storyblok/js'
import type { AssetStoryblok, MultilinkStoryblok } from './types/components'

const getRelativeUrl = (url: string | null, basePath = '/'): string | null => {
  if (!url) {
    return null
  }

  if (url.startsWith(basePath)) {
    return url
  }

  return `${basePath}${url}`
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
    if (link.email) {
      return `mailto:${link.email}`
    } else {
      return null
    }
  }

  const { cached_url } = link

  if (!cached_url) {
    return null
  }

  const url = cached_url as string

  return getRelativeUrl(url, basePath)
}

const getImageAssetUrl = (asset: AssetStoryblok) => {
  // TODO: Check this asset is an image

  const { filename } = asset
  const imageBaseUrl = 'https://img2.storyblok.com'
  const filepath = filename.replace('https://a.storyblok.com/', '')

  // TODO: Deal with Storyblok image options
  // return `${imageBaseUrl}/${this.options}/${path}`

  return `${imageBaseUrl}/${filepath}`
}

export { getRelativeUrl, getStoryUrl, getLinkUrl, getImageAssetUrl }
