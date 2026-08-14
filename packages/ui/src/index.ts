// 具名导出（短名 + Kb 前缀别名，符合设计 §4.1/§4.3）
export * from './components/Button'
export { Button as KbButton } from './components/Button'
export * from './components/Icon'
export { Icon as KbIcon } from './components/Icon'
export * from './components/Tag'
export { Tag as KbTag } from './components/Tag'
export * from './components/Space'
export { Space as KbSpace } from './components/Space'
export * from './components/Divider'
export { Divider as KbDivider } from './components/Divider'
export * from './components/Grid'
export { Row as KbRow, Col as KbCol } from './components/Grid'
export * from './components/Input'
export { Input as KbInput } from './components/Input'
export * from './components/Checkbox'
export { Checkbox as KbCheckbox } from './components/Checkbox'
export * from './components/Radio'
export { Radio as KbRadio } from './components/Radio'
export * from './components/Switch'
export { Switch as KbSwitch } from './components/Switch'
export * from './components/Select'
export { Select as KbSelect } from './components/Select'
export * from './components/Tooltip'
export { Tooltip as KbTooltip } from './components/Tooltip'
export * from './components/Dialog'
export { Dialog as KbDialog } from './components/Dialog'
export * from './components/Message'
export { default as message } from './components/Message'
export * from './components/Table'
export { Table as KbTable } from './components/Table'
export * from './components/Badge'
export { Badge as KbBadge } from './components/Badge'
export * from './components/Avatar'
export { Avatar as KbAvatar } from './components/Avatar'
export * from './components/Progress'
export { Progress as KbProgress } from './components/Progress'
export * from './components/Card'
export { Card as KbCard } from './components/Card'
export * from './components/Alert'
export { Alert as KbAlert } from './components/Alert'

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
import { Badge } from './components/Badge'
import { Avatar } from './components/Avatar'
import { Progress } from './components/Progress'
import { Card } from './components/Card'
import { Alert } from './components/Alert'

// 由 vite.config.ts 的 define 注入（与 package.json version 保持同步）
declare const __KB_VERSION__: string

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
  Badge,
  Avatar,
  Progress,
  Card,
  Alert,
]

const install: Plugin = (app: App) => {
  components.forEach((c) => app.component(c.name!, c))
}

export default {
  install,
  version: __KB_VERSION__,
}
