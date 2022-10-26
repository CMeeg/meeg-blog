import type { ArticleStory } from '../api'
import { getStoryUrl } from '~/features/storyblok/url'
import RichText from '~/features/common/RichText'
import { getStoryDate } from '~/features/storyblok/date'
import { Calendar } from '~/svg/icons'
import styles from './index.module.scss'

export interface Props {
  article: ArticleStory
}

export default function ArticleCard({ article }: Props) {
  const { title, summary } = article.content

  const url = getStoryUrl(article)

  const articleDate = getStoryDate(article).toDateString()

  return (
    <div className={styles.card}>
      <h2 className={styles['card-title']}>
        {url ? <a href={url}>{title}</a> : title}
      </h2>

      <p className={styles['card-meta']}>
        <time className={styles['card-meta-date']} dateTime={articleDate}>
          <Calendar className={styles['card-meta-date-icon']} />
          <span>{articleDate}</span>
        </time>
      </p>

      <RichText className={styles['card-description']} document={summary} />
    </div>
  )
}
