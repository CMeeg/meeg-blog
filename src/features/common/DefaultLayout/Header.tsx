import type {
  AssetStoryblok,
  NavItemStoryblok
} from '~/features/storyblok/types/components'
import Image from '~/features/common/Image'
import Link from '~/features/common/Link'
import { ChrisMeagher } from '~/svg/index'
import { getImageFromAsset } from '../media'
import styles from './header.module.scss'

export interface Props {
  logo: AssetStoryblok
  mainNav: NavItemStoryblok[]
}

export default function Header({ logo, mainNav }: Props) {
  const image = getImageFromAsset(logo, { resize: { width: 140 }, quality: 80 })

  return (
    <header>
      <div className={styles.logo}>
        <span className={styles['logo-img-border']}>
          <Image
            className={styles['logo-img']}
            image={image}
            width={70}
            height={70}
          />
        </span>
        <ChrisMeagher className={styles['logo-text']} />
      </div>

      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>

          {mainNav.map((item) => {
            return (
              <li key={item._uid}>
                <Link link={item.link}>{item.name}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
