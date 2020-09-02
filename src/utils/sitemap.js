import StoryblokClient from 'storyblok-js-client'

const getStories = async function (appSettings, storyblokSettings) {
  const storyapi = new StoryblokClient({
    accessToken: storyblokSettings.previewToken,
    cache: {
      clear: 'auto',
      type: 'memory'
    },
    timeout: 0
  })

  try {
    const response = await storyapi.get('cdn/stories', {
      version: storyblokSettings.useVersion,
      filter_query: {
        component: {
          not_in: 'global,article_series'
        }
      }
    })

    return {
      total: Number.parseInt(response.headers.total, 10),
      stories: response.data.stories
    }
  } catch (error) {
    if (appSettings.hostEnv !== 'production') {
      // eslint-disable-next-line
      console.error(error)
    }
  }
}

const getTags = function (stories) {
  // We only want tags of articles
  const tags = stories
    .filter((story) => story.content.component === 'article')
    .flatMap((article) => article.tag_list)

  return new Set(tags)
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
  return 'monthly'
}

const getStoryPriority = function (story) {
  if (story.content.component === 'article' || story.slug === 'home') {
    return 1
  }

  return 0.5
}

export default {
  getRoutes: async (appSettings, storyblokSettings) => {
    const stories = await getStories(appSettings, storyblokSettings)
    const tags = getTags(stories.stories)

    const siteMapItems = stories.stories.map((story) => {
      return {
        url: getStoryUrl(story),
        lastmod: getStoryLastModified(story),
        changefreq: getStoryChangeFrequency(story),
        priority: getStoryPriority(story)
      }
    })

    tags.forEach((tag) =>
      siteMapItems.push({
        url: `/tags/${tag}`,
        changefreq: 'monthly',
        priority: 0.5
      })
    )

    return siteMapItems
  }
}
