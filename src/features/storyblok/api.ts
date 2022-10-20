import { storyblokInit, apiPlugin } from '@storyblok/js'
import type { StoryblokClient, StoriesParams } from '@storyblok/js'
import { v4 as uuid } from 'uuid'
import { paramCase } from 'change-case'
import type { StoryData, StoryContent } from './types/content-types'
import { getRandomInt } from './number'

const storyblokToken = import.meta.env.STORYBLOK_TOKEN

const createStoryblokApi = (): StoryblokClient => {
  const initResult = storyblokInit({
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

  if (!initResult.storyblokApi) {
    throw Error('Could not create Storyblok API instance.')
  }

  return initResult.storyblokApi
}

const storyblokApi = createStoryblokApi()

const getStory = async <TStory extends StoryData>(
  slug: string
): Promise<TStory | null> => {
  const { data } = await storyblokApi.getStory(slug, {
    // TODO: Set this based on "preview mode"
    version: 'published' // 'draft'
    // TODO: Check other options
    // https://www.storyblok.com/docs/api/content-delivery#core-resources/stories/retrieve-one-story
  })

  if (!data) {
    return null
  }

  // TODO: Really, we have no idea if the shape of `data.story` matches the shape of `TStory` (particularly the `content`) so we are casting the type, but maybe there's a way to validate?
  return data.story as TStory
}

const createStory = <TStoryContent extends StoryContent>(
  name: string,
  content: TStoryContent
): StoryData<TStoryContent> => {
  const now = new Date().toISOString()
  const slug = paramCase(name)

  const story: StoryData<TStoryContent> = {
    name,
    created_at: now,
    published_at: now,
    id: getRandomInt(99999),
    uuid: uuid(),
    content,
    slug,
    full_slug: slug,
    position: 0,
    tag_list: [],
    is_startpage: false,
    parent_id: 0,
    group_id: uuid(),
    first_published_at: now,
    lang: 'default',
    alternates: [],
    sort_by_date: null,
    meta_data: null
  }

  return story
}

// TODO: Use Pick or something to narrow `StoriesParams` to only query-related fields
const getStories = async <TStory extends StoryData>(
  query: StoriesParams
): Promise<TStory[]> => {
  const params: StoriesParams = {
    ...query,
    // TODO: Set this based on "preview mode"
    version: 'published' //'draft'
    // TODO: Check other options
    // https://www.storyblok.com/docs/api/content-delivery#core-resources/stories/retrieve-one-story
  }

  const result = await storyblokApi.getStories(params)

  return result.data.stories as TStory[]
}

const getLinks = async () => {
  const { data } = await storyblokApi.get('cdn/links', {
    // TODO: Set this based on "preview mode"
    version: 'published' //'draft'
    // TODO: Check other options
  })

  const links = data ? data.links : null

  return links
}

export { getStory, createStory, getStories, getLinks }
