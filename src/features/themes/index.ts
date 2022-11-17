import type { AstroCookies } from 'astro/dist/core/cookies'
import { fingerprintUrl } from '~/features/common/url'

interface Theme {
  name: string
  color: string
  favicon: string
}

interface Themes {
  [name: string]: Theme
}

const themes: Themes = {
  dark: {
    name: 'dark',
    color: '#212529',
    favicon: fingerprintUrl('/favicon-dark.png')
  },
  light: {
    name: 'light',
    color: '#f8f9fa',
    favicon: fingerprintUrl('/favicon.png')
  }
}

const defaultThemeName = themes.light.name

const themeCookieName = 'theme'

const getCurrentTheme = (cookies: AstroCookies, fallbacktoDefault = false) => {
  const themeCookie = cookies.get(themeCookieName)
  const currentThemeName = themeCookie?.value
  const currentTheme = currentThemeName ? themes[currentThemeName] : null

  if (currentTheme) {
    return currentTheme
  }

  if (fallbacktoDefault) {
    return themes[defaultThemeName]
  }

  return null
}

export { themes, defaultThemeName, themeCookieName, getCurrentTheme }

export type { Theme }
