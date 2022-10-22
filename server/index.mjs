import express from 'express'
import { handler as ssrHandler } from '../dist/server/entry.mjs'

const app = express()
app.use(express.static('dist/client/'))
app.use(ssrHandler)

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3001

app.listen(port, host)

console.log(`server listening at ${host}:${port}`)
