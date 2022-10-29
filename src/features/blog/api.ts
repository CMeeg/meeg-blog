import type { StoriesParams } from '@storyblok/js'
import type { StoryblokApiClient } from '~/features/storyblok/api'
import type {
  StoryData,
  StoryContentWithSeoMetadata
} from '~/features/storyblok/types/content-types'
import type {
  ArticleSeriesStoryblok,
  ArticleStoryblok
} from '~/features/storyblok/types/components'
import { createCommonApiClient } from '~/features/common/api'

const getBlogIndexStory = async (apiClient: StoryblokApiClient) => {
  const commonApiClient = createCommonApiClient(apiClient)

  return await commonApiClient.getPageStory({ slug: 'blog' })
}

type ArticleStory = StoryData<ArticleStoryContent>
type ArticleStoryContent = StoryContentWithSeoMetadata<ArticleStoryblok>

type ArticleSeriesStory = StoryData<ArticleSeriesStoryblok>
type ArticleStoryWithSeries = StoryData<
  ArticleStoryContent & {
    series?: ArticleSeriesStory
  }
>

interface GetArticleStoryOptions {
  path: string
}

const getArticleStory = async (
  apiClient: StoryblokApiClient,
  options: GetArticleStoryOptions
) => {
  const story = await apiClient.getStory<ArticleStoryWithSeries>({
    slug: options.path,
    query: {
      resolve_relations: 'series'
    }
  })

  if (!story) {
    return null
  }

  return story
}

interface GetArticleStoriesOptions {
  startsWith?: string
  withTag?: string
  perPage?: number
}

const defaultGetArticlesOptions = {
  perPage: 12
}

const getArticleStories = (
  apiClient: StoryblokApiClient,
  options?: GetArticleStoriesOptions
) => {
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

  return apiClient.getStories<ArticleStory>({ query })
}

const createBlogApiClient = (apiClient: StoryblokApiClient) => {
  return {
    getBlogIndexStory: async () => await getBlogIndexStory(apiClient),
    getArticleStory: async (options: GetArticleStoryOptions) =>
      await getArticleStory(apiClient, options),
    getArticleStories: async (options: GetArticleStoriesOptions) =>
      await getArticleStories(apiClient, options)
  }
}

export { createBlogApiClient }

export type { ArticleStory, ArticleStoryContent }
