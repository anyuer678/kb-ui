export * from './components/Button'
export * from './components/Icon'
export * from './components/Tag'
export * from './components/Space'
export * from './components/Divider'
export * from './components/Grid'
export * from './components/Input'
export * from './components/Checkbox'
export * from './components/Radio'
export * from './components/Switch'
export * from './components/Select'
export * from './components/Tooltip'
export * from './components/Dialog'
export * from './components/Message'
export * from './components/Table'

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
import { Switch } from './components/Switch'
import { Select } from './components/Select'
import { Tooltip } from './components/Tooltip'
import { Dialog } from './components/Dialog'
import { Table } from './components/Table'

const components = [
  Button,
  Icon,
  Tag,
  Space,
  Divider,
  Row,
  Col,
  Input,
  Checkbox,
  Radio,
  Switch,
  Select,
  Tooltip,
  Dialog,
  Table,
]

const install: Plugin = (app: App) => {
  components.forEach((c) => app.component(c.name!, c))
}

export default {
  install,
  version: '0.1.0',
}
