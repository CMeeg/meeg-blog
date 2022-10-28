import type { Highlighter } from 'shiki'
import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import { render, NODE_CODEBLOCK } from 'storyblok-rich-text-react-renderer'
import type { BlockComponent } from '~/features/common/Blocks/Block'
import Block from '~/features/common/Blocks/Block'
import Codeblock from './nodes/Codeblock'

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
          } as BlockComponent

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
        }
      })}
    </div>
  )
}
