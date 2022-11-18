/* eslint-disable @typescript-eslint/no-var-requires */
const url = require('postcss-url')
const postCssPresetEnv = require('postcss-preset-env')
const postCssFlexbugsFixes = require('postcss-flexbugs-fixes')
const { fingerprintUrl } = require('./src/features/infra/fingerprint.mjs')

const assetsPath = '/assets/'

const fingerprintAsset = (asset) => {
  const { url } = asset

  if (process.env.NODE_ENV === 'development') {
    return url
  }

  if (!url.startsWith(assetsPath)) {
    return url
  }

  const buildId = process.env.PUBLIC_BUILD_ID

  if (!buildId) {
    return url
  }

  return fingerprintUrl(url, buildId)
}

module.exports = {
  plugins: [
    url({
      url: (asset) => fingerprintAsset(asset)
    }),
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
