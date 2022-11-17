import express from 'express'
import helmet from 'helmet'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import rewrite from 'express-urlrewrite'
import { handler as ssrHandler } from '../../dist/server/entry.mjs'
import { forceLowercasePaths } from './middleware/force-lowercase-paths.mjs'
import { setCacheHeaders } from './middleware/cache-control.mjs'

const isDev = process.env.NODE_ENV === 'development'
const sentryDsn = process.env.SENTRY_DSN

const createExpressApp = () => {
  const app = express()

  if (sentryDsn) {
    // https://docs.sentry.io/platforms/node/guides/express/
    // Init Sentry
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({
          app
        })
      ],
      tracesSampleRate: 0.2
    })

    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler())

    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler())
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
        'style-src': [`'self'`, `'unsafe-inline'`],
        'img-src': [`'self'`, 'data:', '*.storyblok.com'],
        'object-src': [`'none'`],
        'frame-ancestors': [`'none'`],
        'upgrade-insecure-requests': []
      }
    })
  )

  if (!isDev) {
    // Don't set HSTS in dev
    app.use(helmet.hsts())
  }

  // Middleware

  app.use(forceLowercasePaths)

  if (!isDev) {
    app.use(setCacheHeaders)
  }

  // Rewrites

  app.use(rewrite(/^\/(.*)\.v[a-z0-9]+\.(.*)/, '/$1.$2'))

  // Astro

  app.use(express.static('dist/client/'))
  app.use(ssrHandler)

  if (sentryDsn) {
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
