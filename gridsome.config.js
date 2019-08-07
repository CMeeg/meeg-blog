// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const appConfig = require('./src/app.config');
const ArticleContentItem = require('./plugins/gridsome-source-kentico-cloud/content-items/ArticleContentItem');
const ArticleSeriesContentItem = require('./plugins/gridsome-source-kentico-cloud/content-items/ArticleSeriesContentItem');

module.exports = {
  siteName: appConfig.siteName,
  siteUrl: appConfig.siteUrl,
  titleTemplate: appConfig.titleTemplate,
  plugins: [
    {
      use: '~/plugins/gridsome-source-kentico-cloud',
      options: {
        deliveryClientConfig: {
          projectId: process.env.KENTICO_CLOUD_PROJECT_ID,
          previewApiKey: process.env.KENTICO_CLOUD_PREVIEW_API_KEY,
          enablePreviewMode: JSON.parse(process.env.KENTICO_CLOUD_ENABLE_PREVIEW_MODE),
          enableAdvancedLogging: JSON.parse(process.env.KENTICO_CLOUD_ENABLED_ADVANCED_LOGGING),
          defaultLanguage: 'en-GB'
        },
        contentItemConfig: {
          contentItems: {
            article: ArticleContentItem,
            article_series: ArticleSeriesContentItem
          },
          routes: {
            article: '/articles/:slug',
            article_series: '/series/:slug',
            author: '/about'
          }
        },
        taxonomyConfig: {
          routes: {
            tag: '/tags/:slug'
          }
        },
        loggerConfig: {
          enable: process.env.KENTICO_CLOUD_LOGGER_ENABLE
        }
      }
    }
  ]
}
