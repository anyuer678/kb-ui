export * from './components/Button'
export * from './components/Icon'
export * from './components/Tag'
export * from './components/Space'
export * from './components/Divider'

import type { App, Plugin } from 'vue'
import { Button } from './components/Button'
import { Icon } from './components/Icon'
import { Tag } from './components/Tag'
import { Space } from './components/Space'
import { Divider } from './components/Divider'

const components = [Button, Icon, Tag, Space, Divider]

const install: Plugin = (app: App) => {
  components.forEach((c) => app.component(c.name!, c))
}

export default {
  install,
  version: '0.1.0',
}
