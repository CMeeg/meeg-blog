import { createStoryblokApiClient } from '~/features/storyblok/api'
import type { APIContext } from 'astro'
import type { StoryData } from '@storyblok/js'
import { EnumChangefreq, SitemapStream, streamToPromise } from 'sitemap'
import type { StoryContent } from '~/features/storyblok/types/content-types'
import { getStoryUrl } from '~/features/storyblok/url'
import { getStoryDate } from '~/features/storyblok/date'

const getStories = async (req: Request) => {
  const apiClient = createStoryblokApiClient(req)

  const stories = await apiClient.getStories({
    query: {
      filter_query: {
        component: {
          not_in: 'global,article_series'
        }
      }
    }
  })

  return stories
}

const getTags = function (stories: StoryData<StoryContent>[]) {
  // We only want tags of articles
  const tags = stories
    .filter((story) => story.content.component === 'article')
    .flatMap((article) => article.tag_list)

  return new Set(tags)
}

const getStoryPriority = function (story: StoryData<StoryContent>) {
  if (story.content.component === 'article' || story.slug === 'home') {
    return 1
  }

  return 0.5
}

export async function get(context: APIContext) {
  const stories = await getStories(context.request)
  const tags = getTags(stories)

  const hostname = context.site?.origin ?? context.url.origin
  const changefreq = EnumChangefreq.MONTHLY

  const sitemapStream = new SitemapStream({ hostname })

  for (let index = 0; index < stories.length; index++) {
    const story = stories[index]

    const url = getStoryUrl(story)?.toLowerCase()

    if (!url) {
      continue
    }

    sitemapStream.write({
      url,
      lastmod: getStoryDate(story).toISOString(),
      changefreq,
      priority: getStoryPriority(story)
    })
  }

  tags.forEach((tag) =>
    sitemapStream.write({
      url: `/tags/${tag}`.toLowerCase(),
      changefreq,
      priority: 0.5
    })
  )

  sitemapStream.end()

  const sitemap = await streamToPromise(sitemapStream)

  return {
    body: sitemap.toString(),
    headers: {
      'Content-Type': 'application/xml'
    }
  }
}
