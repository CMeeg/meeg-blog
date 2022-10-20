import type { PageHeadingStoryblok } from '@features/storyblok/types/components'
import RichText from '@features/common/RichText'

export interface Props {
  blok: PageHeadingStoryblok
}

export default function PageHeading({ blok }: Props) {
  return (
    <>
      <h1>{blok.title}</h1>

      <RichText document={blok.intro} />
    </>
  )
}
