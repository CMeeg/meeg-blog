import { storyblokEditable } from '@storyblok/js'
import type { MessageBoxStoryblok } from '~/features/storyblok/types/components'
import RichText from '~/features/common/RichText'
import styles from './index.module.scss'

export interface Props {
  blok: MessageBoxStoryblok
}

export default function MessageBox({ blok }: Props) {
  const message =
    typeof blok.message === 'string' ? (
      <p>{blok.message}</p>
    ) : (
      <RichText document={blok.message} />
    )

  return (
    <div
      {...storyblokEditable(blok)}
      className={`popout ${styles['message-box']} ${styles[blok.type]}`}
    >
      {message}
    </div>
  )
}
