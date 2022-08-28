import { getStory } from '@features/storyblok/api'
import type { PageStory } from '@features/common/api'

const getHomeStory = async () => {
  const slug = 'home'

  const story = await getStory<PageStory>(slug)

  if (!story) {
    return null
  }

  return story
}

export { getHomeStory }
