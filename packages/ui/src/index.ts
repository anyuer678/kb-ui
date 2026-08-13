export * from './components/Button'
export * from './components/Icon'
export * from './components/Tag'
export * from './components/Space'
export * from './components/Divider'
export * from './components/Grid'
export * from './components/Input'
export * from './components/Checkbox'
export * from './components/Radio'

import type { App, Plugin } from 'vue'
import { Button } from './components/Button'
import { Icon } from './components/Icon'
import { Tag } from './components/Tag'
import { Space } from './components/Space'
import { Divider } from './components/Divider'
import { Row, Col } from './components/Grid'
import { Input } from './components/Input'
import { Checkbox } from './components/Checkbox'
import { Radio } from './components/Radio'

const components = [Button, Icon, Tag, Space, Divider, Row, Col, Input, Checkbox, Radio]

const install: Plugin = (app: App) => {
  components.forEach((c) => app.component(c.name!, c))
}

export default {
  install,
  version: '0.1.0',
}
