export * from './components/Button'
export * from './components/Icon'

import type { App, Plugin } from 'vue'
import { Button } from './components/Button'
import { Icon } from './components/Icon'

const components = [Button, Icon]

const install: Plugin = (app: App) => {
  components.forEach((c) => app.component(c.name!, c))
}

export default {
  install,
  version: '0.1.0',
}
