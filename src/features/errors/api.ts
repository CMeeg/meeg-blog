import type {
  StoryData,
  StoryContentWithSeoMetadata
} from '~/features/storyblok/types/content-types'
import { uuid } from '~/features/common/uuid'
import { createStory } from '~/features/storyblok/api'

const pageNotFoundComponent = 'page_not_found'

type PageNotFoundContent = StoryContentWithSeoMetadata<{
  _uid: string
  component: typeof pageNotFoundComponent
  title: string
}>

type PageNotFoundStory = StoryData<PageNotFoundContent>

const getPageNotFoundStory = (): PageNotFoundStory => {
  const title = 'Page not found'

  const content: PageNotFoundContent = {
    _uid: uuid(),
    component: pageNotFoundComponent,
    title,
    metadata: {
      title
    }
  }

  return createStory(title, content)
}

export { getPageNotFoundStory }

export type { PageNotFoundStory }
