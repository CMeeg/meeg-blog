export default {
  getSettings: (env, appSettings) => {
    const dsn = env.SENTRY_DSN
    const commit = env.VERCEL_GITHUB_COMMIT_SHA
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
