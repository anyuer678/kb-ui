# 按需引入

组件库提供 `unplugin-vue-components` 的 resolver，模板里直接写 `<KbButton />` 即可自动引入组件与对应样式，无需手写 import。

## 安装插件

```bash
pnpm add -D unplugin-vue-components
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { KbResolver } from 'kb-ui-vue/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [KbResolver()],
    }),
  ],
})
```

之后在任意 `.vue` 文件里直接使用：

```vue
<template>
  <KbButton type="primary">提交</KbButton>
  <KbTable :columns="columns" :data="rows" />
</template>
```

插件会自动补上：

```ts
import { KbButton, KbTable } from 'kb-ui-vue'
import 'kb-ui-vue/styles/Button.css'
import 'kb-ui-vue/styles/Table.css'
```

## 选项

```ts
KbResolver({
  // 组件名前缀，默认 'Kb'；只有以该前缀开头的标签会被解析
  prefix: 'Kb',

  // 是否自动引入样式，默认 true；设为 false 时需自行引入全量样式
  importStyle: true,
})
```

关闭自动样式后，记得在入口引一次全量样式：

```ts
import 'kb-ui-vue/styles/index.css'
```

## 类型提示

自动引入的组件默认没有类型信息，把全局组件声明加进 `tsconfig.json` 即可获得模板内的补全与类型校验：

```json
{
  "compilerOptions": {
    "types": ["kb-ui-vue/global"]
  }
}
```

该声明由构建脚本从组件清单自动生成（`dist/global.d.ts`），覆盖全部 `Kb*` 组件。

## 不用插件时的手动按需引入

```ts
import { KbButton } from 'kb-ui-vue'
import 'kb-ui-vue/styles/Button.css'
```

样式路径规则为 `kb-ui-vue/styles/<组件名>.css`。少数组件的样式入口与组件名不同：

| 组件 | 样式路径 |
|---|---|
| `KbRow` / `KbCol` | `kb-ui-vue/styles/Grid.css` |
| `KbFormItem` | `kb-ui-vue/styles/Form.css` |
| `KbConfigProvider` | 无独立样式 |

## 与全量引入的取舍

| 方式 | 包体 | 适用场景 |
|---|---|---|
| 全量引入 | 引入全部组件代码与样式 | 后台系统、组件使用面广 |
| 按需引入 | 只打包用到的组件 | 对产物体积敏感的场景 |

全量引入的写法见 [快速上手](/guide/quickstart)。
