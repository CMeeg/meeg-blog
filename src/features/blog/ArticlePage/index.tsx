import type { Highlighter } from 'shiki'
import type { ArticleStory } from '../api'
import { getStoryDate } from '~/features/storyblok/date'
import { getTagUrl } from '~/features/blog'
import { CalendarIcon, TagsIcon, FilesIcon } from '~/svg/icons'
import RichText from '~/features/common/RichText'
import styles from './index.module.scss'

export interface Props {
  story: ArticleStory
  codeHighlighter: Highlighter
}

export default function ArticlePage({ story, codeHighlighter }: Props) {
  const { tag_list: tags } = story

  const { title, body, series } = story.content

  const articleDate = getStoryDate(story).toDateString()

  return (
    <article>
      <h1 className={styles['article-title']}>{title}</h1>

      <aside className={styles['article-meta']}>
        <p className={styles['article-date']}>
          <time className={styles['article-date-time']} dateTime={articleDate}>
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
        {series && (
          <p className={styles['article-series']}>
            <FilesIcon className={styles['article-series-icon']} />
            <span className={styles['article-series-text']}>
              This article is part of a <a href="#series">series</a>
            </span>
          </p>
        )}
      </aside>

      <RichText document={body} codeHighlighter={codeHighlighter} />

      {/* TODO: Article series component */}
    </article>
  )
}
