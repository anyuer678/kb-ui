# {{projectName}}

基于 [KB UI](https://github.com/)（@kb/ui）的 Vue 3 + Vite + TypeScript 项目模板。

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
import KbUi from 'kb-ui-vue'
import '@kb/ui/styles/index.css'

createApp(App).use(KbUi).mount('#app')
```

暗色主题：给 `<html>` 设置 `data-theme="dark"` 即可。
