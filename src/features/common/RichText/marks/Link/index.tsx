import type { ComponentChildren } from 'preact'
import type { MultilinkStoryblok } from '~/features/storyblok/types/components'
import SbLink from '~/features/common/Link'

interface LinkProps {
  linktype?: string
  href?: string
  target?: string
  anchor?: string
  uuid?: string
}

export interface Props extends LinkProps {
  children: ComponentChildren
}

const createLink = (link: LinkProps): MultilinkStoryblok => {
  if (link.linktype === 'email') {
    return {
      id: link.uuid,
      email: `mailto:${link.href}`,
      linktype: link.linktype
    }
  }

  return {
    id: link.uuid,
    cached_url: link.href,
    linktype: link.linktype,
    target: link.target,
    anchor: link.anchor
  }
}

export default function Link({
  linktype,
  href,
  target,
  anchor,
  uuid,
  children
}: Props) {
  const link = createLink({
    linktype,
    href,
    target,
    anchor,
    uuid
  })

  return <SbLink link={link}>{children}</SbLink>
}
