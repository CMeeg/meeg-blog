import type { ComponentType } from 'preact'
import type {
  ArticleListingStoryblok,
  MessageBoxStoryblok,
  PageHeadingStoryblok
} from '~/features/storyblok/types/components'
import ArticleListing from '~/features/blog/ArticleListing'
import MessageBox from '~/features/common/MessageBox'
import PageHeading from '~/features/common/PageHeading'

type BlockComponent = ComponentType<Props>

interface ComponentsMap {
  [key: string]: BlockComponent
}

const components: ComponentsMap = {
  article_listing: ArticleListing as BlockComponent,
  message_box: MessageBox as BlockComponent,
  page_heading: PageHeading as BlockComponent
}

const getComponent = (name: string) => {
  const component = components[name]

  if (!component) {
    return null
  }

  return component
}

export type BlockComponentProps =
  | ArticleListingStoryblok
  | MessageBoxStoryblok
  | PageHeadingStoryblok

export interface Props {
  blok?: BlockComponentProps
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
