import type { StoryblokApiClient } from '~/features/storyblok/api'
import { createCommonApiClient } from '~/features/common/api'

const homeSlug = 'home'

const createHomeApiClient = (apiClient: StoryblokApiClient) => {
  const commonApiClient = createCommonApiClient(apiClient)

  return {
    getHomeStory: async () => await commonApiClient.getPageStory(homeSlug)
  }
}

export { createHomeApiClient }
