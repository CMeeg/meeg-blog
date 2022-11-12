import express from 'express'
import helmet from 'helmet'
import { handler as ssrHandler } from '../../dist/server/entry.mjs'
import { forceLowercasePaths } from './middleware/force-lowercase-paths.mjs'

const isDev = process.env.NODE_ENV === 'development'

const createExpressApp = () => {
  const app = express()

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
        'script-src': [`'self'`, `'unsafe-inline'`, '*.storyblok.com'],
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

  // Middelware

  app.use(forceLowercasePaths)

  // Astro

  app.use(express.static('dist/client/'))
  app.use(ssrHandler)

  return app
}

export { createExpressApp }
