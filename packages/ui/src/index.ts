export * from './components/Button'
export * from './components/Icon'
export * from './components/Tag'

import type { App, Plugin } from 'vue'
import { Button } from './components/Button'
import { Icon } from './components/Icon'
import { Tag } from './components/Tag'

const components = [Button, Icon, Tag]

const install: Plugin = (app: App) => {
  components.forEach((c) => app.component(c.name!, c))
}

export default {
  install,
  version: '0.1.0',
}
