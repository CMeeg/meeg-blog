// eslint-disable-next-line import/no-extraneous-dependencies
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['Zilla Slab', ...defaultTheme.fontFamily.serif],
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
        cursive: [
          'Pacifico',
          'Palatino Linotype',
          'Book Antiqua',
          'Palatino',
          'serif'
        ]
      },
      minWidth: {
        0: '0',
        xs: '20rem',
        full: '100%'
      }
    }
  },
  variants: {},
  plugins: [],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['components/**/*.vue', 'layouts/**/*.vue', 'pages/**/*.vue']
  }
}
