import type {
  ArticleListingStoryblok,
  MessageBoxStoryblok,
  PageHeadingStoryblok
} from '@features/storyblok/types/components'
import ArticleListing from '@features/blog/ArticleListing'
import PageHeading from '@features/common/PageHeading'
import type React from 'react'

interface ComponentsMap {
  [key: string]: React.ElementType
}

const components: ComponentsMap = {
  article_listing: ArticleListing,
  page_heading: PageHeading
}

const getComponent = (name: string) => {
  return components[name]
}

export interface Props {
  bloks?: (
    | ArticleListingStoryblok
    | MessageBoxStoryblok
    | PageHeadingStoryblok
  )[]
}

export default function Blocks({ bloks }: Props) {
  if (!bloks) {
    return null
  }

  return (
    <>
      {bloks.map((blok) => {
        // TODO: Would be good if `blok.component` was an enum - idealy would change type generation

        const Component = getComponent(blok.component)

        if (!Component) {
          return <p key={blok._uid}>Unknown component: {blok.component}</p>
        }

        return <Component blok={blok} key={blok._uid} />
      })}
    </>
  )
}
