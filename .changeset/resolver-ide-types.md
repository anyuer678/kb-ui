---
'kb-ui-vue': minor
---

新增按需引入解析器与 Volar 全局组件类型。

**按需引入**

- 新增 `kb-ui-vue/resolver` 导出 `KbResolver`，配合 `unplugin-vue-components` 使用：

  ```ts
  import Components from 'unplugin-vue-components/vite'
  import { KbResolver } from 'kb-ui-vue/resolver'

  Components({ resolvers: [KbResolver()] })
  ```

- 解析 `<KbButton>` 这类标签时自动注入 `import { KbButton } from 'kb-ui-vue'`
  以及对应的样式副作用 `kb-ui-vue/styles/<entry>.css`
- 支持自定义前缀（`prefix`）与关闭样式注入（`importStyle: false`）
- 处理了复用同一份样式的别名组件：`KbRow` / `KbCol` 归到 `Grid`，`KbFormItem` 归到 `Form`；
  `KbConfigProvider` 无独立样式，不注入 CSS

**IDE 类型支持**

- 新增 `kb-ui-vue/global` 类型入口，构建时由 `scripts/build-global-types.mjs` 生成
  `dist/global.d.ts`，为 `vue` 模块增补 `GlobalComponents` 声明
- 在 `tsconfig.json` 的 `types` 中引入后，模板里使用 `<KbXxx>` 即可获得组件名提示与 props 类型，无需手动 import

详见文档 [按需引入](/guide/on-demand)。
