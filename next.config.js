const compress = process.env.NEXT_COMPRESS ? !!process.env.NEXT_COMPRESS : true
const assetPrefix = process.env.NEXT_PUBLIC_CDN_URL || ''
const buildId = process.env.NEXT_PUBLIC_BUILD_ID || null

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  compress,
  assetPrefix,
  generateBuildId: async () => buildId,
  i18n: {
    locales: ['en-GB'],
    defaultLocale: 'en-GB'
  }
}
