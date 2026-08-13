# 快速上手

## 安装

```bash
pnpm add @kb/ui
# 或
npm install @kb/ui
```

## 引入方式

### 全量引入（推荐，适合中小项目）

```ts
import { createApp } from 'vue'
import KbUi from '@kb/ui'
import '@kb/ui/styles/index.css'

createApp(App).use(KbUi).mount('#app')
```

### 按需引入（适合注重体积的项目）

```ts
import { KbButton } from '@kb/ui'
import '@kb/ui/styles/Button.css'
```

样式文件与组件一一对应（`@kb/ui/styles/<Name>.css`），也可配合
[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 做自动按需导入。

## 第一个示例

```vue
<template>
  <KbButton type="primary" @click="message.success('你好，KB UI')">
    点击我
  </KbButton>
</template>

<script setup lang="ts">
import { message } from '@kb/ui'
</script>
```

## 暗色模式

在根节点设置 `data-theme="dark"` 即可切换暗色主题：

```html
<html data-theme="dark">
```
