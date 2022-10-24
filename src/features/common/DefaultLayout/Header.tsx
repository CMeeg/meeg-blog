import type {
  AssetStoryblok,
  NavItemStoryblok
} from '~/features/storyblok/types/components'
import Image from '~/features/common/Image'
import Link from '~/features/common/Link'
import { ChrisMeagher } from '~/svg/index'
import { getImageFromAsset } from '../media'
import ThemeSwitcher from '~/features/themes/ThemeSwitcher'
import styles from './header.module.scss'

export interface Props {
  logo: AssetStoryblok
  mainNav: NavItemStoryblok[]
}

export default function Header({ logo, mainNav }: Props) {
  const image = getImageFromAsset(logo, { resize: { width: 140 }, quality: 80 })

  return (
    <header className={styles.header}>
      <a href="/" className={styles['logo']}>
        <span className={styles['logo-img-border']}>
          <Image
            className={styles['logo-img']}
            image={image}
            width={70}
            height={70}
          />
        </span>
        <ChrisMeagher className={styles['logo-text']} />
      </a>

      <nav role="navigation" className={styles.nav}>
        <div className={styles['nav-container']}>
          <input
            type="checkbox"
            className={styles['nav-toggle']}
            id="nav-primary-toggle"
          />
          <label htmlFor="nav-primary-toggle" className="sr-only">
            Menu
          </label>

          <span className={styles['nav-icon']} />

          <div className={styles['nav-content']}>
            <ul className={styles['nav-primary']}>
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

            <ThemeSwitcher />
          </div>
        </div>
      </nav>
    </header>
  )
}
