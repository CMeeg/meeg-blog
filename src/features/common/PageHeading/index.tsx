import type { PageHeadingStoryblok } from '~/features/storyblok/types/components'
import RichText from '~/features/common/RichText'
import styles from './index.module.scss'

export interface Props {
  blok: PageHeadingStoryblok
}

export default function PageHeading({ blok }: Props) {
  return (
    <div className={styles['page-heading']}>
      <h1 className={styles['page-heading-title']}>{blok.title}</h1>

      <RichText
        className={styles['page-heading-description']}
        document={blok.intro}
      />
    </div>
  )
}
