const environment = {
  development: 'development',
  build: 'build',
  preview: 'preview',
  production: 'production'
}

const getEnvironmentConfig = (name) => {
  return {
    name,
    isDev: name === environment.development,
    isBuild: name === environment.build,
    isPreview: name === environment.preview,
    isProd: name === environment.production
  }
}

const getBuildConfig = (id) => {
  return {
    id,
    hash: id ? id.substring(0, 7) : undefined
  }
}

const getStoryblokConfig = (token, previewToken) => {
  return {
    token,
    previewToken
  }
}

const getSentryConfig = (dsn) => {
  return {
    dsn
  }
}

const getServerEnv = () => {
  const envName =
    process.env.APP_ENV ?? process.env.NODE_ENV ?? environment.development

  const buildId = process.env.PUBLIC_BUILD_ID

  return {
    environment: getEnvironmentConfig(envName),
    baseUrl: process.env.APP_URL ?? process.env.RENDER_EXTERNAL_URL,
    build: getBuildConfig(buildId),
    storyblok: getStoryblokConfig(
      process.env.STORYBLOK_TOKEN,
      process.env.STORYBLOK_PREVIEW_TOKEN
    ),
    sentry: getSentryConfig(process.env.SENTRY_DSN),
    host: process.env.HOST,
    port: process.env.PORT
  }
}

const getAppEnv = () => {
  const envName = import.meta.env.MODE ?? environment.development

  const buildId = import.meta.env.PUBLIC_BUILD_ID

  return {
    environment: getEnvironmentConfig(envName),
    baseUrl: import.meta.env.SITE,
    build: getBuildConfig(buildId),
    storyblok: getStoryblokConfig(
      import.meta.env.STORYBLOK_TOKEN,
      import.meta.env.STORYBLOK_PREVIEW_TOKEN
    ),
    sentry: getSentryConfig(import.meta.env.SENTRY_DSN)
  }
}

export { environment, getAppEnv, getServerEnv }
