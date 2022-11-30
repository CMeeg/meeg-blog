import { storyblokInit, apiPlugin } from '@storyblok/js'
import type {
  StoryblokClient,
  ISbStoryParams,
  ISbStoriesParams
} from '@storyblok/js'
import crypto from 'crypto'
import type { ISbStoryData } from './types/content-types'
import { getAppEnv } from '~/features/infra/env.mjs'

const { storyblok } = getAppEnv()

type StoryblokVersion = 'draft' | 'published' | undefined

const storyblokVersion: { [key: string]: StoryblokVersion } = {
  draft: 'draft',
  published: 'published'
}

const createStoryblokApi = (version: StoryblokVersion): StoryblokClient => {
  const isEditMode = version === storyblokVersion.draft

  const accessToken = isEditMode ? storyblok.previewToken : storyblok.token

  const initResult = storyblokInit({
    accessToken,
    bridge: isEditMode,
    apiOptions: {
      // TODO: What does the cache actually do, and what is `clear: 'auto'`?
      // https://github.com/storyblok/storyblok-js-client#activating-request-cache
      // https://www.storyblok.com/docs/api/content-delivery#topics/cache-invalidation
      cache: { type: 'none' },
      timeout: 30
    },
    use: [apiPlugin]
  })

  if (!initResult.storyblokApi) {
    throw Error('Could not create Storyblok API instance.')
  }

  return initResult.storyblokApi
}

interface GetStoryOptions {
  slug: string
  query?: ISbStoryParams
}

const getStory = async <TStory extends ISbStoryData>(
  api: StoryblokClient,
  version: StoryblokVersion,
  options: GetStoryOptions
): Promise<TStory | null> => {
  const query = options.query ?? {}

  const params: ISbStoryParams = {
    ...query,
    version
    // TODO: Check other options
    // https://www.storyblok.com/docs/api/content-delivery#core-resources/stories/retrieve-one-story
  }

  const { data } = await api.getStory(options.slug, params)

  if (!data) {
    return null
  }

  // TODO: Really, we have no idea if the shape of `data.story` matches the shape of `TStory` (particularly the `content`) so we are casting the type, but maybe there's a way to validate?
  return data.story as TStory
}

interface GetStoryByUuidOptions {
  uuid: string
  query?: ISbStoryParams
}

const getStoryByUuid = async <TStory extends ISbStoryData>(
  api: StoryblokClient,
  version: StoryblokVersion,
  options: GetStoryByUuidOptions
): Promise<TStory | null> => {
  const query = options.query ?? {}

  const params: ISbStoryParams = {
    ...query,
    find_by: 'uuid',
    version
    // TODO: Check other options
    // https://www.storyblok.com/docs/api/content-delivery#core-resources/stories/retrieve-one-story
  }

  const { data } = await api.getStory(options.uuid, params)

  if (!data) {
    return null
  }

  // TODO: Really, we have no idea if the shape of `data.story` matches the shape of `TStory` (particularly the `content`) so we are casting the type, but maybe there's a way to validate?
  return data.story as TStory
}

interface GetStoriesOptions {
  query: ISbStoriesParams
}

// TODO: Use Pick or something to narrow `StoriesParams` to only query-related fields
const getStories = async <TStory extends ISbStoryData>(
  api: StoryblokClient,
  version: StoryblokVersion,
  options: GetStoriesOptions
): Promise<TStory[]> => {
  const params: ISbStoriesParams = {
    ...options.query,
    version
    // TODO: Check other options
    // https://www.storyblok.com/docs/api/content-delivery#core-resources/stories/retrieve-one-story
  }

  const result = await api.getStories(params)

  return result.data.stories as TStory[]
}

const getLinks = async (api: StoryblokClient, version: StoryblokVersion) => {
  const { data } = await api.get('cdn/links', {
    version
    // TODO: Check other options
  })

  const links = data ? data.links : null

  return links
}

const isStoryblokEditorRequest = (request: Request) => {
  // Based on process described here: https://www.storyblok.com/docs/Guides/storyblok-latest-js#checking-if-you-are-inside-of-storyblok

  if (!storyblok.previewToken) {
    // Can't validate without a token

    return false
  }

  const requestUrl = new URL(request.url)

  // Get required request parameters

  const spaceIdParam = requestUrl.searchParams.get('_storyblok_tk[space_id]')
  const timestampParam = requestUrl.searchParams.get('_storyblok_tk[timestamp]')
  const tokenParam = requestUrl.searchParams.get('_storyblok_tk[token]')

  if (!spaceIdParam || !timestampParam || !tokenParam) {
    // If the request came form the Storyblok editor then these params would be present

    return false
  }

  // Validate parameter values

  const timestamp = Number(timestampParam)

  if (isNaN(timestamp)) {
    // Invalid request parameters

    return false
  }

  // Validate the timestamp

  const timestampValidFor = 60 * 60 // 1 hour in seconds
  const timestampMaxAge = Math.floor(Date.now() / 1000) - timestampValidFor

  if (timestamp <= timestampMaxAge) {
    // Timestamp has expired

    return false
  }

  // Validate the token

  const validationString = `${spaceIdParam}:${storyblok.previewToken}:${timestampParam}`
  const validationToken = crypto
    .createHash('sha1')
    .update(validationString)
    .digest('hex')

  if (tokenParam !== validationToken) {
    // Invalid token

    return false
  }

  // Request parameters are valid

  return true
}

interface StoryblokApiClient {
  isEditMode: boolean
  getStory: <TStory extends ISbStoryData>(
    options: GetStoryOptions
  ) => Promise<TStory | null>
  getStoryByUuid: <TStory extends ISbStoryData>(
    options: GetStoryByUuidOptions
  ) => Promise<TStory | null>
  getStories: <TStory extends ISbStoryData>(
    options: GetStoriesOptions
  ) => Promise<TStory[]>
  getLinks: () => ReturnType<typeof getLinks>
}

const createStoryblokApiClient = (request: Request) => {
  const isEditorRequest = isStoryblokEditorRequest(request)

  const version = isEditorRequest
    ? storyblokVersion.draft
    : storyblokVersion.published

  const api = createStoryblokApi(version)

  const apiClient: StoryblokApiClient = {
    isEditMode: isEditorRequest,
    getStory: async <TStory extends ISbStoryData>(options: GetStoryOptions) => {
      return await getStory<TStory>(api, version, options)
    },
    getStoryByUuid: async <TStory extends ISbStoryData>(
      options: GetStoryByUuidOptions
    ) => {
      return await getStoryByUuid<TStory>(api, version, options)
    },
    getStories: async <TStory extends ISbStoryData>(
      options: GetStoriesOptions
    ) => {
      return await getStories<TStory>(api, version, options)
    },
    getLinks: async () => {
      return await getLinks(api, version)
    }
  }

  return apiClient
}

export { createStoryblokApiClient }

export type { StoryblokApiClient, GetStoryOptions, GetStoriesOptions }
