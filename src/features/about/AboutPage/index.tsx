import type { AboutStory } from '~/features/about/api'
import type { PageHeadingStoryblok } from '~/features/storyblok/types/components'
import PageHeading from '~/features/common/PageHeading'
import RichText from '~/features/common/RichText'

export interface Props {
  story: AboutStory
}

export default function AboutPage({ story }: Props) {
  const headingBlok: PageHeadingStoryblok = {
    title: story.content.title ?? 'About me',
    intro: story.content.intro,
    component: 'page_heading',
    _uid: ''
  }

  return (
    <div className="content">
      <PageHeading blok={headingBlok} />

      <RichText document={story.content.bio} />
    </div>
  )
}
