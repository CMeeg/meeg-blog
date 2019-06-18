// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'meeg.dev',
  siteUrl: 'https://meeg.dev',
  titleTemplate: '%s - Chris Meagher',
  plugins: [
    {
      use: '~/plugins/gridsome-source-kentico-cloud',
      options: {
        projectId: process.env.KENTICO_CLOUD_PROJECT_ID,
        previewApiKey: process.env.KENTICO_CLOUD_PREVIEW_API_KEY
      }
    }
  ]
}