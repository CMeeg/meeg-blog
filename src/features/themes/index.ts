interface Themes {
  [name: string]: {
    name: string
    color: string
  }
}

// TODO: Update colors after settling on themes
const themes: Themes = {
  dark: {
    name: 'dark',
    color: '#212529'
  },
  light: {
    name: 'light',
    color: '#f8f9fa'
  }
}

const defaultThemeName = themes.light.name

const themeCookieName = 'theme'

export { themes, defaultThemeName, themeCookieName }
