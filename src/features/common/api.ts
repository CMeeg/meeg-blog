import type {
  StoryData,
  StoryContentWithSeoMetadata
} from '@features/storyblok/types/content-types'
import type {
  GlobalStoryblok,
  PageStoryblok
} from '@features/storyblok/types/components'
import { getStory } from '@features/storyblok/api'
import { getArticleStories } from '@features/blog/api'

type GlobalStory = StoryData<GlobalStoryblok>

const getGlobalStory = async () => {
  const story = await getStory<GlobalStory>('global')

  if (!story) {
    return null
  }

  return story
}

type PageStory = StoryData<PageStoryContent>
type PageStoryContent = StoryContentWithSeoMetadata<PageStoryblok>

const getPageStory = async (slug: string) => {
  const story = await getStory<PageStory>(slug)

  if (!story) {
    return null
  }

  // TODO: Make this reusable
  if (story.content.body?.length) {
    for (let i = 0; i < story.content.body.length; i++) {
      const blok = story.content.body[i]

      if (blok.component === 'article_listing') {
        const {
          starts_with: startsWith,
          with_tag: withTag,
          per_page: perPage
        } = blok

        const articles = await getArticleStories({
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

export { getGlobalStory, getPageStory }

export type { GlobalStory, PageStory, PageStoryContent }
