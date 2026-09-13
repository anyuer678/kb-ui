import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import KbUi from 'kb-ui-vue'
// 注意：源码模式下 styles/index.css 只有 tokens + dark，组件样式在 all.css。
// （dist 产物的 index.css 是构建时聚合过的全量，两者语义不同，别混用。）
import '@kb/ui/styles/index.css'
import '@kb/ui/styles/all.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(KbUi)
  },
} satisfies Theme
