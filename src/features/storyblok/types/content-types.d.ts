import type { ISbStoryData, StoryblokComponentType } from '@storyblok/js'
import type {
  ArticleSeoMetadata,
  ProfileSeoMetadata
} from '~/features/seo/open-graph'

export type { ISbStoryData }

export type StoryContent = StoryblokComponentType<string> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any
}

export type SeoMetadata = {
  _uid?: string
  title?: string
  plugin?: string
  og_image?: string
  og_title?: string
  description?: string
  twitter_image?: string
  twitter_title?: string
  og_description?: string
  twitter_description?: string
  article?: ArticleSeoMetadata
  profile?: ProfileSeoMetadata
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any
}

export type StoryContentWithSeoMetadata<TContent extends StoryContent> =
  TContent & {
    metadata?: SeoMetadata
  }

export type StoryWithSeoMetadata<TContent extends StoryContent> = ISbStoryData<
  StoryContentWithSeoMetadata<TContent>
>
