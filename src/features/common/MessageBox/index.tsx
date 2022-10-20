import type { MessageBoxStoryblok } from '@features/storyblok/types/components'
import RichText from '@features/common/RichText'

export interface Props {
  blok: MessageBoxStoryblok
}

export default function MessageBox({ blok }: Props) {
  return (
    <div className={blok.type}>
      <RichText document={blok.message} />
    </div>
  )
}
