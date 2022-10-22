import { getPageStory } from '~/features/common/api'

const getHomeStory = async () => {
  return await getPageStory('home')
}

export { getHomeStory }
