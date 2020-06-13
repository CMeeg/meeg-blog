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
      }
    }
  },
  variants: {},
  plugins: []
}
