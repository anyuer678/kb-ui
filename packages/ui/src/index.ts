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
export * from './components/Skeleton'
export { Skeleton as KbSkeleton } from './components/Skeleton'
export * from './components/Empty'
export { Empty as KbEmpty } from './components/Empty'
export * from './components/Breadcrumb'
export { Breadcrumb as KbBreadcrumb } from './components/Breadcrumb'
export * from './components/Collapse'
export { Collapse as KbCollapse } from './components/Collapse'
export * from './components/Tabs'
export { Tabs as KbTabs } from './components/Tabs'
export * from './components/Pagination'
export { Pagination as KbPagination } from './components/Pagination'
export * from './components/Dropdown'
export { Dropdown as KbDropdown } from './components/Dropdown'
export * from './components/Drawer'
export { Drawer as KbDrawer } from './components/Drawer'
export * from './components/Popover'
export { Popover as KbPopover } from './components/Popover'
export * from './components/Rate'
export { Rate as KbRate } from './components/Rate'
export * from './components/Slider'
export { Slider as KbSlider } from './components/Slider'
export * from './components/Result'
export { Result as KbResult } from './components/Result'
export * from './components/Statistic'
export { Statistic as KbStatistic } from './components/Statistic'
export * from './components/Steps'
export { Steps as KbSteps } from './components/Steps'
export * from './components/Timeline'
export { Timeline as KbTimeline } from './components/Timeline'
export * from './components/Notification'
export { default as notification } from './components/Notification'
export * from './components/InputNumber'
export { InputNumber as KbInputNumber } from './components/InputNumber'
export * from './components/Textarea'
export { Textarea as KbTextarea } from './components/Textarea'
export * from './components/Search'
export { Search as KbSearch } from './components/Search'
export * from './components/Segmented'
export { Segmented as KbSegmented } from './components/Segmented'
export * from './components/Watermark'
export { Watermark as KbWatermark } from './components/Watermark'
export * from './components/Popconfirm'
export { Popconfirm as KbPopconfirm } from './components/Popconfirm'
export * from './components/Carousel'
export { Carousel as KbCarousel } from './components/Carousel'
export * from './components/Descriptions'
export { Descriptions as KbDescriptions } from './components/Descriptions'
export * from './components/Calendar'
export { Calendar as KbCalendar } from './components/Calendar'
export * from './components/Loading'
export { Loading as KbLoading } from './components/Loading'
export * from './components/Form'
export { Form as KbForm, FormItem as KbFormItem } from './components/Form'
export * from './components/DatePicker'
export { DatePicker as KbDatePicker } from './components/DatePicker'
export * from './components/Upload'
export { Upload as KbUpload } from './components/Upload'
export * from './components/Tree'
export { Tree as KbTree } from './components/Tree'
export * from './components/ColorPicker'
export { ColorPicker as KbColorPicker } from './components/ColorPicker'
export * from './components/InputPassword'
export { InputPassword as KbInputPassword } from './components/InputPassword'
export * from './components/CountUp'
export { CountUp as KbCountUp } from './components/CountUp'
export * from './components/List'
export { List as KbList } from './components/List'
export * from './components/Transfer'
export { Transfer as KbTransfer } from './components/Transfer'
export * from './components/Cascader'
export { Cascader as KbCascader } from './components/Cascader'

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
import { Skeleton } from './components/Skeleton'
import { Empty } from './components/Empty'
import { Breadcrumb } from './components/Breadcrumb'
import { Collapse } from './components/Collapse'
import { Tabs } from './components/Tabs'
import { Pagination } from './components/Pagination'
import { Dropdown } from './components/Dropdown'
import { Drawer } from './components/Drawer'
import { Popover } from './components/Popover'
import { Rate } from './components/Rate'
import { Slider } from './components/Slider'
import { Result } from './components/Result'
import { Statistic } from './components/Statistic'
import { Steps } from './components/Steps'
import { Timeline } from './components/Timeline'
import { InputNumber } from './components/InputNumber'
import { Textarea } from './components/Textarea'
import { Search } from './components/Search'
import { Segmented } from './components/Segmented'
import { Watermark } from './components/Watermark'
import { Popconfirm } from './components/Popconfirm'
import { Carousel } from './components/Carousel'
import { Descriptions } from './components/Descriptions'
import { Calendar } from './components/Calendar'
import { Loading } from './components/Loading'
import { Form, FormItem } from './components/Form'
import { DatePicker } from './components/DatePicker'
import { Upload } from './components/Upload'
import { Tree } from './components/Tree'
import { ColorPicker } from './components/ColorPicker'
import { InputPassword } from './components/InputPassword'
import { CountUp } from './components/CountUp'
import { List } from './components/List'
import { Transfer } from './components/Transfer'
import { Cascader } from './components/Cascader'

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
  Skeleton,
  Empty,
  Breadcrumb,
  Collapse,
  Tabs,
  Pagination,
  Dropdown,
  Drawer,
  Popover,
  Rate,
  Slider,
  Result,
  Statistic,
  Steps,
  Timeline,
  InputNumber,
  Textarea,
  Search,
  Segmented,
  Watermark,
  Popconfirm,
  Carousel,
  Descriptions,
  Calendar,
  Loading,
  Form,
  FormItem,
  DatePicker,
  Upload,
  Tree,
  ColorPicker,
  InputPassword,
  CountUp,
  List,
  Transfer,
  Cascader,
]

const install: Plugin = (app: App) => {
  components.forEach((c) => app.component(c.name!, c))
}

export default {
  install,
  version: __KB_VERSION__,
}
