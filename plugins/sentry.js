export default {
  getSettings: (env, appSettings) => {
    const dsn = env.SENTRY_DSN
    const commit = env.VERCEL_GITHUB_COMMIT_SHA
    const release = commit // TODO: Use SemVer
    const repo = 'CMeeg/meeg-blog' // TODO: Can get from Vercel env vars?
    const isDev = appSettings.hostEnv === 'development'

    const settings = {
      dsn: dsn,
      publishRelease: !isDev,
      config: {
        environment: appSettings.hostEnv,
        release: release
      }
    }

    if (!isDev) {
      settings.webpackConfig = {
        release: release,
        setCommits: {
          repo: repo,
          commit: commit
        }
      }
    }

    return settings
  }
}
