// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const tailwind = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = function (api) {
  api.loadSource(({ addContentType }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api
  })

  api.configureWebpack(config => {
    // For v-runtime-template to work, you must use the with-compiler Vue.js version
    // See https://github.com/alexjoverm/v-runtime-template

    config.resolve.alias['vue'] = 'vue/dist/vue.common';
  })

  api.chainWebpack(config => {
    config.module
      .rule('css')
      .oneOf('normal')
      .use('postcss-loader')
      .tap(options => {
        options.plugins.push(tailwind('./tailwind.config.js'));

        options.plugins.push(postcssPresetEnv({
          stage: 0
        }));

        if (process.env.NODE_ENV === 'production') {
          options.plugins.push(purgecss({
            content: [
              './src/**/*.vue'
            ],
            whitelist: [
              'g-image',
              'g-image--lazy',
              'g-image--loaded',
              'active',
              'active--exact'
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
          }));
        }

        return options;
      })
  })
}
