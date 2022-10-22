interface Themes {
  [name: string]: {
    name: string
    color: string
  }
}

const themes: Themes = {
  dark: {
    name: 'dark',
    color: 'rgb(33, 37, 41)'
  },
  light: {
    name: 'light',
    color: 'rgb(248, 249, 250)'
  }
}

const defaultThemeName = themes.light.name

const themeCookieName = 'theme'

export { themes, defaultThemeName, themeCookieName }
