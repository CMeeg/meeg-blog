import type { Highlighter } from 'shiki'
import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import {
  render,
  NODE_CODEBLOCK,
  MARK_LINK
} from 'storyblok-rich-text-react-renderer'
import type { BlockComponentProps } from '~/features/common/Blocks/Block'
import Block from '~/features/common/Blocks/Block'
import Codeblock from './nodes/Codeblock'
import Link from './marks/Link'

export interface Props {
  document: StoryblokRichtext
  codeHighlighter?: Highlighter
  className?: string
}

const defaultClassName = 'prose'

export default function RichText({
  document,
  codeHighlighter,
  className
}: Props) {
  const cssClass = className
    ? `${className} ${defaultClassName}`
    : defaultClassName

  return (
    <div className={cssClass}>
      {render(document, {
        defaultBlokResolver: (name, props) => {
          const blok = {
            ...props,
            component: name
          } as BlockComponentProps

          return <Block blok={blok} />
        },
        nodeResolvers: {
          [NODE_CODEBLOCK]: (children, props) => (
            <Codeblock
              languageClass={props.class}
              highlighter={codeHighlighter}
            >
              {children}
            </Codeblock>
          )
        },
        markResolvers: {
          [MARK_LINK]: (children, { linktype, href, target, anchor, uuid }) => (
            <Link
              linktype={linktype}
              href={href}
              target={target}
              anchor={anchor}
              uuid={uuid}
            >
              {children}
            </Link>
          )
        }
      })}
    </div>
  )
}
