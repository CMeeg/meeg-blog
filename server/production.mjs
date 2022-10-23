import { createExpressApp } from './express.mjs'

// Create Express app

const app = createExpressApp()

// Create server

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT

if (!port) {
  throw Error('> Could not start server: no `PORT` env var found.')
}

const server = app.listen(port, host)

console.log(`> Server listening at ${host}:${port}`)

// Handle graceful shutdown

process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server')

  server.close(() => {
    console.debug('HTTP server closed')
  })
})
