import { contextBridge, ipcRenderer } from 'electron'

/** 白名单 API 桥：渲染进程只能通过这里访问主进程能力 */
const api = {
  getAppInfo: () => ipcRenderer.invoke('app:info'),
}

contextBridge.exposeInMainWorld('desktop', api)

export type DesktopApi = typeof api
