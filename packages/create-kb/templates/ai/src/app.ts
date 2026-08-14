import express from 'express'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chatRouter } from './routes/chat'
import { checkConfig } from './config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function createApp() {
  const app = express()

  app.use(express.json())

  app.get('/', (_req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'))
  })
  app.use('/chat', chatRouter)

  return app
}

checkConfig()
