import { useEffect } from 'react'
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

  useEffect(() => {
    let mounted = true

    const element = document.querySelector('#menu-primary-toggle')

    if (element) {
      const menuOpenClassName = 'js-menu-open'

      const onChange = function (e: Event) {
        if (!mounted) {
          return
        }

        const doc = document.documentElement
        const target = e.target as HTMLInputElement

        if (target.checked) {
          doc.classList.add(menuOpenClassName)
        } else {
          doc.classList.remove(menuOpenClassName)
        }
      }

      const menuToggle = element as HTMLInputElement
      menuToggle.addEventListener('change', onChange)

      return function () {
        mounted = false
        menuToggle.removeEventListener('change', onChange)
      }
    }
  }, [])

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

      <div className={styles.menu}>
        <div className={styles['menu-container']}>
          <input
            type="checkbox"
            className={styles['menu-toggle']}
            id="menu-primary-toggle"
          />
          <label htmlFor="menu-primary-toggle" className="sr-only">
            Menu
          </label>

          <span className={styles['menu-icon']} />

          <div className={styles['menu-content-container']}>
            <div className={styles['menu-content']}>
              <nav role="navigation" className={styles['nav-primary']}>
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

              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
