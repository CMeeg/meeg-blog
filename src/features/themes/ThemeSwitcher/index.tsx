import { useEffect } from 'react'
// This react-use import is done like this to workaround some incompatibility between the library and Astro - if you import react-use as "normal" then you get a runtime error on a production build
// https://github.com/withastro/astro/issues/3174
import * as reactUse from 'react-use'
const { useMedia, useCookie } =
  (reactUse as unknown as { default: typeof reactUse }).default || reactUse
import { themes, defaultThemeName, themeCookieName } from '~/features/themes'
import { Sun, Moon } from '~/svg/icons'
import styles from './index.module.scss'

export default function ThemeSwitcher() {
  const [value, updateCookie] = useCookie(themeCookieName)
  // In dev `useMedia` will complain about not having a `defaultState`, but we don't want to set a default state because we can't assume the value of `prefers-color-scheme` - instead we handle it in `useEffect`
  const prefersDarkColorScheme = useMedia('(prefers-color-scheme: dark)')

  const toggleTheme = (preference?: string) => {
    const currentThemeName = value ?? defaultThemeName
    const themeName = preference
      ? preference
      : currentThemeName === themes.light.name
      ? themes.dark.name
      : themes.light.name

    const theme = themes[themeName]

    if (!theme) {
      return
    }

    updateCookie(theme.name)

    if (typeof window !== 'undefined') {
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
    }
  }

  useEffect(() => {
    if (typeof prefersDarkColorScheme !== 'undefined') {
      const colorSchemePreference = prefersDarkColorScheme
        ? themes.dark.name
        : themes.light.name

      toggleTheme(colorSchemePreference)
    }
  }, [prefersDarkColorScheme])

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
        <div className={styles.toggle}>
          <span className="sr-only">Toggle</span>
        </div>
      </label>
    </div>
  )
}
