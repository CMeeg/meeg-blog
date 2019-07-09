// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

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

    config.resolve.alias["vue"] = "vue/dist/vue.common";
  })
}
