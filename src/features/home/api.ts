import { getPage } from '@features/common/api'

const getHomeStory = async () => {
  return await getPage('home')
}

export { getHomeStory }
