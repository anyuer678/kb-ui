# ConfigProvider 全局配置

为整棵子树提供统一的语言、尺寸、层级与主题配置。它本身不渲染任何 DOM，只透传默认插槽，因此不会影响使用方的布局上下文。

## 基础用法

```vue
<template>
  <KbConfigProvider locale="zh-CN" size="medium" theme="light">
    <App />
  </KbConfigProvider>
</template>

<script setup lang="ts">
import { KbConfigProvider } from 'kb-ui-vue'
</script>
```

## 切换语言

`locale` 既可以传内置语言包名，也可以传自定义语言包对象。

```vue
<template>
  <KbConfigProvider :locale="locale">
    <KbEmpty />
    <KbSearch />
  </KbConfigProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { KbConfigProvider, KbEmpty, KbSearch } from 'kb-ui-vue'

const locale = ref('zh-CN')
</script>
```

<KbConfigProvider locale="zh-CN">
  <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
    <KbEmpty />
    <KbSearch />
  </div>
</KbConfigProvider>

切换成英文后：

<KbConfigProvider locale="en-US">
  <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
    <KbEmpty />
    <KbSearch />
  </div>
</KbConfigProvider>

## 暗色主题

`theme="dark"` 会把 `data-theme="dark"` 同步到 `<html>` 上，配合内置的 `dark.css` 生效。切回 `light` 时移除该属性。

```vue
<KbConfigProvider theme="dark">
  <App />
</KbConfigProvider>
```

## 全局尺寸

`size` 会作为子组件的默认尺寸，组件自身的 `size` prop 仍可覆盖它。

```vue
<KbConfigProvider size="small">
  <KbSearch />
</KbConfigProvider>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `locale` | ``ProjectLocale \| LocaleName`` | `'zh-CN'` | 语言包对象或内置语言包名 |
| `size` | ``'small' \| 'medium' \| 'large'`` | `'medium'` | 子组件默认尺寸 |
| `zIndex` | ``number`` | `2000` | 弹层基础层级 |
| `theme` | ``'light' \| 'dark'`` | `'light'` | 主题模式，会同步到 `<html data-theme>` |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 需要共享配置的内容 |

## 相关导出

除组件外，组件库还导出了若干与全局配置相关的 API，便于在自定义组件中复用：

| 导出 | 类型 | 说明 |
|---|---|---|
| `useLocale` | `() => { t, locale }` | 取当前语言的取值函数与语言包 |
| `useGlobalConfig` | `() => GlobalConfig` | 取完整全局配置 |
| `useSize` | `() => ComponentSize` | 取当前默认尺寸 |
| `useZIndex` | `() => number` | 取弹层基础层级 |
| `locales` | `Record<string, ProjectLocale>` | 全部内置语言包 |
| `getLocale` | `(name?: string) => ProjectLocale` | 按名称取语言包，未知名回退 |
| `zhCN` / `enUS` | `ProjectLocale` | 中英文语言包对象 |

更完整的国际化说明见 [国际化](/guide/i18n)。
