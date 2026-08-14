import { createApp } from './app'
import { config } from './config'

createApp().listen(config.port, () => {
  console.log(`AI 工作台已启动: http://localhost:${config.port}`)
})
