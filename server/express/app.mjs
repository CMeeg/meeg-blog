import express from 'express'
import helmet from 'helmet'
import * as Sentry from '@sentry/node'
import rewrite from 'express-urlrewrite'
import { handler as ssrHandler } from '../../dist/server/entry.mjs'
import { forceLowercasePaths } from './middleware/force-lowercase-paths.mjs'
import { setCacheHeaders } from './middleware/cache-control.mjs'
import { getServerEnv } from '../../src/features/infra/env.mjs'

const { sentry, environment } = getServerEnv()

const createExpressApp = () => {
  const app = express()

  if (sentry.dsn) {
    // https://docs.sentry.io/platforms/node/guides/express/
    // Init Sentry
    Sentry.init({
      dsn: sentry.dsn,
      sampleRate: 0.5
    })

    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler())
  }

  // Set security headers middleware
  // helmet https://helmetjs.github.io/
  // https://owasp.org/www-project-secure-headers/#div-bestpractices

  app.use(helmet.hidePoweredBy())
  app.use(helmet.noSniff()) // X-Content-Type-Options
  app.use(helmet.frameguard()) // X-Frame-Options
  app.use(helmet.permittedCrossDomainPolicies()) // X-Permitted-Cross-Domain-Policies
  app.use(helmet.crossOriginOpenerPolicy())
  app.use(helmet.crossOriginResourcePolicy())

  app.use(
    helmet.referrerPolicy({
      policy: 'strict-origin-when-cross-origin'
    })
  )

  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      directives: {
        'default-src': [`'self'`, '*.storyblok.com'],
        'script-src': [
          `'self'`,
          `'unsafe-inline'`,
          '*.storyblok.com',
          'plausible.io',
          '*.plausible.io'
        ],
        'connect-src': ['plausible.io', '*.plausible.io'],
        'style-src': [`'self'`, `'unsafe-inline'`],
        'img-src': [`'self'`, 'data:', '*.storyblok.com'],
        'object-src': [`'none'`],
        'frame-ancestors': [`'none'`],
        'upgrade-insecure-requests': []
      }
    })
  )

  if (environment.isProd) {
    // Only set HSTS in prod
    app.use(helmet.hsts())
  }

  // Middleware

  app.use(forceLowercasePaths)
  app.use(setCacheHeaders)

  // Redirects

  app.get('/tags', (req, res) => {
    res.redirect(301, '/blog')
  })

  // Rewrites

  app.use(rewrite(/^\/(.*)\.v[a-z0-9]+\.(.*)/, '/$1.$2'))

  // Astro

  app.use(express.static('dist/client/'))
  app.use(ssrHandler)

  if (sentry.dsn) {
    // The error handler must be before any other error middleware and after all controllers
    app.use(
      Sentry.Handlers.errorHandler({
        shouldHandleError(error) {
          // Capture all 404 and 5xx errors
          if (error.status === 404 || error.status >= 500) {
            return true
          }
          return false
        }
      })
    )
  }

  return app
}

export { createExpressApp }
