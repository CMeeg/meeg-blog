import type {
  ISbStoryData,
  StoryContentWithSeoMetadata
} from '~/features/storyblok/types/content-types'
import type {
  GlobalStoryblok,
  PageStoryblok
} from '~/features/storyblok/types/components'
import type {
  StoryblokApiClient,
  GetStoryOptions
} from '~/features/storyblok/api'
import { createBlogApiClient } from '~/features/blog/api'

type GlobalStory = ISbStoryData<GlobalStoryblok>

type PageStory = ISbStoryData<PageStoryContent>
type PageStoryContent = StoryContentWithSeoMetadata<PageStoryblok>

const getPageStory = async (
  apiClient: StoryblokApiClient,
  options: GetStoryOptions
) => {
  const story = await apiClient.getStory<PageStory>(options)

  if (!story) {
    return story
  }

  // TODO: Make this concept of fetching additional data for child components reusable
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

const globalSlug = 'global'

const createCommonApiClient = (apiClient: StoryblokApiClient) => {
  return {
    getGlobalStory: async () =>
      await apiClient.getStory<GlobalStory>({ slug: globalSlug }),
    getPageStory: async (slug: string) =>
      await getPageStory(apiClient, { slug })
  }
}

export { createCommonApiClient }

export type { GlobalStory, PageStory, PageStoryContent }
