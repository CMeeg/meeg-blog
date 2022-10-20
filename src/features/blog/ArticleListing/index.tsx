import type { ArticleListingStoryblok } from '@features/storyblok/types/components'
import type { ArticleStory } from '@features/blog/api'
import ArticleCard from '@features/blog/ArticleCard'

export interface Props {
  blok: ArticleListingStoryblok
}

export default function ArticleListing({ blok }: Props) {
  const articles = blok.articles as ArticleStory[]

  const hasArticles = Array.isArray(articles) && articles.length

  if (!hasArticles) {
    // TODO: Render as MessageBox
    return <p>No articles found</p>
  }

  return (
    <>
      {articles.map((article) => {
        return <ArticleCard article={article} key={article.id} />
      })}
    </>
  )
}
