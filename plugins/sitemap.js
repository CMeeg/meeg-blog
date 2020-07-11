import StoryblokClient from 'storyblok-js-client'

const storyapi = new StoryblokClient({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
  cache: {
    clear: 'auto',
    type: 'memory'
  },
  timeout: 0
})

const isProductionEnv = process.env.HOST_ENV === 'production'
const version = isProductionEnv ? 'published' : 'draft'

const apiGetLinks = function() {
  return storyapi
    .get('cdn/links', {
      version: version
    })
    .then(res => {
      const linksObj = res.data.links
      const linksArray = []

      Object.keys(linksObj).forEach(key => {
        linksArray.push(linksObj[key])
      })

      return {
        total: parseInt(res.headers.total),
        links: linksArray
      }
    })
    .catch(res => {
      if (!isProductionEnv) {
        console.error(res)
      }
    })
}

const apiGetStories = function(links) {
  const linkIds = links.links
    .filter(link => {
      return !isProductionEnv || link.published
    })
    .map(link => {
      return link.uuid
    })

  return storyapi
    .get('cdn/stories', {
      version: version,
      by_uuids: linkIds.join(',')
    })
    .then(res => {
      return {
        total: parseInt(res.headers.total),
        stories: res.data.stories
      }
    })
    .catch(res => {
      if (!isProductionEnv) {
        console.error(res)
      }
    })
}

const getStoryUrl = function(story) {
  if (story.path) {
    return story.path
  }

  return `/${story.full_slug}`
}

const getStoryLastModified = function(story) {
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

const getStoryChangeFrequency = function(story) {
  if (story.slug === 'home') {
    return 'weekly'
  }

  return 'monthly'
}

const getStoryPriority = function(story) {
  if (story.content.component === 'article' || story.slug === 'home') {
    return 1.0
  }

  return 0.5
}

export default {
  getRoutes: async () => {
    const links = await apiGetLinks()
    const stories = await apiGetStories(links)
    const excludedContentTypes = ['global', 'article_series']

    const siteMapItems = stories.stories
      .filter(story => {
        return !excludedContentTypes.includes(story.content.component)
      })
      .map(story => {
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
