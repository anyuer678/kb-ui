import type { App } from 'vue'
import { createApp } from 'vue'
import NotificationComponent from './Notification.vue'

export { default as Notification } from './Notification.vue'
export type { NotificationProps } from './Notification.vue'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationOptions {
  type?: NotificationType
  title: string
  message?: string
  duration?: number
}

let container: HTMLDivElement | null = null

function mountNotification(options: NotificationOptions) {
  if (!container || !container.isConnected) {
    container = document.createElement('div')
    container.className = 'kb-notification-container'
    document.body.appendChild(container)
  }
  const holder = document.createElement('div')
  container.appendChild(holder)

  const app: App = createApp(NotificationComponent, {
    type: options.type ?? 'info',
    title: options.title,
    message: options.message ?? '',
  })
  app.mount(holder)

  let unmounted = false
  const unmount = () => {
    if (unmounted) return
    unmounted = true
    app.unmount()
    holder.remove()
    if (container && container.childElementCount === 0) {
      container.remove()
      container = null
    }
  }

  const duration = options.duration ?? 4500
  if (duration > 0) setTimeout(unmount, duration)
  return unmount
}

function createNotification(type: NotificationType) {
  return (options: Omit<NotificationOptions, 'type'>) =>
    mountNotification({ ...options, type })
}

const notification = {
  success: createNotification('success'),
  error: createNotification('error'),
  info: createNotification('info'),
  warning: createNotification('warning'),
}

export default notification
