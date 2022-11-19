import type { Highlighter } from 'shiki'
import type {
  ArticleStoryWithSeries,
  ArticleStory,
  ArticleSeriesStory
} from '../api'
import { getStoryDate } from '~/features/storyblok/date'
import { getTagUrl } from '~/features/blog'
import { CalendarIcon, TagsIcon, FilesIcon } from '~/svg/icons'
import RichText from '~/features/common/RichText'
import { getStoryUrl } from '~/features/storyblok/url'
import styles from './index.module.scss'

export interface Props {
  story: ArticleStoryWithSeries
  series: ArticleSeriesStory | null
  articlesInSeries: ArticleStory[]
  codeHighlighter: Highlighter
}

export default function ArticlePage({
  story,
  series,
  articlesInSeries,
  codeHighlighter
}: Props) {
  const { tag_list: tags } = story

  const { title, body } = story.content

  const isInSeries = series && articlesInSeries.length > 1

  const articleDate = getStoryDate(story).toDateString()

  return (
    <article>
      <div className="content">
        <h1 className={styles['article-title']}>{title}</h1>

        <aside className={styles['article-meta']}>
          <p className={styles['article-date']}>
            <time
              className={styles['article-date-time']}
              dateTime={articleDate}
            >
              <CalendarIcon className={styles['article-date-icon']} />
              <span>{articleDate}</span>
            </time>
          </p>
          {tags.length && (
            <div className={styles['article-tags']}>
              <TagsIcon className={styles['article-tags-icon']} />
              <ul className={styles['article-tags-links']}>
                {tags.map((tag) => {
                  return (
                    <li key={tag}>
                      <a href={getTagUrl(tag)}>{tag}</a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {isInSeries && (
            <p className={styles['article-series']}>
              <FilesIcon className={styles['article-series-icon']} />
              <span className={styles['article-series-text']}>
                This article is part of a <a href="#series">series</a>
              </span>
            </p>
          )}
        </aside>
      </div>

      <RichText
        document={body}
        codeHighlighter={codeHighlighter}
        className="content"
      />

      {isInSeries && (
        <aside id="series" className={`full ${styles['series']}`}>
          <div className={`content ${styles['series-content']}`}>
            <p className={styles['article-series']}>
              <FilesIcon className={styles['article-series-icon']} />
              <span className={styles['article-series-text']}>
                This article is part of a series
              </span>
            </p>
            <h2>{series.content.title}</h2>
            <RichText document={series.content.summary} />
            <div className="prose">
              <ol>
                {articlesInSeries.map((seriesArticle) => {
                  const isCurrentArticle = seriesArticle.uuid === story.uuid

                  if (isCurrentArticle) {
                    return (
                      <li key={seriesArticle.uuid}>
                        <p>{`(This article) ${seriesArticle.content.title}`}</p>
                      </li>
                    )
                  }

                  return (
                    <li key={seriesArticle.uuid}>
                      <p>
                        <a href={getStoryUrl(seriesArticle)}>
                          {seriesArticle.content.title}
                        </a>
                      </p>
                    </li>
                  )
                })}
              </ol>
            </div>
            {(series.content.wip ?? true) && (
              <p>
                <em>
                  N.B. This series is a work in progress - there are further
                  articles planned.
                </em>
              </p>
            )}
          </div>
        </aside>
      )}
    </article>
  )
}
