import type { ArticleStory } from '../api'
import { getStoryUrl } from '@features/storyblok/url'
import RichText from '@features/common/RichText'
import { getStoryDate } from '@features/storyblok/date'

export interface Props {
  article: ArticleStory
}

export default function ArticleCard({ article }: Props) {
  const { title, summary } = article.content

  const url = getStoryUrl(article)

  const articleDate = getStoryDate(article).toDateString()

  return (
    <div>
      <h2>{url ? <a href={url}>{title}</a> : title}</h2>

      <p>
        <time dateTime={articleDate}>{articleDate}</time>
      </p>

      <RichText document={summary} />
    </div>
  )
}
