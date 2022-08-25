import { storyblokInit, apiPlugin } from '@storyblok/js'
import type {
  ContentWithSeoMetadata,
  Story
} from '@features/storyblok/types/content-types'

const storyblokToken = import.meta.env.STORYBLOK_TOKEN

const createStoryblokApi = () => {
  const { storyblokApi: api } = storyblokInit({
    accessToken: storyblokToken,
    // TODO: Disable bridge if not in "preview mode"
    // bridge: process.env.NODE_ENV !== "production",
    apiOptions: {
      // TODO: What does the cache actually do, and what is `clear: 'auto'`?
      // https://github.com/storyblok/storyblok-js-client#activating-request-cache
      cache: { type: 'memory' }
    },
    use: [apiPlugin]
  })

  if (api) {
    return api
  }

  throw Error('Could not create Storyblok API instance.')
}

const storyblokApi = createStoryblokApi()

type StoryReturnType = Story<unknown | ContentWithSeoMetadata<unknown>>

const getStory = async <TStory extends StoryReturnType>(
  slug: string
): Promise<TStory | null> => {
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    // TODO: Set this based on "preview mode"
    version: 'draft'
    // TODO: Check other options
    // https://www.storyblok.com/docs/api/content-delivery#core-resources/stories/retrieve-one-story
  })

  if (!data) {
    return null
  }

  return data.story as TStory
}

const getLinks = async () => {
  const { data } = await storyblokApi.get('cdn/links', {
    // TODO: Set this based on "preview mode"
    version: 'draft'
    // TODO: Check other options
  })

  const links = data ? data.links : null

  return links
}

export { getStory, getLinks }
