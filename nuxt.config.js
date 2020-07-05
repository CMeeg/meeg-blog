export default {
  mode: 'universal',
  publicRuntimeConfig: {
    baseUrl:
      process.env.BASE_URL || 'https://${VERCEL_URL}' || 'https://meeg.dev',
    storyblokUseVersion: process.env.STORYBLOK_USE_VERSION || 'published',
    sentryDsn: process.env.SENTRY_DSN,
    gaId: process.env.GA_ID
  },
  privateRuntimeConfig: {
    storyblokPreviewToken: process.env.STORYBLOK_PREVIEW_TOKEN
  },
  components: [
    '~/components',
    // StoryBlok components are mostly dynamic so can't auto-load - these are managed via `~/pluings/sb-components.js`
    { path: '~/components/storyblok/', ignore: ['**/*'] }
  ],
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
  },
  loading: { color: '#68d391' },
  plugins: [
    '~/plugins/composition-api.js',
    '~/plugins/storyblok',
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
    '@nuxtjs/sentry',
    'nuxt-webfontloader',
    '@nuxtjs/robots'
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
    id: process.env.GA_ID,
    debug: {
      sendHitTask: process.env.NODE_ENV === 'production'
    }
  },
  webfontloader: {
    custom: {
      families: ['Pacifico:n4', 'Zilla Slab:n4', 'Open Sans:n4'],
      urls: [
        'https://fonts.googleapis.com/css?family=Pacifico:400&text=ChrisMeag&display=swap',
        'https://fonts.googleapis.com/css?family=Zilla+Slab:400|Open+Sans:400&display=swap'
      ]
    }
  },
  robots: () => {
    if (process.env.NODE_ENV !== 'production') {
      return {
        UserAgent: '*',
        Disallow: '/'
      }
    }

    return {
      UserAgent: '*',
      Allow: '/'
    }
  }
}
