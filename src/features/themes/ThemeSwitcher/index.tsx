import { useEffect } from 'react'
import { useMedia, useCookie } from 'react-use'
import { themes, defaultTheme, themeCookieName } from '~/features/themes'
import { Sun, Moon } from '~/svg/icons'
import styles from './index.module.scss'

export default function ThemeSwitcher() {
  const [value, updateCookie] = useCookie(themeCookieName)
  const prefersDarkColorScheme = useMedia('(prefers-color-scheme: dark)')

  const toggleTheme = (preference?: string) => {
    const currentTheme = value ?? defaultTheme
    const newTheme = preference
      ? preference
      : currentTheme === themes.light
      ? themes.dark
      : themes.light

    if (newTheme === currentTheme) {
      return
    }

    updateCookie(newTheme)

    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  useEffect(() => {
    if (!value) {
      const colorSchemePreference = prefersDarkColorScheme
        ? themes.dark
        : themes.light

      toggleTheme(colorSchemePreference)
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
        <Sun className={styles.sun} />
        <Moon className={styles.moon} />
        <div className={styles.toggle}></div>
      </label>
    </div>
  )
}
