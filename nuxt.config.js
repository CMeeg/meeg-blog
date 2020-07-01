export default {
  mode: 'universal',
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL || 'https://meeg.dev',
    sentryDsn: process.env.SENTRY_DSN,
    gaId: process.env.GA_ID
  },
  privateRuntimeConfig: {
    storyblokPreviewToken: process.env.STORYBLOK_PREVIEW_TOKEN
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
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
  plugins: [
    '~/plugins/composition-api.js',
    '~/plugins/storyblok',
    '~/plugins/app-components',
    '~/plugins/sb-components',
    '~/plugins/filters',
    '~/plugins/code-highlighter',
    '~/plugins/vue-content-placeholders',
    '~/plugins/metadata'
  ],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-analytics'
  ],
  modules: [
    [
      'storyblok-nuxt',
      {
        accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
        cacheProvider: 'memory'
      }
    ],
    '@nuxtjs/sentry'
  ],
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
  },
  googleAnalytics: {
    id: process.env.GA_ID
  }
}
