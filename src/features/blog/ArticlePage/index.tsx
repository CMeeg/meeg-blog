import type { Highlighter } from 'shiki'
import type { ArticleStory } from '../api'
import { getStoryDate } from '~/features/storyblok/date'
import { getTagUrl } from '~/features/blog'
import RichText from '~/features/common/RichText'

export interface Props {
  story: ArticleStory
  codeHighlighter: Highlighter
}

export default function ArticlePage({ story, codeHighlighter }: Props) {
  const { tag_list: tags } = story

  const { title, body, series } = story.content

  const articleDate = getStoryDate(story).toDateString()

  return (
    <>
      <h1>{title}</h1>
      <p>
        <time dateTime={articleDate}>{articleDate}</time>
      </p>
      {tags.length && (
        <ul>
          {tags.map((tag) => {
            return (
              <li key={tag}>
                <a href={getTagUrl(tag)}>{tag}</a>
              </li>
            )
          })}
        </ul>
      )}
      {series && (
        <>
          This article is part of a <a href="#series">series</a>
        </>
      )}

      <RichText document={body} codeHighlighter={codeHighlighter} />

      {/* TODO: Article series component */}
    </>
  )
}
