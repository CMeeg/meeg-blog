import type { ArticleStory } from '../api'
import { getStoryDate } from '@features/storyblok/date'
import { getTagUrl } from '@features/blog'
import RichText from '@features/common/RichText'

export interface Props {
  story: ArticleStory
}

export default function ArticlePage({ story }: Props) {
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
      {/* TODO: Add the remaining rich text blocks, marks and bloks so this renders in full */}
      <RichText document={body} />
      // TODO: Article series component
    </>
  )
}
