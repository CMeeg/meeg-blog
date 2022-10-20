import type { StoriesParams } from '@storyblok/js'
import { getStory, getStories } from '@features/storyblok/api'
import type {
  StoryData,
  StoryContentWithSeoMetadata
} from '@features/storyblok/types/content-types'
import type {
  ArticleSeriesStoryblok,
  ArticleStoryblok
} from '@features/storyblok/types/components'
import { getPageStory } from '@features/common/api'

const getBlogIndexStory = async () => {
  return await getPageStory('blog')
}

type ArticleStory = StoryData<ArticleStoryContent>
type ArticleStoryContent = StoryContentWithSeoMetadata<ArticleStoryblok>

type ArticleSeriesStory = StoryData<ArticleSeriesStoryblok>
type ArticleStoryWithSeries = StoryData<
  ArticleStoryContent & {
    series?: ArticleSeriesStory
  }
>

const getArticleStory = async (path: string) => {
  const story = await getStory<ArticleStoryWithSeries>(path, {
    resolve_relations: 'series'
  })

  if (!story) {
    return null
  }

  return story
}

type GetArticlesOptions = {
  startsWith?: string
  withTag?: string
  perPage?: number
}

const defaultGetArticlesOptions = {
  perPage: 12
}

const getArticleStories = (options?: GetArticlesOptions) => {
  const customOptions = options ?? {}

  const queryOptions = {
    ...defaultGetArticlesOptions,
    ...customOptions
  }

  // TODO: This function is only used for article listings so we don't need all article data to be returned
  const query: StoriesParams = {
    is_startpage: 0,
    sort_by: 'first_published_at:desc',
    per_page: queryOptions.perPage,
    filter_query: {
      component: {
        in: 'article'
      }
    }
  }

  if (queryOptions.startsWith) {
    query.starts_with = queryOptions.startsWith
  }

  if (queryOptions.withTag) {
    query.with_tag = queryOptions.withTag
  }

  return getStories<ArticleStory>(query)
}

export { getBlogIndexStory, getArticleStory, getArticleStories }

export type { ArticleStory, ArticleStoryContent }
