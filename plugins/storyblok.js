const apiGet = function({ api, path, query, successCallback, errorCallback }) {
  if (path.startsWith('/')) {
    path = path.substr(1)
  }

  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  return api
    .get(`cdn/stories/${path}`, query)
    .then(res => {
      return successCallback(res)
    })
    .catch(res => {
      errorCallback(res)
    })
}

const defaultErrorCallback = function(context, res) {
  if (!res.response) {
    console.error(res)
    context.error({
      statusCode: 404,
      message: 'Failed to receive content from api'
    })
  } else {
    console.error(res.response.data)
    context.error({
      statusCode: res.response.status,
      message: res.response.data
    })
  }
}

const isEditMode = function(context) {
  let editMode = false
  const $window = process.browser ? window : undefined

  if (
    context.query._storyblok ||
    context.isDev ||
    (typeof $window !== 'undefined' &&
      $window.localStorage.getItem('_storyblok_draft_mode'))
  ) {
    if (typeof $window !== 'undefined') {
      $window.localStorage.setItem('_storyblok_draft_mode', '1')
      if ($window.location == $window.parent.location) {
        $window.localStorage.removeItem('_storyblok_draft_mode')
      }
    }

    editMode = true
  }

  return editMode
}

const storyblok = function(context) {
  const version = isEditMode(context) ? 'draft' : 'published'

  return {
    get: (path, query, options) => {
      query = query || {}
      options = options || {}

      query.version = version
      query.cacheVersion = context.store.state.cacheVersion

      const successCallback =
        options.successCallback ||
        function(res) {
          return res.data
        }
      const errorCallback = options.errorCallback || defaultErrorCallback

      return apiGet({
        api: context.app.$storyapi,
        path: path,
        query: query,
        successCallback: res => successCallback(res),
        errorCallback: res => errorCallback(context, res)
      })
    },
    getAll: (query, options) => {
      query = query || {}
      options = options || {}

      query.version = version
      query.cacheVersion = context.store.state.cacheVersion

      const successCallback =
        options.successCallback ||
        function(res) {
          return {
            total: res.headers.total,
            stories: res.data.stories
          }
        }
      const errorCallback = options.errorCallback || defaultErrorCallback

      return apiGet({
        api: context.app.$storyapi,
        path: '',
        query: query,
        successCallback: res => successCallback(res),
        errorCallback: res => errorCallback(context, res)
      })
    },
    reloadOnChange: story => {
      context.$storybridge.on(['input', 'published', 'change'], event => {
        if (event.action == 'input') {
          if (event.story.id === this.story.id) {
            story.content = event.story.content
          }
        } else if (!event.slugChanged) {
          window.location.reload()
        }
      })
    },
    getStoryDate: story => {
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
