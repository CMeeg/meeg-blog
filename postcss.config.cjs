/* eslint-disable @typescript-eslint/no-var-requires */
const postCssPresetEnv = require('postcss-preset-env')
const postCssFlexbugsFixes = require('postcss-flexbugs-fixes')

module.exports = {
  plugins: [
    postCssPresetEnv({
      stage: 2,
      browsers: 'last 2 versions or > 3%',
      features: {
        'custom-media-queries': {
          importFrom: 'node_modules/open-props/media.min.css'
        }
      }
    }),
    postCssFlexbugsFixes
  ]
}
