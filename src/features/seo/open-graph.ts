import type { SeoMetadata } from '~/features/storyblok/types/content-types'

interface ArticleSeoMetadata {
  published_time: string
  author: string
  section: string
  tags: string[]
}

interface ProfileSeoMetadata {
  first_name: string
  last_name: string
}

const getOpenGraphPrefix = function (metadata?: SeoMetadata) {
  if (!metadata) {
    return null
  }

  const prefixes = ['og: http://ogp.me/ns#']

  if (metadata.article) {
    prefixes.push('article: http://ogp.me/ns/article#')
  }

  if (metadata.profile) {
    prefixes.push('profile: http://ogp.me/ns/profile#')
  }

  return prefixes.join(' ')
}

export { getOpenGraphPrefix }

export type { ArticleSeoMetadata, ProfileSeoMetadata }
