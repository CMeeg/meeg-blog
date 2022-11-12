interface ArticleSeoMetadata {
  published_time: string
  author: string
  section: string
  tags: string[]
}

interface ProfileSeoMetadata {
  first_name: string
  last_name: string
}

export type { ArticleSeoMetadata, ProfileSeoMetadata }
