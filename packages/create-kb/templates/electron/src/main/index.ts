import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 640,
    title: '{{projectName}}',
    webPreferences: {
      preload: join(import.meta.dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // 开发时可加载远程地址，打包后加载本地文件
  win.loadFile(join(import.meta.dirname, '../renderer/index.html'))
}

/** 主进程示例 IPC：返回平台信息 */
ipcMain.handle('app:info', () => ({
  platform: process.platform,
  version: app.getVersion(),
  cwd: process.cwd(),
}))

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
