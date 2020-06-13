/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: [
          'Zilla Slab',
          ...defaultTheme.fontFamily.serif
        ],
        sans: [
          'Open Sans',
          ...defaultTheme.fontFamily.sans
        ],
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
