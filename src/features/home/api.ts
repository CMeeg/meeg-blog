import type { StoryblokApiClient } from '~/features/storyblok/api'
import { createCommonApiClient } from '~/features/common/api'

const getHomeStory = async (apiClient: StoryblokApiClient) => {
  const commonApiClient = createCommonApiClient(apiClient)

  return await commonApiClient.getPageStory({ slug: 'home' })
}

const createHomeApiClient = (apiClient: StoryblokApiClient) => {
  return {
    getHomeStory: async () => await getHomeStory(apiClient)
  }
}

export { createHomeApiClient }
