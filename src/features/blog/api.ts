import type { StoriesParams } from '@storyblok/js'
import { getStories } from '@features/storyblok/api'
import type {
  StoryData,
  StoryContentWithSeoMetadata
} from '@features/storyblok/types/content-types'
import type { ArticleStoryblok } from '@features/storyblok/types/components'
import { getPageStory } from '@features/common/api'

const getBlogIndexStory = async () => {
  return await getPageStory('blog')
}

type ArticleStory = StoryData<ArticleStoryContent>
type ArticleStoryContent = StoryContentWithSeoMetadata<ArticleStoryblok>

type GetArticlesOptions = {
  startsWith?: string
  withTag?: string
  perPage?: number
}

const defaultGetArticlesOptions = {
  perPage: 12
}

const getArticles = (options?: GetArticlesOptions) => {
  const customOptions = options ?? {}

  const queryOptions = {
    ...defaultGetArticlesOptions,
    ...customOptions
  }

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

export { getBlogIndexStory, getArticles }

export type { ArticleStory, ArticleStoryContent }
