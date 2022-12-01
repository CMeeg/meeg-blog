import type {
  ISbStoryData,
  StoryContentWithSeoMetadata
} from '~/features/storyblok/types/content-types'
import type { AuthorStoryblok } from '~/features/storyblok/types/components'
import type { StoryblokApiClient } from '~/features/storyblok/api'

type AboutStory = ISbStoryData<AboutStoryContent>
type AboutStoryContent = StoryContentWithSeoMetadata<AuthorStoryblok>

const aboutSlug = 'about'

const createAboutApiClient = (apiClient: StoryblokApiClient) => {
  return {
    getAboutStory: async () =>
      await apiClient.getStory<AboutStory>({ slug: aboutSlug })
  }
}

export { createAboutApiClient }

export type { AboutStory }
