import { createExpressApp } from './express/app.mjs'
import { createServer } from 'https'
import { readFileSync } from 'fs'

// Create Express app

const app = createExpressApp()

// Create server

const options = {
  key: readFileSync('./localhost-key.pem', 'utf8'),
  cert: readFileSync('./localhost.pem', 'utf8')
}

app.listen(8000)

const server = createServer(options, app)

const port = process.env.PORT ?? 3001

server.listen(port)

console.log(`> Server listening at https://localhost:${port}`)

// Handle graceful shutdown

process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server')

  server.close(() => {
    console.debug('HTTP server closed')
  })
})
