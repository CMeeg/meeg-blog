import { storyblokEditable } from '@storyblok/js'
import type { MessageBoxStoryblok } from '~/features/storyblok/types/components'
import RichText from '~/features/common/RichText'
import styles from './index.module.scss'

export interface Props {
  blok: MessageBoxStoryblok
}

export default function MessageBox({ blok }: Props) {
  return (
    <div
      {...storyblokEditable(blok)}
      className={`${styles['message-box']} ${styles[blok.type]}`}
    >
      <RichText document={blok.message} />
    </div>
  )
}
