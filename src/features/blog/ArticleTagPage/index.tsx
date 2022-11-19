import type {
  PageHeadingStoryblok,
  ArticleListingStoryblok
} from '~/features/storyblok/types/components'
import type { ArticleStory } from '~/features/blog/api'
import PageHeading from '~/features/common/PageHeading'
import ArticleListing from '~/features/blog/ArticleListing'

export interface Props {
  tag: string
  articles: ArticleStory[]
}

export default function ArticleTagPage({ tag, articles }: Props) {
  const headingBlok: PageHeadingStoryblok = {
    title: tag,
    component: 'page_heading',
    _uid: ''
  }

  const articlesBlok: ArticleListingStoryblok = {
    articles,
    per_page: 12,
    component: 'article_listing',
    _uid: ''
  }

  return (
    <div className="content">
      <PageHeading blok={headingBlok}>
        <p>
          Articles about <i>{tag}</i> can be found below.
        </p>
      </PageHeading>

      <ArticleListing blok={articlesBlok} />
    </div>
  )
}
