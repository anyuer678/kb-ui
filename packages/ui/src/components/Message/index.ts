import type { App } from 'vue'
import { createApp } from 'vue'
import MessageComponent from './Message.vue'

export { default as Message } from './Message.vue'
export type { MessageProps } from './Message.vue'

type MessageType = 'success' | 'error' | 'info' | 'warning'

interface MessageOptions {
  type?: MessageType
  content: string
  duration?: number
}

let container: HTMLDivElement | null = null

function mountMessage(options: MessageOptions) {
  // 创建（或复用）挂载容器；容器脱离 DOM 时重建
  if (!container || !container.isConnected) {
    container = document.createElement('div')
    document.body.appendChild(container)
  }
  const holder = document.createElement('div')
  container.appendChild(holder)

  const app: App = createApp(MessageComponent, {
    type: options.type ?? 'info',
    content: options.content,
  })
  app.mount(holder)

  const unmount = () => {
    app.unmount()
    holder.remove()
  }

  const duration = options.duration ?? 3000
  if (duration > 0) {
    setTimeout(unmount, duration)
  }
  return unmount
}

function createMessage(type: MessageType) {
  return (content: string, duration?: number) =>
    mountMessage({ type, content, duration })
}

const message = {
  success: createMessage('success'),
  error: createMessage('error'),
  info: createMessage('info'),
  warning: createMessage('warning'),
  // 通用入口
  show: (content: string, options?: Partial<MessageOptions>) =>
    mountMessage({ content, ...options }),
}

export default message
