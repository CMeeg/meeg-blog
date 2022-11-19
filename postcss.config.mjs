import url from 'postcss-url'
import postCssPresetEnv from 'postcss-preset-env'
import postCssFlexbugsFixes from 'postcss-flexbugs-fixes'
import { fingerprintUrl } from './src/features/infra/fingerprint.mjs'
import { getServerEnv } from './src/features/infra/env.mjs'

const { environment, build } = getServerEnv()

const assetsPath = '/assets/'

const fingerprintAsset = (asset) => {
  const { url } = asset

  if (environment.isDev) {
    return url
  }

  if (!url.startsWith(assetsPath)) {
    return url
  }

  if (!build.hash) {
    return url
  }

  return fingerprintUrl(url, build.hash)
}

export default {
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
