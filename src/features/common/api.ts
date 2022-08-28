import type {
  StoryData,
  StoryContentWithSeoMetadata
} from '@features/storyblok/types/content-types'
import type { PageStoryblok } from '@features/storyblok/types/components'

type PageStory = StoryData<PageStoryContent>

type PageStoryContent = StoryContentWithSeoMetadata<PageStoryblok>

export type { PageStory, PageStoryContent }
