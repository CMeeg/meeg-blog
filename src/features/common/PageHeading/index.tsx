import type { PageHeadingStoryblok } from '~/features/storyblok/types/components'
import RichText from '~/features/common/RichText'
import styles from './index.module.scss'

export interface Props {
  blok: PageHeadingStoryblok
  children?: React.ReactNode
}

export default function PageHeading({ blok, children }: Props) {
  return (
    <div className={styles['page-heading']}>
      <h1 className={styles['page-heading-title']}>{blok.title}</h1>

      {blok.intro && (
        <RichText
          className={styles['page-heading-description']}
          document={blok.intro}
        />
      )}

      {children && (
        <div className={`prose ${styles['page-heading-description']}`}>
          {children}
        </div>
      )}
    </div>
  )
}
