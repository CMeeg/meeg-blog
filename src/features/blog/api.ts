import type {
  StoryblokApiClient,
  GetStoryOptions,
  GetStoriesOptions
} from '~/features/storyblok/api'
import type {
  ISbStoryData,
  StoryContentWithSeoMetadata
} from '~/features/storyblok/types/content-types'
import type {
  ArticleSeriesStoryblok,
  ArticleStoryblok
} from '~/features/storyblok/types/components'
import { createCommonApiClient } from '~/features/common/api'

type ArticleStory = ISbStoryData<ArticleStoryContent>
type ArticleStoryContent = StoryContentWithSeoMetadata<ArticleStoryblok>

type ArticleSeriesStory = ISbStoryData<ArticleSeriesStoryblok>
type ArticleStoryWithSeries = ISbStoryData<
  ArticleStoryContent & {
    series?: ArticleSeriesStory
  }
>

const createArticleOptions = (path: string) => {
  const options: GetStoryOptions = {
    slug: path,
    query: {
      resolve_relations: 'article.series'
    }
  }

  return options
}

interface GetArticleStoriesOptions {
  startsWith?: string
  withTag?: string
  perPage?: number
}

const createArticlesOptions = (options?: GetArticleStoriesOptions) => {
  const articlesOptions: GetStoriesOptions = {
    query: {
      is_startpage: 0,
      sort_by: 'first_published_at:desc',
      filter_query: {
        component: {
          in: 'article'
        }
      }
    }
  }

  if (options?.startsWith) {
    articlesOptions.query.starts_with = options.startsWith
  }

  if (options?.withTag) {
    articlesOptions.query.with_tag = options.withTag
  }

  if (options?.perPage) {
    articlesOptions.query.per_page = options.perPage
  }

  return articlesOptions
}

const createArticlesInSeriesOptions = (seriesUUid: string) => {
  const options = createArticlesOptions()

  options.query.sort_by = 'first_published_at:asc'

  const filter = options.query.filter_query ?? {}

  filter.series = {
    in: seriesUUid
  }

  options.query.filter_query = filter

  return options
}

const blogIndexSlug = 'blog'

const createBlogApiClient = (apiClient: StoryblokApiClient) => {
  const commonApiClient = createCommonApiClient(apiClient)

  return {
    getBlogIndexStory: async () =>
      await commonApiClient.getPageStory(blogIndexSlug),
    getArticleStory: async (path: string) =>
      await apiClient.getStory<ArticleStoryWithSeries>(
        createArticleOptions(path)
      ),
    getArticleStories: async (options?: GetArticleStoriesOptions) =>
      await apiClient.getStories<ArticleStory>(createArticlesOptions(options)),
    getArticleSeriesStory: async (seriesUuid: string) =>
      await apiClient.getStoryByUuid<ArticleSeriesStory>({ uuid: seriesUuid }),
    getArticleStoriesInSeries: async (seriesUuid: string) =>
      await apiClient.getStories<ArticleStory>(
        createArticlesInSeriesOptions(seriesUuid)
      )
  }
}

export { createBlogApiClient }

export type {
  ArticleStory,
  ArticleStoryContent,
  ArticleStoryWithSeries,
  ArticleSeriesStory
}
