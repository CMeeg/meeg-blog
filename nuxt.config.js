const pkg = require('./package')
require('dotenv').config()

export default {
  mode: 'universal',
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Pacifico&text=ChrisMeag&display=swap'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Zilla+Slab|Open+Sans&display=swap'
      }
    ]
  },
  loading: { color: '#68d391' },
  plugins: ['~/plugins/components', '~/plugins/filters', '~/plugins/storyblok'],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/dotenv',
    '@nuxtjs/tailwindcss'
  ],
  modules: [
    [
      'storyblok-nuxt',
      {
        accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
        cacheProvider: 'memory'
      }
    ]
  ],
  router: {
    middleware: ['setCacheVersion', 'setGlobal']
  },
  build: {
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
