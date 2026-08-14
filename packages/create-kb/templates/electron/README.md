# {{projectName}}

Electron 桌面应用模板（TypeScript + contextIsolation 安全模型）。

## 快速开始

```bash
pnpm install
pnpm dev          # 开发模式启动 Electron
```

## 构建

```bash
pnpm build        # 打包 Windows 安装包（NSIS + 便携版）→ release/
pnpm pack         # 仅生成未打包目录（调试用）
```

## 结构

```
src/
├── main/         # 主进程（窗口生命周期、IPC）
├── preload/      # 白名单 API 桥（contextBridge）
└── renderer/     # 渲染进程页面
```

## 安全模型

- `contextIsolation: true` + `nodeIntegration: false`
- 渲染进程通过 `window.desktop`（preload 暴露的白名单 API）与主进程通信
- 新增能力：在 `src/main` 注册 `ipcMain.handle`，并在 `src/preload` 对应暴露
