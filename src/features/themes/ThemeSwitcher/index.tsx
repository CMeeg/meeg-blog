import { useEffect } from 'preact/hooks'
import Cookies from 'js-cookie'
import { themes, defaultThemeName, themeCookieName } from '~/features/themes'
import { SunIcon, MoonIcon } from '~/svg/icons'
import styles from './index.module.scss'

export default function ThemeSwitcher() {
  const toggleTheme = (preference?: string) => {
    if (typeof window === 'undefined') {
      return
    }

    const currentThemeName = Cookies.get(themeCookieName) ?? defaultThemeName

    const themeName = preference
      ? preference
      : currentThemeName === themes.light.name
      ? themes.dark.name
      : themes.light.name

    const theme = themes[themeName]

    if (!theme) {
      return
    }

    Cookies.set(themeCookieName, theme.name)

    // Set theme data attribute
    const doc = document.documentElement

    doc.setAttribute('data-theme', theme.name)

    // Set theme-color meta element
    const docHead = doc.querySelector('head')

    if (!docHead) {
      return
    }

    const themeColorName = 'theme-color'

    let themeColor = docHead.querySelector(`meta[name='${themeColorName}']`)

    if (!themeColor) {
      themeColor = document.createElement('meta')
      themeColor.setAttribute('name', themeColorName)

      docHead.appendChild(themeColor)
    }

    themeColor.setAttribute('content', theme.color)

    // Set favicon

    const favicon = docHead.querySelector(`link[rel='icon']`)

    if (favicon) {
      favicon.setAttribute('href', theme.favicon)
    }
  }

  useEffect(() => {
    const getThemeName = (prefersDark: boolean) => {
      return prefersDark ? themes.dark.name : themes.light.name
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const currentThemeName = Cookies.get(themeCookieName)

    if (!currentThemeName) {
      // If no cookie is set then we will set the value based on the media query

      toggleTheme(getThemeName(mq.matches))
    }

    // Set up a change event listener so that if the perference is toggled the scheme will update accordingly

    let mounted = true

    const onChange = function (e: MediaQueryListEvent) {
      if (!mounted) {
        return
      }

      toggleTheme(getThemeName(e.matches))
    }

    mq.addEventListener('change', onChange)

    return function () {
      mounted = false
      mq.removeEventListener('change', onChange)
    }
  }, [])

  return (
    <div className={styles['theme-switcher']}>
      <input
        type="checkbox"
        id="theme-toggle"
        className={styles['toggle-input']}
        onChange={() => toggleTheme()}
      />
      <label htmlFor="theme-toggle" className={styles['toggle-label']}>
        <SunIcon className={styles.sun} />
        <MoonIcon className={styles.moon} />
        <div className={styles.toggle}>
          <span className="visually-hidden">Switch to dark mode</span>
        </div>
      </label>
    </div>
  )
}
