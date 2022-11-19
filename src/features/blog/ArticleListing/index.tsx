import { storyblokEditable } from '@storyblok/js'
import type {
  ArticleListingStoryblok,
  MessageBoxStoryblok
} from '~/features/storyblok/types/components'
import type { ArticleStory } from '~/features/blog/api'
import MessageBox from '~/features/common/MessageBox'
import ArticleCard from '~/features/blog/ArticleCard'
import styles from './index.module.scss'

export interface Props {
  blok: ArticleListingStoryblok
}

export default function ArticleListing({ blok }: Props) {
  const articles = blok.articles as ArticleStory[]

  const hasArticles = Array.isArray(articles) && articles.length

  if (!hasArticles) {
    const messageBlok: MessageBoxStoryblok = {
      type: 'info',
      message: 'No articles found',
      component: 'message_box',
      _uid: ''
    }

    return <MessageBox blok={messageBlok} />
  }

  return (
    <div className="popout">
      <ul {...storyblokEditable(blok)}>
        {articles.map((article) => {
          return (
            <li className={styles.item} key={article.id}>
              <ArticleCard article={article} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
