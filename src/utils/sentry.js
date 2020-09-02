export default {
  getSettings: (appSettings) => {
    const dsn = process.env.SENTRY_DSN
    const commit = process.env.VERCEL_GITHUB_COMMIT_SHA
    const release = commit // TODO: Use SemVer
    const repo = 'CMeeg/meeg-blog' // TODO: Can get from Vercel env vars?
    const isDevelopment = appSettings.hostEnv === 'development'

    const settings = {
      dsn,
      publishRelease: !isDevelopment,
      config: {
        environment: appSettings.hostEnv,
        release
      }
    }

    if (!isDevelopment) {
      settings.webpackConfig = {
        release,
        setCommits: {
          repo,
          commit
        }
      }
    }

    return settings
  }
}
