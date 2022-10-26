import { storyblokEditable } from '@storyblok/js'
import type { ArticleListingStoryblok } from '~/features/storyblok/types/components'
import type { ArticleStory } from '~/features/blog/api'
import ArticleCard from '~/features/blog/ArticleCard'
import styles from './index.module.scss'

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
    <ul {...storyblokEditable(blok)}>
      {articles.map((article) => {
        return (
          <li className={styles.item} key={article.id}>
            <ArticleCard article={article} />
          </li>
        )
      })}
    </ul>
  )
}
