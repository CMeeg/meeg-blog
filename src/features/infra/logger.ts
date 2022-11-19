import type { Logger } from 'pino'
import pino from 'pino'
import { createWriteStream } from 'pino-sentry'
import { getAppEnv } from '~/features/infra/env.mjs'

const name = 'meeg-blog'

const createPinoSentry = (dsn: string) => {
  const opts = {
    name
  }

  const stream = createWriteStream({ dsn })

  return pino(opts, stream)
}

const createLogger = () => {
  const { environment, sentry } = getAppEnv()

  if (environment.isDev) {
    return pino({
      name,
      transport: {
        target: 'pino-pretty'
      }
    })
  } else if (sentry.dsn) {
    return createPinoSentry(sentry.dsn)
  }

  return pino({ name })
}

let theLogger: Logger

const logger = (): Logger => {
  if (!theLogger) {
    theLogger = createLogger()
  }

  return theLogger
}

export { logger }
