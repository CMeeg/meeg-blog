/* eslint-disable @typescript-eslint/no-var-requires */
const postCssPresetEnv = require('postcss-preset-env')
const postCssFlexbugsFixes = require('postcss-flexbugs-fixes')
const postcssCustomMedia = require('postcss-custom-media')
const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    postCssPresetEnv({ minimumVendorImplementations: 2 }),
    postCssFlexbugsFixes,
    postcssCustomMedia,
    autoprefixer
  ]
}
