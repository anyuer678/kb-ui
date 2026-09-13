/*
 * 视觉回归取样台（specimen harness）
 *
 * 为什么需要它：playground 是「一个长页面 + 侧边 tab」的可交互演示站，没有路由，
 * 无法按组件定位截图，也不适合当视觉基线（内容会随演示数据漂移）。
 * 这里给每个组件准备一份确定性（deterministic）样本：无随机、无网络、无计时器，
 * 固定 800×520 画布，用 ?c=<组件>&theme=<主题> 定位，一页一图。
 *
 * 用法：pnpm test:visual（配置见 ../playwright.config.ts）
 */
import { createApp, defineComponent, h, onMounted, ref, type VNode } from 'vue'
import '../../src/styles/index.css'
import '../../src/styles/all.css'
import {
  KbAlert,
  KbAvatar,
  KbBadge,
  KbButton,
  KbCard,
  KbCheckbox,
  KbDialog,
  KbImage,
  KbInput,
  KbPagination,
  KbProgress,
  KbRadio,
  KbSelect,
  KbSpace,
  KbSplitter,
  KbSteps,
  KbSwitch,
  KbTable,
  KbTabs,
  KbTag,
  KbTreeSelect,
} from '../../src/index'
import './harness.css'

/** 固定的内联占位图，避免视觉用例依赖网络资源 */
const SAMPLE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100">' +
    '<rect width="160" height="100" fill="#3b82f6"/>' +
    '<circle cx="80" cy="50" r="26" fill="#ffffff" opacity="0.85"/>' +
    '</svg>',
)}`

const FRUITS = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
]

const REGION_TREE = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb' },
    ],
  },
  {
    label: '广东',
    value: 'gd',
    children: [
      { label: '广州', value: 'gz' },
      { label: '深圳', value: 'sz' },
    ],
  },
]

const TABLE_COLUMNS = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'city', label: '城市', width: 140 },
]

const TABLE_DATA = [
  { name: '张三', age: 18, city: '北京' },
  { name: '李四', age: 20, city: '上海' },
  { name: '王五', age: 22, city: '广州' },
]

const TEXT = { 'font-size': '13px', color: 'var(--kb-color-text-2)' }

/** fixture 名 → 渲染函数。名字同时是 URL 的 ?c= 取值与快照文件名。 */
const FIXTURES: Record<string, () => VNode> = {
  Button: () =>
    h(KbSpace, { wrap: true, size: 10 }, () => [
      h(KbButton, null, () => '默认'),
      h(KbButton, { type: 'primary' }, () => '主要'),
      h(KbButton, { type: 'success' }, () => '成功'),
      h(KbButton, { type: 'warning' }, () => '警告'),
      h(KbButton, { type: 'danger' }, () => '危险'),
      h(KbButton, { type: 'info' }, () => '信息'),
      h(KbButton, { type: 'primary', plain: true }, () => '朴素'),
      h(KbButton, { type: 'primary', round: true }, () => '圆角'),
      h(KbButton, { type: 'primary', disabled: true }, () => '禁用'),
      h(KbButton, { type: 'primary', size: 'small' }, () => '小'),
      h(KbButton, { type: 'primary', size: 'large' }, () => '大'),
    ]),

  Input: () =>
    h(KbSpace, { direction: 'vertical', size: 12 }, () => [
      h(KbInput, { modelValue: '普通输入框', style: 'width:280px' }),
      h(KbInput, { modelValue: '', placeholder: '请输入内容', style: 'width:280px' }),
      h(KbInput, { modelValue: '可清空文本', clearable: true, style: 'width:280px' }),
      h(KbInput, { modelValue: '禁用状态', disabled: true, style: 'width:280px' }),
      h(KbInput, { modelValue: '小尺寸', size: 'small', style: 'width:280px' }),
      h(KbInput, { modelValue: '大尺寸', size: 'large', style: 'width:280px' }),
    ]),

  Select: () =>
    h(KbSpace, { direction: 'vertical', size: 12 }, () => [
      h(KbSelect, {
        modelValue: 'apple',
        options: FRUITS,
        style: 'width:240px',
      }),
      h(KbSelect, {
        modelValue: '',
        options: FRUITS,
        placeholder: '请选择水果',
        style: 'width:240px',
      }),
    ]),

  Switch: () =>
    h(KbSpace, { size: 20, align: 'center' }, () => [
      h(KbSwitch, { modelValue: true }),
      h(KbSwitch, { modelValue: false }),
      h(KbSwitch, { modelValue: true, disabled: true }),
      h('span', { style: TEXT }, '开关'),
    ]),

  Checkbox: () =>
    h(KbSpace, { direction: 'vertical', size: 16 }, () => [
      h(KbSpace, { size: 20, align: 'center' }, () => [
        h(KbCheckbox, { modelValue: true, label: '已勾选' }),
        h(KbCheckbox, { modelValue: false, label: '未勾选' }),
        h(KbCheckbox, { modelValue: false, label: '禁用', disabled: true }),
      ]),
      h(KbSpace, { size: 20, align: 'center' }, () => [
        h(KbRadio, { modelValue: 'a', value: 'a' }, () => '选项 A'),
        h(KbRadio, { modelValue: 'a', value: 'b' }, () => '选项 B'),
        h(KbRadio, { modelValue: 'a', value: 'c', disabled: true }, () => '禁用'),
      ]),
    ]),

  Tag: () =>
    h(KbSpace, { wrap: true, size: 10 }, () => [
      h(KbTag, null, () => '默认'),
      h(KbTag, { type: 'primary' }, () => '主要'),
      h(KbTag, { type: 'success' }, () => '成功'),
      h(KbTag, { type: 'warning' }, () => '警告'),
      h(KbTag, { type: 'danger', closable: true }, () => '可关闭'),
      h(KbTag, { type: 'info', round: true }, () => '圆角'),
    ]),

  Badge: () =>
    h(KbSpace, { wrap: true, size: 26, align: 'center' }, () => [
      h(KbBadge, { content: 5 }, () => h(KbButton, null, () => '消息')),
      h(KbBadge, { content: 120, max: 99 }, () => h(KbButton, null, () => '邮件')),
      h(KbBadge, { dot: true }, () => h(KbButton, null, () => '小红点')),
      h(KbBadge, { content: 'new', color: '#16a34a' }),
      h(KbAvatar, { fallback: '张', round: true }),
      h(KbAvatar, { fallback: 'KB', size: 56, round: true }),
      h(KbAvatar, { fallback: '李', size: 32 }),
    ]),

  Alert: () =>
    h(KbSpace, { direction: 'vertical', size: 12, style: 'width:100%' }, () => [
      h(KbAlert, { type: 'info', title: '提示', showIcon: true }, () => '这是一条普通提示信息。'),
      h(KbAlert, { type: 'success', title: '成功', showIcon: true }, () => '操作已成功完成。'),
      h(KbAlert, { type: 'warning', title: '注意', showIcon: true }, () => '部分功能暂不可用。'),
      h(KbAlert, { type: 'danger', title: '错误', showIcon: true }, () => '发生了一个错误。'),
    ]),

  Card: () =>
    h(KbSpace, { size: 12, align: 'stretch', style: 'width:100%' }, () => [
      h(KbCard, { title: '基础卡片', style: 'width:230px' }, () => [
        h('p', { style: TEXT }, '这是卡片内容。'),
      ]),
      h(KbCard, { title: '悬浮阴影', shadow: 'hover', style: 'width:230px' }, () => [
        h('p', { style: TEXT }, '悬停有阴影效果。'),
      ]),
      h(KbCard, { title: '无阴影', shadow: 'never', style: 'width:230px' }, () => [
        h('p', { style: TEXT }, '简洁无阴影。'),
      ]),
    ]),

  Table: () =>
    h(KbTable, {
      data: TABLE_DATA,
      columns: TABLE_COLUMNS,
      stripe: true,
      border: true,
      style: 'width:100%',
    }),

  Tabs: () =>
    h(
      KbTabs,
      {
        modelValue: 'a',
        tabs: [
          { label: '标签 A', name: 'a' },
          { label: '标签 B', name: 'b' },
          { label: '标签 C', name: 'c' },
        ],
        style: 'width:100%',
      },
      () => h('div', { class: 'specimen-note', style: 'padding:16px 0' }, '这是标签 A 的内容。'),
    ),

  Progress: () =>
    h(KbSpace, { direction: 'vertical', size: 18, style: 'width:100%' }, () => [
      h(KbProgress, { percentage: 30 }),
      h(KbProgress, { percentage: 66, status: 'warning' }),
      h(KbProgress, { percentage: 100, status: 'success' }),
      h(KbProgress, { percentage: 80, strokeWidth: 12, showText: false }),
    ]),

  Steps: () =>
    h(KbSteps, {
      steps: [
        { title: '注册账户', description: '创建你的账号' },
        { title: '完善信息', description: '补充个人资料' },
        { title: '完成', description: '开始使用' },
      ],
      active: 1,
      style: 'width:100%',
    }),

  Pagination: () =>
    h(KbSpace, { direction: 'vertical', size: 16 }, () => [
      h(KbPagination, { currentPage: 3, total: 256, pageSize: 10 }),
      h(KbPagination, { currentPage: 1, total: 48, pageSize: 10 }),
    ]),

  Image: () =>
    h(KbSpace, { size: 16, align: 'center' }, () => [
      h(KbImage, { src: SAMPLE_IMAGE, alt: '示例图', width: 160, height: 100 }),
      h(KbImage, { src: SAMPLE_IMAGE, alt: '填充模式', width: 120, height: 100, fit: 'cover' }),
    ]),

  Dialog: () =>
    h(
      KbDialog,
      { modelValue: true, title: '确认操作', width: 380 },
      () => h('p', { style: TEXT }, '这是一段对话框内容，用于视觉回归取样。'),
    ),

  Splitter: () =>
    h(
      KbSplitter,
      { modelValue: [40, 60], style: 'width:100%;height:200px' },
      {
        'panel-0': () => h('div', { class: 'specimen-pane' }, '左侧面板'),
        'panel-1': () => h('div', { class: 'specimen-pane' }, '右侧面板'),
      },
    ),

  TreeSelect: () =>
    h(KbTreeSelect, {
      modelValue: 'hz',
      options: REGION_TREE,
      placeholder: '请选择城市',
      style: 'width:240px',
    }),
}

const params = new URLSearchParams(window.location.search)
const fixtureKey = params.get('c') ?? 'Button'
const theme = params.get('theme') ?? 'default'

// 主题写进 <html data-theme>，与运行时 applyTheme 的行为保持一致；
// 'default' 表示不设置该属性（走 tokens.css 的基础变量）。
document.documentElement.dataset.theme = theme === 'default' ? '' : theme

const renderFixture = FIXTURES[fixtureKey]
if (!renderFixture) {
  throw new Error(
    `[visual] 未知的 fixture "${fixtureKey}"，可用：${Object.keys(FIXTURES).join(', ')}`,
  )
}

const Stage = defineComponent({
  name: 'VisualStage',
  setup() {
    const ready = ref(false)
    onMounted(() => {
      // 等两帧，确保列表 / 浮层完成首帧布局后再截图
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          ready.value = true
        }),
      )
    })
    return () =>
      h(
        'div',
        {
          class: 'visual-stage',
          'data-fixture': fixtureKey,
          'data-theme-name': theme,
          'data-ready': ready.value ? '1' : '0',
        },
        [renderFixture()],
      )
  },
})

createApp(Stage).mount('#app')
