import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import { render } from 'storyblok-rich-text-react-renderer'
import type { BlockComponent } from '~/features/common/Blocks/Block'
import Block from '~/features/common/Blocks/Block'

export interface Props {
  document: StoryblokRichtext
  className?: string
}

const defaultClassName = 'prose'

export default function RichText({ document, className }: Props) {
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
        }
      })}
    </div>
  )
}
