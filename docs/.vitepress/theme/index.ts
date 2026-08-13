import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import KbUi from '@kb/ui'
import '@kb/ui/styles/index.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(KbUi)
  },
} satisfies Theme
