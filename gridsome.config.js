// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const appConfig = require('./src/app.config');
const ArticleContentItem = require('./plugins/gridsome-source-kentico-kontent/content-items/ArticleContentItem');
const ArticleSeriesContentItem = require('./plugins/gridsome-source-kentico-kontent/content-items/ArticleSeriesContentItem');
const CodeSnippet = require('./plugins/gridsome-source-kentico-kontent/content-items/CodeSnippet');
const tailwind = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');

const postcssPlugins = [
  tailwind()
];

if (process.env.NODE_ENV === 'production') {
  postcssPlugins.push(purgecss());
}

module.exports = {
  siteName: appConfig.siteName,
  siteUrl: appConfig.siteUrl,
  titleTemplate: appConfig.titleTemplate,
  runtimeCompiler: true,
  templates: {
    Article: '/articles/:slug',
    ArticleSeries: '/series/:slug',
    Author: '/about/',
    TaxonomyTag: '/tags/:slug'
  },
  plugins: [
    {
      use: '@meeg/gridsome-source-kentico-kontent',
      options: {
        deliveryClientConfig: {
          projectId: process.env.KENTICO_KONTENT_PROJECT_ID,
          previewApiKey: process.env.KENTICO_KONTENT_PREVIEW_API_KEY,
          isDeveloperMode: JSON.parse(process.env.KENTICO_KONTENT_DEVELOPER_MODE),
          defaultLanguage: 'en-GB',
          globalQueryConfig: {
            usePreviewMode: JSON.parse(process.env.KENTICO_KONTENT_ENABLE_PREVIEW_MODE)
          }
        },
        contentItemConfig: {
          contentItems: {
            article: ArticleContentItem,
            article_series: ArticleSeriesContentItem,
            code_snippet: CodeSnippet
          }
        }
      }
    }
  ],
  css: {
    loaderOptions: {
      postcss: {
        plugins: postcssPlugins
      }
    }
  }
}
