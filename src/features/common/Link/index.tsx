import type { ComponentChildren } from 'preact'
import type { MultilinkStoryblok } from '~/features/storyblok/types/components'
import { getLinkUrl } from '~/features/storyblok/url'

export interface Props {
  link: MultilinkStoryblok
  children: ComponentChildren
}

export default function Link({ link, children }: Props) {
  const url = getLinkUrl(link)

  if (!url) {
    return null
  }

  return <a href={url}>{children}</a>
}
