# {{projectName}}

基于 [KB UI](https://github.com/)（@kb/ui）的 Vue 3 + Vite + TypeScript 完整示例模板。

包含：表单联动（Input/Checkbox/Radio/Select）、数据表格（Table + 自定义单元格）、
消息提示（message）、对话框（Dialog）、暗色主题切换。

## 命令

```bash
pnpm install   # 安装依赖
pnpm dev       # 启动开发服务器
pnpm build     # 生产构建
pnpm preview   # 预览构建产物
```

## 组件库

全量引入 @kb/ui（`src/main.ts`）：

```ts
import KbUi from '@kb/ui'
import '@kb/ui/styles/index.css'

createApp(App).use(KbUi).mount('#app')
```

暗色主题：给 `<html>` 设置 `data-theme="dark"` 即可。
