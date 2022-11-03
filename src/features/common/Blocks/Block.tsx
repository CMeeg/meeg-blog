import type {
  ArticleListingStoryblok,
  MessageBoxStoryblok,
  PageHeadingStoryblok
} from '~/features/storyblok/types/components'
import ArticleListing from '~/features/blog/ArticleListing'
import MessageBox from '~/features/common/MessageBox'
import PageHeading from '~/features/common/PageHeading'

interface ComponentsMap {
  [key: string]: React.ElementType
}

const components: ComponentsMap = {
  article_listing: ArticleListing,
  message_box: MessageBox,
  page_heading: PageHeading
}

const getComponent = (name: string) => {
  return components[name]
}

export type BlockComponent =
  | ArticleListingStoryblok
  | MessageBoxStoryblok
  | PageHeadingStoryblok

export interface Props {
  blok?: BlockComponent
}

export default function Block({ blok }: Props) {
  if (!blok) {
    return null
  }

  // TODO: Would be good if `blok.component` was an enum - idealy would change type generation

  const Component = getComponent(blok.component)

  if (!Component) {
    return <p>Unknown component: {blok.component}</p>
  }

  return <Component blok={blok} />
}
