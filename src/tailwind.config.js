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
    },
    typography: (theme) => ({
      default: {
        css: {
          color: theme('colors.gray.300'),
          a: {
            color: theme('colors.green.400'),
            textDecoration: 'none',
            '&:focus': {
              outline: 0,
              textDecoration: 'underline'
            },
            '&:hover': {
              textDecoration: 'underline'
            }
          },
          code: {
            backgroundColor: '#011627',
            borderRadius: '0.5rem',
            color: '#c792ea',
            display: 'inline-block',
            fontWeight: '400',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem'
          },
          'code::before': {
            content: 'none'
          },
          'code::after': {
            content: 'none'
          },
          h2: {
            color: theme('colors.white'),
            fontFamily: theme('fontFamily.serif').join(', '),
            fontSize: '1.875rem',
            fontWeight: 'inherit'
          },
          h3: {
            color: theme('colors.white'),
            fontFamily: theme('fontFamily.serif').join(', '),
            fontSize: '1.5rem',
            fontWeight: 'inherit'
          },
          h4: {
            color: theme('colors.white'),
            fontFamily: theme('fontFamily.serif').join(', '),
            fontSize: '1.25rem',
            fontWeight: 'inherit'
          },
          h5: {
            color: theme('colors.white'),
            fontFamily: theme('fontFamily.serif').join(', '),
            fontSize: '1.125rem',
            fontWeight: 'inherit'
          },
          'ul > li:last-child': {
            marginBottom: 0
          },
          '> ul > li > *:last-child': {
            marginBottom: 0
          },
          'ol > li::before': {
            color: theme('colors.gray.300')
          },
          'ol > li:last-child': {
            marginBottom: 0
          },
          '> ol > li > *:last-child': {
            marginBottom: 0
          },
          'ul > .list-none,ol > .list-none': {
            paddingLeft: 0
          },
          'ul > .list-none::before,ol > .list-none::before': {
            content: 'none'
          },
          blockquote: {
            fontWeight: 'inherit',
            color: theme('colors.gray.300'),
            borderLeftColor: theme('colors.gray.800')
          },
          pre: {
            background: 'transparent',
            borderRadius: 0,
            overflowX: 'auto',
            padding: 0
          },
          'pre code': {
            backgroundColor: '#011627',
            borderRadius: '0.5rem',
            display: 'block',
            padding: '1.5rem'
          }
        }
      }
    })
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
  purge: {
    mode: 'all',
    enabled: process.env.NODE_ENV === 'production',
    content: ['src/components/**/*.vue', 'src/layouts/**/*.vue', 'src/pages/**/*.vue']
  },
  future: {
    removeDeprecatedGapUtilities: true
  }
}
