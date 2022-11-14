import type { Logger } from 'pino'
import pino from 'pino'
import { createWriteStream } from 'pino-sentry'

const name = 'meeg-blog'

const createPinoSentry = (dsn: string) => {
  const opts = {
    name
  }

  const stream = createWriteStream({ dsn })

  return pino(opts, stream)
}

const createLogger = () => {
  if (import.meta.env.DEV) {
    return pino({
      name,
      transport: {
        target: 'pino-pretty'
      }
    })
  } else if (import.meta.env.SENTRY_DSN) {
    return createPinoSentry(import.meta.env.SENTRY_DSN)
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
