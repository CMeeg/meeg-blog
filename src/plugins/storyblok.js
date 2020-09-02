const apiGetStories = function ({
  api,
  path,
  query,
  successCallback,
  errorCallback
}) {
  const apiPath = getFullApiStoriesPath(path)

  return api
    .get(apiPath, query)
    .then((response) => {
      return successCallback(response)
    })
    .catch((error) => {
      errorCallback(error)
    })
}

const getFullApiStoriesPath = function (path) {
  const apiBasePath = 'cdn/stories'

  if (!path) {
    return apiBasePath
  }

  if (path.startsWith('/')) {
    path = path.slice(1)
  }

  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  return `${apiBasePath}/${path}`
}

const apiGetTags = function ({ api, query, successCallback, errorCallback }) {
  const apiPath = 'cdn/tags'

  return api
    .get(apiPath, query)
    .then((response) => {
      return successCallback(response)
    })
    .catch((error) => {
      errorCallback(error)
    })
}

const apiGetSpace = function ({ api, query, successCallback, errorCallback }) {
  const apiPath = 'cdn/spaces/me'

  return api
    .get(apiPath, query)
    .then((response) => {
      return successCallback(response)
    })
    .catch((error) => {
      errorCallback(error)
    })
}

const defaultErrorCallback = function (context, error) {
  if (error.response) {
    if (context.isDev) {
      // eslint-disable-next-line
      console.error(error.response)
    }

    context.error({
      statusCode: error.response.status,
      message: error.response.data
    })
  } else {
    if (context.isDev) {
      // eslint-disable-next-line
      console.error(error)
    }

    context.error({
      statusCode: 404,
      message: 'Failed to receive content from api'
    })
  }

  sendToSentry(context, error)
}

const sendToSentry = function (context, error) {
  if (!context.$sentry.captureException) {
    return
  }

  context.$sentry.captureException(error)
}

const isEditMode = function (context) {
  let editMode = false
  const $window = process.client ? window : undefined

  if (
    context.query._storyblok ||
    context.isDev ||
    context.$config.storyblokUseVersion === 'draft' ||
    (typeof $window !== 'undefined' &&
      $window.localStorage.getItem('_storyblok_draft_mode'))
  ) {
    if (typeof $window !== 'undefined') {
      $window.localStorage.setItem('_storyblok_draft_mode', '1')
      if ($window.location === $window.parent.location) {
        $window.localStorage.removeItem('_storyblok_draft_mode')
      }
    }

    editMode = true
  }

  return editMode
}

const storyblok = function (context) {
  const version = isEditMode(context) ? 'draft' : 'published'

  return {
    get: (path, query, options) => {
      query = query || {}
      options = options || {}

      query.version = version
      query.cv = context.store.state.storyblok.cacheVersion

      const successCallback =
        options.successCallback ||
        function (response) {
          return response.data
        }

      const errorCallback = options.errorCallback || defaultErrorCallback

      return apiGetStories({
        api: context.app.$storyapi,
        path,
        query,
        successCallback: (response) => successCallback(response),
        errorCallback: (error) => errorCallback(context, error)
      })
    },
    getAll: (query, options) => {
      query = query || {}
      options = options || {}

      query.version = version
      query.cv = context.store.state.storyblok.cacheVersion

      const successCallback =
        options.successCallback ||
        function (response) {
          return {
            stories: {
              total: Number.parseInt(response.headers.total, 10),
              stories: response.data.stories
            }
          }
        }

      const errorCallback = options.errorCallback || defaultErrorCallback

      return apiGetStories({
        api: context.app.$storyapi,
        path: null,
        query,
        successCallback: (response) => successCallback(response),
        errorCallback: (error) => errorCallback(context, error)
      })
    },
    getTags: (query, options) => {
      query = query || {}
      options = options || {}

      query.version = version
      query.cv = context.store.state.storyblok.cacheVersion

      const successCallback =
        options.successCallback ||
        function (response) {
          return response.data
        }

      const errorCallback = options.errorCallback || defaultErrorCallback

      return apiGetTags({
        api: context.app.$storyapi,
        query,
        successCallback: (response) => successCallback(response),
        errorCallback: (error) => errorCallback(context, error)
      })
    },
    getSpace: (options) => {
      options = options || {}

      const query = {}
      if (context.store.state.storyblok.cacheVersion) {
        query.cv = context.store.state.storyblok.cacheVersion
      }

      const successCallback =
        options.successCallback ||
        function (response) {
          return response.data
        }

      const errorCallback = options.errorCallback || defaultErrorCallback

      return apiGetSpace({
        api: context.app.$storyapi,
        query,
        successCallback: (response) => successCallback(response),
        errorCallback: (error) => errorCallback(context, error)
      })
    },
    reloadOnChange: (story) => {
      context.$storybridge.on(['input', 'published', 'change'], (event) => {
        if (event.action === 'input') {
          if (event.story.id === this.story.id) {
            story.content = event.story.content
          }
        } else if (!event.slugChanged) {
          window.location.reload()
        }
      })
    },
    getStoryDate: (story) => {
      if (story.sort_by_date !== null) {
        return new Date(story.sort_by_date)
      }

      if (story.first_published_at !== null) {
        return new Date(story.first_published_at)
      }

      if (story.published_at !== null) {
        return new Date(story.published_at)
      }

      if (story.created_at !== null) {
        return new Date(story.created_at)
      }
    }
  }
}

export default ({ app }, inject) => {
  inject('storyblok', () => storyblok(app.context))
}
