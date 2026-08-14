// 渲染进程脚本（通过 preload 暴露的 window.desktop 访问主进程）
declare global {
  interface Window {
    desktop: {
      getAppInfo(): Promise<{ platform: string; version: string; cwd: string }>
    }
  }
}

window.desktop?.getAppInfo().then((info) => {
  document.getElementById('info')!.textContent = `平台：${info.platform} · 版本：${info.version}`
})

export {}
