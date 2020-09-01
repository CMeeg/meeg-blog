// eslint-disable-next-line import/no-extraneous-dependencies
import StoryblokClient from 'storyblok-js-client'

const storyapi = new StoryblokClient({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
  cache: {
    clear: 'auto',
    type: 'memory'
  },
  timeout: 0
})

const isProductionEnvironment = process.env.HOST_ENV === 'production'
const version = isProductionEnvironment ? 'published' : 'draft'

const apiGetLinks = function () {
  return storyapi
    .get('cdn/links', {
      version
    })
    .then((response) => {
      const linksObject = response.data.links
      const linksArray = []

      Object.keys(linksObject).forEach((key) => {
        linksArray.push(linksObject[key])
      })

      return {
        total: Number.parseInt(response.headers.total, 10),
        links: linksArray
      }
    })
    .catch((error) => {
      if (!isProductionEnvironment) {
        // eslint-disable-next-line
        console.error(error)
      }
    })
}

const apiGetStories = function (links) {
  const linkIds = links.links
    .filter((link) => {
      return !isProductionEnvironment || link.published
    })
    .map((link) => {
      return link.uuid
    })

  return storyapi
    .get('cdn/stories', {
      version,
      // eslint-disable-next-line camelcase
      by_uuids: linkIds.join(',')
    })
    .then((response) => {
      return {
        total: Number.parseInt(response.headers.total, 10),
        stories: response.data.stories
      }
    })
    .catch((error) => {
      if (!isProductionEnvironment) {
        // eslint-disable-next-line
        console.error(error)
      }
    })
}

const getStoryUrl = function (story) {
  if (story.path) {
    return story.path
  }

  return `/${story.full_slug}`
}

const getStoryLastModified = function (story) {
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

const getStoryChangeFrequency = function (story) {
  if (story.slug === 'home') {
    return 'weekly'
  }

  return 'monthly'
}

const getStoryPriority = function (story) {
  if (story.content.component === 'article' || story.slug === 'home') {
    return 1
  }

  return 0.5
}

export default {
  getRoutes: async () => {
    const links = await apiGetLinks()
    const stories = await apiGetStories(links)
    const excludedContentTypes = new Set(['global', 'article_series'])

    const siteMapItems = stories.stories
      .filter((story) => {
        return !excludedContentTypes.has(story.content.component)
      })
      .map((story) => {
        return {
          url: getStoryUrl(story),
          lastmod: getStoryLastModified(story),
          changefreq: getStoryChangeFrequency(story),
          priority: getStoryPriority(story)
        }
      })

    return siteMapItems
  }
}
