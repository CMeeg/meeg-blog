import type { PageStoryblok } from './components'

export type Story<TContent> = {
  name: string
  created_at: string
  published_at: string
  id: number
  uuid: string
  content: TContent
  slug: string
  full_slug: string
  sort_by_date?: string
  position: number
  tag_list: string[]
  is_startpage: boolean
  parent_id: number
  // TODO: Not sure what type this should be
  // meta_data?: null
  group_id: string
  first_published_at: string
  // TODO: Not sure what type this should be
  // release_id?: null,
  lang: string
  path: string
  // TODO: Not sure what type this should be
  // alternates: []
  default_full_slug: string
  // TODO: Not sure what type this should be
  // translated_slugs?: null
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any
}

export type ContentWithSeoMetadata<TContent> = TContent & {
  metadata?: SeoMetadata
}

export type StoryWithSeoMetadata<TContent> = Story<
  ContentWithSeoMetadata<TContent>
>

export type PageStory = Story<ContentWithSeoMetadata<PageStoryblok>>
