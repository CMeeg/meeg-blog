import type {
  StoryData,
  StoryContentWithSeoMetadata
} from '@features/storyblok/types/content-types'
import type {
  GlobalStoryblok,
  PageStoryblok
} from '@features/storyblok/types/components'
import { getStory } from '@features/storyblok/api'

type GlobalStory = StoryData<GlobalStoryblok>

const getGlobal = async () => {
  const story = await getStory<GlobalStory>('global')

  if (!story) {
    return null
  }

  return story
}

type PageStory = StoryData<PageStoryContent>
type PageStoryContent = StoryContentWithSeoMetadata<PageStoryblok>

const getPage = async (slug: string) => {
  const story = await getStory<PageStory>(slug)

  if (!story) {
    return null
  }

  return story
}

export { getGlobal, getPage }

export type { GlobalStory, PageStory, PageStoryContent }
