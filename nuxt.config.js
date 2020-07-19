import sitemap from './plugins/sitemap'
import sentry from './plugins/sentry'

const appSettings = {
  hostEnv: process.env.HOST_ENV || 'development',
  baseUrl:
    process.env.BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://meeg.dev')
}

const storyblokSettings = {
  previewToken: process.env.STORYBLOK_PREVIEW_TOKEN,
  useVersion: process.env.STORYBLOK_USE_VERSION || 'published'
}

const gaSettings = {
  id: process.env.GA_ID
}

const sentrySettings = sentry.getSettings(process.env, appSettings)

export default {
  mode: 'universal',
  publicRuntimeConfig: {
    hostEnv: appSettings.hostEnv,
    baseUrl: appSettings.baseUrl,
    storyblokUseVersion: storyblokSettings.useVersion,
    googleAnalytics: {
      id: gaSettings.id
    }
  },
  privateRuntimeConfig: {
    storyblokPreviewToken: storyblokSettings.previewToken
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
        accessToken: storyblokSettings.previewToken,
        cacheProvider: 'memory'
      }
    ],
    '@nuxtjs/sentry',
    'nuxt-webfontloader',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],
  googleAnalytics: {
    debug: {
      sendHitTask: appSettings.hostEnv === 'production'
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
    if (appSettings.hostEnv === 'production') {
      return {
        UserAgent: '*',
        Allow: '/',
        Sitemap: `${appSettings.baseUrl}/sitemap.xml`
      }
    }

    return {
      UserAgent: '*',
      Disallow: '/'
    }
  },
  sitemap: {
    hostname: appSettings.baseUrl,
    defaults: {
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date()
    },
    exclude: ['/about', '/blog'],
    routes: async () => {
      return sitemap.getRoutes()
    }
  },
  sentry: sentrySettings
}
