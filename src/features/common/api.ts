import type {
  StoryData,
  StoryContentWithSeoMetadata
} from '~/features/storyblok/types/content-types'
import type {
  GlobalStoryblok,
  PageStoryblok
} from '~/features/storyblok/types/components'
import type { StoryblokApiClient } from '~/features/storyblok/api'
import { createBlogApiClient } from '~/features/blog/api'

type GlobalStory = StoryData<GlobalStoryblok>

const getGlobalStory = async (apiClient: StoryblokApiClient) => {
  const story = await apiClient.getStory<GlobalStory>({ slug: 'global' })

  if (!story) {
    return null
  }

  return story
}

type PageStory = StoryData<PageStoryContent>
type PageStoryContent = StoryContentWithSeoMetadata<PageStoryblok>

interface GetPageStoryOptions {
  slug: string
}

const getPageStory = async (
  apiClient: StoryblokApiClient,
  options: GetPageStoryOptions
) => {
  const story = await apiClient.getStory<PageStory>(options)

  if (!story) {
    return null
  }

  // TODO: Make this reusable
  if (story.content.body?.length) {
    for (let i = 0; i < story.content.body.length; i++) {
      const blok = story.content.body[i]

      if (blok.component === 'article_listing') {
        const {
          starts_with: startsWith,
          with_tag: withTag,
          per_page: perPage
        } = blok

        const blogApiClient = createBlogApiClient(apiClient)

        const articles = await blogApiClient.getArticleStories({
          startsWith,
          withTag,
          perPage
        })

        blok.articles = articles
      }
    }
  }

  return story
}

const createCommonApiClient = (apiClient: StoryblokApiClient) => {
  return {
    getGlobalStory: async () => await getGlobalStory(apiClient),
    getPageStory: async (options: GetPageStoryOptions) =>
      await getPageStory(apiClient, options)
  }
}

export { createCommonApiClient }

export type { GlobalStory, PageStory, PageStoryContent }
