import type { StoryData } from '@storyblok/js'

const getStoryDate = (story: StoryData) => {
  if (story.sort_by_date !== null) {
    return new Date(story.sort_by_date)
  }

  if (story.first_published_at !== null) {
    return new Date(story.first_published_at)
  }

  if (story.published_at !== null) {
    return new Date(story.published_at)
  }

  return new Date(story.created_at)
}

export { getStoryDate }
