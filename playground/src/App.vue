<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LoginModule from './modules/LoginModule.vue'
import DashboardModule from './modules/DashboardModule.vue'
import ListModule from './modules/ListModule.vue'
import FormModule from './modules/FormModule.vue'
import ProfileModule from './modules/ProfileModule.vue'
import NotFoundModule from './modules/NotFoundModule.vue'
import SettingsModule from './modules/SettingsModule.vue'
import RegisterModule from './modules/RegisterModule.vue'
import ChatModule from './modules/ChatModule.vue'
import ProductModule from './modules/ProductModule.vue'
import BlogModule from './modules/BlogModule.vue'
import MessageCenterModule from './modules/MessageCenterModule.vue'
import MusicPlayerModule from './modules/MusicPlayerModule.vue'
import ChartModule from './modules/ChartModule.vue'
import CheckoutModule from './modules/CheckoutModule.vue'
import TeamModule from './modules/TeamModule.vue'
import CommentsModule from './modules/CommentsModule.vue'
import PricingModule from './modules/PricingModule.vue'
import WizardModule from './modules/WizardModule.vue'
import GalleryModule from './modules/GalleryModule.vue'
import CalendarModule from './modules/CalendarModule.vue'
import InboxModule from './modules/InboxModule.vue'
import FileManagerModule from './modules/FileManagerModule.vue'
import DatavModule from './modules/DatavModule.vue'
import ActivityModule from './modules/ActivityModule.vue'
import ProfileEditModule from './modules/ProfileEditModule.vue'
import SearchModule from './modules/SearchModule.vue'
import LandingModule from './modules/LandingModule.vue'
import KanbanModule from './modules/KanbanModule.vue'
import AnalyticsModule from './modules/AnalyticsModule.vue'
import BlogPostModule from './modules/BlogPostModule.vue'
import OrdersModule from './modules/OrdersModule.vue'
import UserListModule from './modules/UserListModule.vue'
import ResumeModule from './modules/ResumeModule.vue'
import PetshopModule from './modules/PetshopModule.vue'
import VideoModule from './modules/VideoModule.vue'
import {
  KbButton,
  KbIcon,
  KbTag,
  KbSpace,
  KbDivider,
  KbRow,
  KbCol,
  KbInput,
  KbCheckbox,
  KbRadio,
  KbSwitch,
  KbSelect,
  KbDatePicker,
  KbCascader,
  KbTransfer,
  KbTooltip,
  KbDialog,
  KbTable,
  KbBadge,
  KbTree,
  KbAvatar,
  KbProgress,
  KbCard,
  KbAlert,
  KbSkeleton,
  KbEmpty,
  KbBreadcrumb,
  KbCollapse,
  KbTabs,
  KbPagination,
  KbRate,
  KbSlider,
  KbSteps,
  KbTimeline,
  KbDrawer,
  KbResult,
  KbAffix,
  KbAnchor,
  KbAutoComplete,
  KbBackTop,
  KbConfigProvider,
  KbContextMenu,
  KbCountUp,
  KbImage,
  KbImagePreview,
  KbSplitter,
  KbStatistic,
  KbTimePicker,
  KbTour,
  KbTreeSelect,
  KbLayout,
  KbHeader,
  KbSider,
  KbContent,
  KbFooter,
  KbFloatButton,
  KbFloatButtonGroup,
  KbMentions,
  KbVirtualList,
  KbQRCode,
  notification,
  message,
} from 'kb-ui-vue'
import type {
  AnchorItem,
  AutoCompleteOption,
  CascaderOption,
  ContextMenuItem,
  TourStep,
} from 'kb-ui-vue'
import { fetchRegionTree, fetchRegions, fetchUsers } from './api'
import type { ApiUser, RegionNode } from './api'

// 表单示例状态
const inputValue = ref('')
const checked = ref(true)
const radioValue = ref('a')
const switchValue = ref(false)
const selectValue = ref('')
const selectOptions = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
]

// 导航组件状态
const breadcrumbItems = [
  { label: '首页', href: '/' },
  { label: '组件', href: '/components' },
  { label: '导航与反馈' },
]
const tabItems = [
  { label: '标签 A', name: 'a' },
  { label: '标签 B', name: 'b' },
  { label: '标签 C', name: 'c' },
]
const activeTab = ref('a')
const collapseItems = [
  { title: '什么是 KB UI？', content: '一套自建的 Vue 3 组件库，使用原生 CSS 变量驱动主题。' },
  { title: '如何按需引入？', content: 'import { KbButton } from "kb-ui-vue"; import "@kb/ui/styles/Button.css"' },
  { title: '支持暗色模式吗？', content: '支持，给 <html> 设置 data-theme="dark" 即可切换。' },
]
const currentPage = ref(1)

// 更多组件状态
const rateValue = ref(4)
const sliderValue = ref(60)
const drawerVisible = ref(false)
const resultVisible = ref(false)
const stepItems = [
  { title: '注册账户', description: '创建你的账号' },
  { title: '完善信息', description: '补充个人资料' },
  { title: '完成', description: '开始使用' },
]
const timelineItems: { content: string; time: string; type?: 'success' | 'warning' }[] = [
  { content: '项目立项', time: '2026-04-07' },
  { content: '发布 v1.0', time: '2026-08-08', type: 'success' },
  { content: '计划 v2.0', time: '2026-09', type: 'warning' },
]

// 主题切换（颜色组 + 风格组）
const colorThemes = [
  { key: '', name: '默认', color: '#3b82f6' },
  { key: 'violet', name: '紫', color: '#7c3aed' },
  { key: 'teal', name: '青', color: '#0d9488' },
  { key: 'rose', name: '粉', color: '#e11d48' },
  { key: 'amber', name: '琥珀', color: '#d97706' },
  { key: 'dark', name: '暗色', color: '#0f172a' },
]
const styleThemes = [
  { key: 'rounded', name: '圆润', color: '#6366f1' },
  { key: 'flat', name: '扁平', color: '#111827' },
  { key: 'gradient', name: '渐变', color: '#8b5cf6' },
  { key: 'glass', name: '玻璃', color: 'rgba(99,102,241,.5)' },
  { key: 'ink', name: '水墨', color: '#374151' },
  { key: 'neon', name: '霓虹', color: '#22d3ee' },
  { key: 'cyber', name: '赛博', color: '#00f0ff' },
  { key: 'terminal', name: '终端', color: '#22c55e' },
  { key: 'business', name: '商务', color: '#1e293b' },
  { key: 'retro', name: '报刊', color: '#8b5a2b' },
  { key: 'cartoon', name: '卡通', color: '#ff6b6b' },
  { key: 'mono', name: '极简', color: '#111111' },
  { key: 'forest', name: '森林', color: '#166534' },
  { key: 'ocean', name: '海洋', color: '#0284c7' },
  { key: 'midnight', name: '午夜', color: '#f59e0b' },
  { key: 'macaron', name: '马卡龙', color: '#a78bfa' },
  { key: 'vaporwave', name: '蒸汽波', color: '#ff2e97' },
  { key: 'cyberpunk', name: '赛博朋克', color: '#f72585' },
  { key: 'gameboy', name: '游戏机', color: '#0f380f' },
  { key: 'wabi', name: '侘寂', color: '#7c6f64' },
  { key: 'sakura', name: '樱花', color: '#f472b6' },
  { key: 'spring', name: '春', color: '#22c55e' },
  { key: 'autumn', name: '秋', color: '#ea580c' },
  { key: 'winter', name: '冬', color: '#38bdf8' },
  { key: 'starry', name: '星空', color: '#818cf8' },
  { key: 'lava', name: '熔岩', color: '#f97316' },
  { key: 'aurora', name: '极光', color: '#34d399' },
  { key: 'coffee', name: '咖啡', color: '#92400e' },
  { key: 'matcha', name: '抹茶', color: '#4d7c0f' },
  { key: 'morandi', name: '莫兰迪', color: '#9c8f7d' },
  { key: 'memphis', name: '孟菲斯', color: '#e63946' },
  { key: 'pop', name: '波普', color: '#ff2d55' },
  { key: 'minimal', name: '极简白', color: '#000000' },
  { key: 'pastel', name: '粉彩', color: '#b8a8e0' },
  { key: 'neonlight', name: '浅霓虹', color: '#00d4ff' },
  { key: 'sunset', name: '日落', color: '#fb7185' },
  { key: 'danqing', name: '丹青', color: '#7a5c3e' },
  { key: 'gold', name: '鎏金', color: '#c9a227' },
  { key: 'gothic', name: '哥特', color: '#8e4a6e' },
  { key: 'mint', name: '薄荷', color: '#0d9488' },
  { key: 'candy', name: '糖果', color: '#ec4899' },
  { key: 'sky', name: '天空', color: '#0284c7' },
]
const currentTheme = ref('')

function applyTheme(key: string) {
  currentTheme.value = key
  document.documentElement.dataset.theme = key
}

// 模块切换
const moduleItems = [
  { label: '登录', key: 'login' },
  { label: '注册', key: 'register' },
  { label: '仪表盘', key: 'dashboard' },
  { label: '数据列表', key: 'list' },
  { label: '表单', key: 'form' },
  { label: '个人主页', key: 'profile' },
  { label: '设置', key: 'settings' },
  { label: '聊天', key: 'chat' },
  { label: '商品', key: 'product' },
  { label: '博客', key: 'blog' },
  { label: '消息中心', key: 'messages' },
  { label: '音乐播放器', key: 'player' },
  { label: '数据图表', key: 'chart' },
  { label: '购物结算', key: 'checkout' },
  { label: '团队成员', key: 'team' },
  { label: '评论区', key: 'comments' },
  { label: '价格页', key: 'pricing' },
  { label: '分步向导', key: 'wizard' },
  { label: '图片画廊', key: 'gallery' },
  { label: '日历日程', key: 'calendar' },
  { label: '邮件收件箱', key: 'inbox' },
  { label: '文件管理', key: 'files' },
  { label: '数据大屏', key: 'datav' },
  { label: '最近动态', key: 'activity' },
  { label: '编辑资料', key: 'profile-edit' },
  { label: '搜索页', key: 'search' },
  { label: '落地页', key: 'landing' },
  { label: '任务看板', key: 'kanban' },
  { label: '数据分析', key: 'analytics' },
  { label: '博客文章', key: 'blog-post' },
  { label: '订单管理', key: 'orders' },
  { label: '用户管理', key: 'users' },
  { label: '个人简历', key: 'resume' },
  { label: '宠物商店', key: 'petshop' },
  { label: '视频列表', key: 'video' },
  { label: '404', key: '404' },
]
const moduleTabs = moduleItems.map((m) => ({ label: m.label, name: m.key }))
const activeModule = ref('login')

// Dialog 状态
const dialogVisible = ref(false)

// Table 数据
const tableData = [
  { name: '张三', age: 18, city: '北京' },
  { name: '李四', age: 20, city: '上海' },
  { name: '王五', age: 22, city: '广州' },
]
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'city', label: '城市' },
]

// DatePicker 状态（单日期 / 范围 / 多选）
const pickerDate = ref('2026-08-15')
const pickerRange = ref<string[]>(['2026-08-10', '2026-08-20'])
const pickerDates = ref<string[]>(['2026-08-03', '2026-08-12'])

// Table 进阶示例状态（排序 / 分页 / 固定列 / 行选择）
const tablePage = ref(1)
const tableSelected = ref<(string | number)[]>([])
const tableBigData = Array.from({ length: 46 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  company: ['星尘科技', '云图数据', '南栀软件', '澜川网络'][i % 4],
  city: ['北京', '上海', '广州', '成都', '杭州'][i % 5],
  email: `user${i + 1}@example.com`,
  role: ['管理员', '编辑', '访客'][i % 3],
  score: (i * 37) % 100,
}))
const tableSortColumns = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'score', label: '评分（可排序）', width: 140, sortable: true },
  { prop: 'city', label: '城市', width: 120 },
]
const tableFixedColumns = [
  { prop: 'id', label: 'ID', width: 80, fixed: 'left' as const },
  { prop: 'name', label: '姓名', width: 120, fixed: 'left' as const },
  { prop: 'company', label: '公司', width: 300 },
  { prop: 'email', label: '邮箱', width: 300 },
  { prop: 'city', label: '城市', width: 180 },
  { prop: 'role', label: '角色', width: 140, fixed: 'right' as const },
]

// Cascader / Transfer 示例状态
const cascaderValue = ref<string[]>(['zj', 'hz'])
const cascaderOptions = [
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
    children: [{ label: '广州', value: 'gz' }],
  },
]
// 异步加载：首次展开请求根级（node === null），之后每次点击按需拉子级
function cascaderLazyLoad(
  node: CascaderOption | null,
  resolve: (children: CascaderOption[]) => void,
) {
  setTimeout(() => {
    if (!node) {
      resolve([
        { label: '浙江', value: 'zj' },
        { label: '江苏', value: 'js' },
      ])
      return
    }
    resolve([
      { label: `${node.label}-子项 1`, value: `${node.value}-1` },
      { label: `${node.label}-子项 2`, value: `${node.value}-2` },
    ])
  }, 400)
}

const transferValue = ref<string[]>(['k1'])
const transferData = Array.from({ length: 24 }, (_, i) => ({
  key: `k${i + 1}`,
  label: `候选项目 ${i + 1}`,
}))

// Tree 示例状态（虚拟滚动 / 拖拽排序）
const treeData = [
  { label: '前端', children: [{ label: 'Vue' }, { label: 'React' }] },
  { label: '后端', children: [{ label: 'Node' }, { label: 'Go' }] },
  { label: '设计', children: [{ label: 'Figma' }] },
]
const treeHugeData = Array.from({ length: 1000 }, (_, i) => ({ label: `节点 ${i + 1}` }))
const treeDragData = ref([
  { label: '前端', children: [{ label: 'Vue' }, { label: 'React' }] },
  { label: '后端', children: [{ label: 'Node' }] },
  { label: '设计' },
])
const treeLastDrop = ref('')
function onTreeDrop(payload: { dragNode: { label: string }; dropNode: { label: string }; position: string }) {
  treeLastDrop.value = `${payload.dragNode.label} → ${payload.dropNode.label}（${payload.position}）`
}

// ===== 真实接口演示（@kb/api，开发态经 Vite 代理到 127.0.0.1:8082）=====
const serverKeyword = ref('')
const serverPage = ref(1)
const serverSortProp = ref('')
const serverSortOrder = ref<'asc' | 'desc' | null>(null)
const serverUsers = ref<ApiUser[]>([])
const serverTotal = ref(0)
const serverLoading = ref(false)
const serverError = ref('')
const SERVER_PAGE_SIZE = 8

const serverColumns = [
  { prop: 'id', label: 'ID', width: 70 },
  { prop: 'name', label: '姓名', width: 110, sortable: 'custom' as const },
  { prop: 'company', label: '公司', width: 140 },
  { prop: 'city', label: '城市', width: 100 },
  { prop: 'role', label: '角色', width: 100 },
  { prop: 'score', label: '评分（可排序）', width: 140, sortable: 'custom' as const },
]

async function loadUsers() {
  serverLoading.value = true
  serverError.value = ''
  try {
    const result = await fetchUsers({
      page: serverPage.value,
      pageSize: SERVER_PAGE_SIZE,
      keyword: serverKeyword.value,
      sortBy: serverSortProp.value || null,
      order: serverSortOrder.value ?? 'asc',
    })
    serverUsers.value = result.list
    serverTotal.value = result.total
  } catch (error) {
    serverError.value = error instanceof Error ? error.message : String(error)
    serverUsers.value = []
    serverTotal.value = 0
  } finally {
    serverLoading.value = false
  }
}

/** Table sortable:'custom' —— 把排序交给服务端，回到第 1 页重新取数 */
function onServerSort(prop: string, order: 'asc' | 'desc' | null) {
  serverSortProp.value = order ? prop : ''
  serverSortOrder.value = order
  serverPage.value = 1
  void loadUsers()
}

function onServerSearch() {
  serverPage.value = 1
  void loadUsers()
}

function onServerPageChange(page: number) {
  serverPage.value = page
  void loadUsers()
}

/** Cascader 远程懒加载：点一次拉一级 */
function remoteCascaderLoad(
  node: CascaderOption | null,
  resolve: (children: CascaderOption[]) => void,
) {
  fetchRegions(node ? String(node.value) : null)
    .then((result) => {
      resolve(
        result.list.map((item) => ({ label: item.label, value: item.value, leaf: item.leaf })),
      )
    })
    .catch(() => resolve([]))
}

/** Tree 远程数据：一次性拉 440 节点完整树，配合虚拟滚动 */
const remoteTreeData = ref<RegionNode[]>([])
const remoteTreeError = ref('')
async function loadRemoteTree() {
  remoteTreeError.value = ''
  try {
    const result = await fetchRegionTree()
    remoteTreeData.value = result.list
  } catch (error) {
    remoteTreeError.value = error instanceof Error ? error.message : String(error)
  }
}

onMounted(() => {
  void loadUsers()
  void loadRemoteTree()
})

// ===== 新增组件演示（v0.3.x 扩展：配置 / 选择器 / 浮层 / 布局）=====
const timePickerValue = ref('09:30')

const treeSelectValue = ref('hz')
const treeSelectOptions = [
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

const autoCompleteValue = ref('')
const autoCompleteOptions: AutoCompleteOption[] = [
  { value: 'vue' },
  { value: 'vite' },
  { value: 'vitest' },
  { value: 'vue-router' },
  { value: 'typescript' },
  { value: 'pnpm' },
  { value: 'element-plus' },
]

const splitterSize = ref([38, 62])

const tourVisible = ref(false)
const tourSteps: TourStep[] = [
  { title: '欢迎使用 KB UI', description: '这是一段引导气泡，用来介绍页面的新功能。' },
  { title: '按需引入', description: '通过 kb-ui-vue/resolver 即可按需加载组件与对应样式。' },
  { title: '主题切换', description: '顶部可切换颜色与风格主题，全部由 CSS 变量驱动。' },
]

const contextMenuItems: ContextMenuItem[] = [
  { key: 'copy', label: '复制', icon: 'check' },
  { key: 'paste', label: '粘贴' },
  { key: 'rename', label: '重命名', divided: true },
  { key: 'remove', label: '删除', icon: 'close', divided: true, disabled: true },
]
const contextMenuLast = ref('')
function onContextMenuSelect(key: string) {
  contextMenuLast.value = contextMenuItems.find((item) => item.key === key)?.label ?? key
}

/** 生成离线的占位图（data URI），保证 demo 不依赖外网 */
function sampleImage(color: string, label: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300">` +
    `<rect width="480" height="300" fill="${color}"/>` +
    `<text x="240" y="164" font-size="44" fill="#ffffff" text-anchor="middle" ` +
    `font-family="sans-serif">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
const galleryImages = [
  sampleImage('#3b82f6', '图片 1'),
  sampleImage('#0d9488', '图片 2'),
  sampleImage('#e11d48', '图片 3'),
]
const imagePreviewVisible = ref(false)
const imagePreviewIndex = ref(0)
function openImagePreview(index: number) {
  imagePreviewIndex.value = index
  imagePreviewVisible.value = true
}

const anchorItems: AnchorItem[] = [
  { title: '图片与选择器', href: '#new-pickers' },
  { title: '布局与浮层', href: '#new-overlay' },
  { title: '国际化配置', href: '#new-config' },
]

const configLocale = ref<'zh-CN' | 'en-US'>('zh-CN')

const statistics = [
  { title: '本月营收', value: 1286543.5, prefix: '¥', precision: 2, groupSeparator: true },
  { title: '订单数', value: 8462, suffix: '单' },
  { title: '转化率', value: 32.7, suffix: '%', precision: 1 },
]

const icons = ['check', 'close', 'info', 'warning', 'success', 'error', 'arrow-left', 'arrow-right', 'search', 'menu', 'loading', 'chevron-down']

// 本轮新增组件（v0.3.x 扩展 Ⅱ）：布局 / 悬浮按钮 / @提及 / 虚拟列表 / 二维码
const mentionValue = ref('')
const mentionOptions = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'carol', label: 'Carol' },
  { value: 'dave', label: 'Dave' },
]
const virtualItems = Array.from({ length: 1000 }, (_, i) => `列表项 ${i + 1}`)
</script>

<template>
  <div class="page">
    <!-- 主题切换器 -->
    <div class="theme-switcher">
      <span class="theme-switcher__label">颜色</span>
      <button
        v-for="theme in colorThemes"
        :key="theme.key"
        class="theme-switcher__item"
        :class="{ 'theme-switcher__item--active': currentTheme === theme.key }"
        type="button"
        :title="theme.name"
        @click="applyTheme(theme.key)"
      >
        <span class="theme-switcher__dot" :style="{ background: theme.color }" />
        <span class="theme-switcher__name">{{ theme.name }}</span>
      </button>
      <span class="theme-switcher__label theme-switcher__label--group">风格</span>
      <button
        v-for="theme in styleThemes"
        :key="theme.key"
        class="theme-switcher__item"
        :class="{ 'theme-switcher__item--active': currentTheme === theme.key }"
        type="button"
        :title="theme.name"
        @click="applyTheme(theme.key)"
      >
        <span class="theme-switcher__dot" :style="{ background: theme.color }" />
        <span class="theme-switcher__name">{{ theme.name }}</span>
      </button>
    </div>

    <h1>KB UI Playground</h1>
    <p class="subtitle">@kb/ui 组件库实时预览（源码直连，热更新）</p>

    <!-- 基础组件 -->
    <section class="block">
      <h2>基础组件</h2>
      <KbDivider />

      <h3>Button</h3>
      <KbSpace wrap>
        <KbButton type="default">默认</KbButton>
        <KbButton type="primary">主要</KbButton>
        <KbButton type="success">成功</KbButton>
        <KbButton type="warning">警告</KbButton>
        <KbButton type="danger">危险</KbButton>
        <KbButton type="info">信息</KbButton>
        <KbButton type="primary" disabled>禁用</KbButton>
        <KbButton type="primary" round>圆角</KbButton>
        <KbButton type="primary" plain>朴素</KbButton>
        <KbButton type="primary" size="small">小</KbButton>
        <KbButton type="primary" size="large">大</KbButton>
      </KbSpace>

      <h3>Icon</h3>
      <KbSpace wrap>
        <KbIcon v-for="name in icons" :key="name" :name="name" :size="22" :color="name === 'error' ? '#dc2626' : undefined" />
      </KbSpace>

      <h3>Tag</h3>
      <KbSpace wrap>
        <KbTag>默认</KbTag>
        <KbTag type="primary">主要</KbTag>
        <KbTag type="success">成功</KbTag>
        <KbTag type="warning">警告</KbTag>
        <KbTag type="danger" closable>可关闭</KbTag>
        <KbTag type="info" round>圆角</KbTag>
      </KbSpace>

      <h3>Space / Grid</h3>
      <KbSpace direction="vertical" :size="12">
        <KbRow :gutter="12">
          <KbCol :span="6"><div class="grid-box">span 6</div></KbCol>
          <KbCol :span="6"><div class="grid-box">span 6</div></KbCol>
          <KbCol :span="6"><div class="grid-box">span 6</div></KbCol>
          <KbCol :span="6"><div class="grid-box">span 6</div></KbCol>
        </KbRow>
      </KbSpace>
    </section>

    <!-- 表单组件 -->
    <section class="block">
      <h2>表单组件</h2>
      <KbDivider />

      <h3>Input</h3>
      <KbSpace vertical>
        <KbInput v-model="inputValue" placeholder="请输入内容" clearable style="width: 240px" />
        <span class="hint">输入值：{{ inputValue || '（空）' }}</span>
      </KbSpace>

      <h3>Checkbox / Radio / Switch</h3>
      <KbSpace wrap>
        <KbCheckbox v-model="checked" label="勾选我" />
        <KbRadio v-model="radioValue" value="a">选项 A</KbRadio>
        <KbRadio v-model="radioValue" value="b">选项 B</KbRadio>
        <KbSwitch v-model="switchValue" />
      </KbSpace>
      <p class="hint">radio={{ radioValue }} · switch={{ switchValue }}</p>

      <h3>Select</h3>
      <KbSpace>
        <KbSelect v-model="selectValue" :options="selectOptions" placeholder="请选择水果" />
        <span class="hint">已选：{{ selectValue || '（未选择）' }}</span>
      </KbSpace>

      <h3>Cascader · 基础 / 异步加载</h3>
      <KbSpace wrap align="center">
        <KbCascader v-model="cascaderValue" :options="cascaderOptions" clearable />
        <KbCascader lazy :options="[]" :lazy-load="cascaderLazyLoad" placeholder="点击按需加载" />
      </KbSpace>
      <p class="hint">已选路径：{{ cascaderValue.join(' / ') || '（未选择）' }}</p>

      <h3>Transfer · 搜索 + 分页</h3>
      <KbTransfer v-model="transferValue" :data="transferData" filterable :page-size="6" />
      <p class="hint">已选 {{ transferValue.length }} 项：{{ transferValue.join('、') || '（无）' }}</p>

      <h3>DatePicker · 单日期 / 范围 / 多选</h3>
      <KbSpace wrap align="center">
        <KbDatePicker v-model="pickerDate" clearable />
        <KbDatePicker v-model="pickerRange" mode="range" clearable />
        <KbDatePicker v-model="pickerDates" mode="multiple" clearable />
      </KbSpace>
      <p class="hint">
        单日期：{{ pickerDate || '（空）' }} · 范围：{{
          pickerRange.length === 2 ? pickerRange.join(' 至 ') : '（未选完整）'
        }} · 多选：{{ pickerDates.length }} 天
      </p>
    </section>

    <!-- 反馈组件 -->
    <section class="block">
      <h2>反馈组件</h2>
      <KbDivider />

      <h3>Tooltip</h3>
      <KbSpace wrap>
        <KbTooltip content="上方提示">
          <KbButton type="primary" plain>上方</KbButton>
        </KbTooltip>
        <KbTooltip content="下方提示" placement="bottom">
          <KbButton type="primary" plain>下方</KbButton>
        </KbTooltip>
        <KbTooltip content="点击触发" trigger="click">
          <KbButton type="primary" plain>点击</KbButton>
        </KbTooltip>
      </KbSpace>

      <h3>Message</h3>
      <KbSpace wrap>
        <KbButton type="success" @click="message.success('操作成功')">成功提示</KbButton>
        <KbButton type="danger" @click="message.error('出错了')">错误提示</KbButton>
        <KbButton type="warning" @click="message.warning('请注意')">警告提示</KbButton>
        <KbButton type="info" @click="message.info('这是一条信息')">信息提示</KbButton>
      </KbSpace>

      <h3>Dialog</h3>
      <KbButton type="primary" @click="dialogVisible = true">打开对话框</KbButton>
      <KbDialog v-model="dialogVisible" title="确认操作" width="420">
        <p>这是一段对话框内容，支持任意插槽内容与 footer 自定义。</p>
        <template #footer>
          <KbButton @click="dialogVisible = false">取消</KbButton>
          <KbButton type="primary" @click="dialogVisible = false; message.success('已确认')">
            确定
          </KbButton>
        </template>
      </KbDialog>
    </section>

    <!-- 数据展示 -->
    <section class="block">
      <h2>数据展示</h2>
      <KbDivider />

      <h3>Table · 基础</h3>
      <KbTable :data="tableData" :columns="tableColumns" stripe border />

      <h3>Table · 排序 + 分页</h3>
      <KbTable
        v-model:current-page="tablePage"
        :data="tableBigData"
        :columns="tableSortColumns"
        :page-size="10"
        stripe
        border
      />
      <p class="hint">当前第 {{ tablePage }} 页</p>

      <h3>Table · 固定列（左右固定，列宽超容器时横向滚动）</h3>
      <KbTable :data="tableBigData.slice(0, 6)" :columns="tableFixedColumns" border />

      <h3>Table · 行选择（表头全选 / 半选）</h3>
      <KbTable
        v-model:selected-keys="tableSelected"
        :data="tableData"
        :columns="tableColumns"
        selection
        row-key="name"
        border
      />
      <p class="hint">已选：{{ tableSelected.join('、') || '（无）' }}</p>

      <h3>Table · 空状态（size=small）</h3>
      <KbTable :data="[]" :columns="tableColumns" size="small" empty-text="暂无数据" border />

      <h3>Tree · 基础（展开 / 折叠 / 选中）</h3>
      <KbTree :data="treeData" default-expand-all />

      <h3>Tree · 虚拟滚动（1000 节点，只渲染可视区）</h3>
      <KbTree :data="treeHugeData" :height="240" />

      <h3>Tree · 拖拽排序（支持 before / after / inner 三种落点）</h3>
      <KbTree :data="treeDragData" draggable @drop="onTreeDrop" />
      <p class="hint">最近落点：{{ treeLastDrop || '（拖动节点试试）' }}</p>
    </section>

    <!-- 真实接口（@kb/api） -->
    <section class="block">
      <h2>真实接口 · @kb/api</h2>
      <KbDivider />
      <p class="hint">
        以下三个示例走真实 HTTP：先跑 <code>pnpm api</code> 起服务（默认 127.0.0.1:8082），
        开发态由 Vite 把 <code>/api</code> 代理过去。
      </p>

      <h3>Table · 服务端分页 + 排序 + 搜索（500 条用户）</h3>
      <KbSpace align="center" wrap>
        <KbInput
          v-model="serverKeyword"
          placeholder="搜索姓名 / 公司 / 城市 / 邮箱"
          clearable
          style="width: 280px"
          @keyup.enter="onServerSearch"
        />
        <KbButton type="primary" :disabled="serverLoading" @click="onServerSearch">
          {{ serverLoading ? '查询中…' : '查询' }}
        </KbButton>
        <span class="hint">共 {{ serverTotal }} 条</span>
      </KbSpace>
      <KbTable
        :data="serverUsers"
        :columns="serverColumns"
        :page-size="SERVER_PAGE_SIZE"
        :total="serverTotal"
        :current-page="serverPage"
        row-key="id"
        stripe
        border
        @sort-change="onServerSort"
        @update:current-page="onServerPageChange"
      />
      <p v-if="serverError" class="hint hint--error">接口未启动？{{ serverError }}</p>
      <p v-else class="hint">当前第 {{ serverPage }} 页，共 {{ serverTotal }} 条</p>

      <h3>Cascader · 远程懒加载（/api/regions）</h3>
      <KbCascader
        lazy
        :options="[]"
        :lazy-load="remoteCascaderLoad"
        placeholder="点击按需加载远程数据"
        clearable
        style="width: 280px"
      />

      <h3>Tree · 远程树数据（/api/regions/tree，440 节点 + 虚拟滚动）</h3>
      <KbTree v-if="remoteTreeData.length" :data="remoteTreeData" :height="240" :item-height="30" />
      <p v-else class="hint">{{ remoteTreeError || '加载中…' }}</p>
    </section>

    <!-- 展示组件 -->
    <section class="block">
      <h2>展示组件</h2>
      <KbDivider />

      <h3>Badge 徽标</h3>
      <KbSpace wrap :size="28">
        <KbBadge :content="5"><KbButton>消息</KbButton></KbBadge>
        <KbBadge :content="120" :max="99"><KbButton>邮件</KbButton></KbBadge>
        <KbBadge dot><KbButton>小红点</KbButton></KbBadge>
        <KbBadge :content="'new'" color="#16a34a" />
      </KbSpace>

      <h3>Avatar 头像</h3>
      <KbSpace wrap>
        <KbAvatar fallback="张" round />
        <KbAvatar fallback="KB" :size="56" round />
        <KbAvatar :size="48" round />
        <KbAvatar fallback="李" :size="32" />
      </KbSpace>

      <h3>Progress 进度条</h3>
      <KbSpace direction="vertical" :size="12" style="width: 100%">
        <KbProgress :percentage="30" />
        <KbProgress :percentage="66" status="warning" />
        <KbProgress :percentage="100" status="success" />
        <KbProgress :percentage="80" :stroke-width="12" :show-text="false" />
      </KbSpace>

      <h3>Card 卡片</h3>
      <KbRow :gutter="12">
        <KbCol :span="8">
          <KbCard title="基础卡片">
            <p>这是卡片内容，支持任意内容。</p>
          </KbCard>
        </KbCol>
        <KbCol :span="8">
          <KbCard title="带操作" shadow="hover">
            <p>悬停有阴影效果。</p>
            <template #footer>
              <KbButton type="primary" size="small">确定</KbButton>
              <KbButton size="small">取消</KbButton>
            </template>
          </KbCard>
        </KbCol>
        <KbCol :span="8">
          <KbCard title="无阴影" shadow="never">
            <p>简洁无阴影。</p>
          </KbCard>
        </KbCol>
      </KbRow>

      <h3>Alert 警告提示</h3>
      <KbSpace direction="vertical" :size="12" style="width: 100%">
        <KbAlert type="info" title="提示" show-icon>这是一条普通提示信息。</KbAlert>
        <KbAlert type="success" title="成功" show-icon closable>操作已成功完成。</KbAlert>
        <KbAlert type="warning" title="注意" show-icon closable>部分功能暂不可用。</KbAlert>
        <KbAlert type="danger" title="错误" show-icon closable>发生了一个错误。</KbAlert>
      </KbSpace>
    </section>

    <!-- 模块模板 -->
    <section class="block">
      <h2>模块模板（{{ moduleItems.length }} 个）</h2>
      <KbDivider />
      <div class="module-tabs">
        <KbTabs v-model="activeModule" :tabs="moduleTabs">
          <LoginModule v-if="activeModule === 'login'" />
          <RegisterModule v-else-if="activeModule === 'register'" />
          <DashboardModule v-else-if="activeModule === 'dashboard'" />
          <ListModule v-else-if="activeModule === 'list'" />
          <FormModule v-else-if="activeModule === 'form'" />
          <ProfileModule v-else-if="activeModule === 'profile'" />
          <SettingsModule v-else-if="activeModule === 'settings'" />
          <ChatModule v-else-if="activeModule === 'chat'" />
          <ProductModule v-else-if="activeModule === 'product'" />
          <BlogModule v-else-if="activeModule === 'blog'" />
          <MessageCenterModule v-else-if="activeModule === 'messages'" />
          <MusicPlayerModule v-else-if="activeModule === 'player'" />
          <ChartModule v-else-if="activeModule === 'chart'" />
          <CheckoutModule v-else-if="activeModule === 'checkout'" />
          <TeamModule v-else-if="activeModule === 'team'" />
          <CommentsModule v-else-if="activeModule === 'comments'" />
          <PricingModule v-else-if="activeModule === 'pricing'" />
          <WizardModule v-else-if="activeModule === 'wizard'" />
          <GalleryModule v-else-if="activeModule === 'gallery'" />
          <CalendarModule v-else-if="activeModule === 'calendar'" />
          <InboxModule v-else-if="activeModule === 'inbox'" />
          <FileManagerModule v-else-if="activeModule === 'files'" />
          <DatavModule v-else-if="activeModule === 'datav'" />
          <ActivityModule v-else-if="activeModule === 'activity'" />
          <ProfileEditModule v-else-if="activeModule === 'profile-edit'" />
          <SearchModule v-else-if="activeModule === 'search'" />
          <LandingModule v-else-if="activeModule === 'landing'" />
          <KanbanModule v-else-if="activeModule === 'kanban'" />
          <AnalyticsModule v-else-if="activeModule === 'analytics'" />
          <BlogPostModule v-else-if="activeModule === 'blog-post'" />
          <OrdersModule v-else-if="activeModule === 'orders'" />
          <UserListModule v-else-if="activeModule === 'users'" />
          <ResumeModule v-else-if="activeModule === 'resume'" />
          <PetshopModule v-else-if="activeModule === 'petshop'" />
          <VideoModule v-else-if="activeModule === 'video'" />
          <NotFoundModule v-else-if="activeModule === '404'" />
        </KbTabs>
      </div>
    </section>

    <!-- 导航与反馈组件 -->
    <section class="block">
      <h2>导航与反馈</h2>
      <KbDivider />

      <h3>Breadcrumb 面包屑</h3>
      <KbBreadcrumb :items="breadcrumbItems" />

      <h3>Tabs 标签页</h3>
      <KbTabs v-model="activeTab" :tabs="tabItems">
        <div v-if="activeTab === 'a'" class="hint">这是标签 A 的内容。</div>
        <div v-else-if="activeTab === 'b'" class="hint">这是标签 B 的内容。</div>
        <div v-else class="hint">这是标签 C 的内容。</div>
      </KbTabs>

      <h3>Collapse 折叠面板</h3>
      <KbCollapse :items="collapseItems" />

      <h3>Pagination 分页</h3>
      <KbPagination v-model:current-page="currentPage" :total="256" :page-size="10" />
      <p class="hint">当前页：{{ currentPage }}</p>

      <h3>Skeleton 骨架屏</h3>
      <KbSkeleton :rows="3" />

      <h3>Empty 空状态</h3>
      <KbEmpty description="暂无数据">
        <template #action>
          <KbButton type="primary" size="small">去创建</KbButton>
        </template>
      </KbEmpty>
    </section>

    <!-- 更多组件 -->
    <section class="block">
      <h2>更多组件</h2>
      <KbDivider />

      <h3>Rate 评分 / Slider 滑块</h3>
      <KbSpace vertical :size="16">
        <KbSpace wrap align="center">
          <KbRate v-model="rateValue" />
          <span class="hint">{{ rateValue }} 星</span>
        </KbSpace>
        <div style="width: 260px">
          <KbSlider v-model="sliderValue" />
          <span class="hint">音量：{{ sliderValue }}</span>
        </div>
      </KbSpace>

      <h3>Steps 步骤条</h3>
      <KbSteps :steps="stepItems" :active="1" />

      <h3>Timeline 时间线</h3>
      <KbTimeline :items="timelineItems" />

      <h3>Drawer 抽屉</h3>
      <KbSpace wrap>
        <KbButton @click="drawerVisible = true">打开抽屉</KbButton>
        <KbButton @click="notification.success({ title: '新通知', message: '这是一条通知消息' })">
          弹出通知
        </KbButton>
        <KbButton @click="resultVisible = !resultVisible">切换 Result</KbButton>
      </KbSpace>
      <KbDrawer v-model="drawerVisible" title="抽屉" width="360">
        <p>这是一个抽屉，支持任意内容。</p>
        <template #footer>
          <KbButton @click="drawerVisible = false">关闭</KbButton>
        </template>
      </KbDrawer>
      <div v-if="resultVisible" style="margin-top: 16px">
        <KbResult status="success" title="操作成功" description="所有步骤已顺利完成">
          <template #action>
            <KbButton type="primary">返回首页</KbButton>
          </template>
        </KbResult>
      </div>
    </section>

    <!-- 新增组件（v0.3.x 扩展） -->
    <section id="section-new" class="block">
      <h2>新增组件（v0.3.x 扩展）</h2>
      <KbDivider />
      <p class="hint">
        本轮新增 12 个组件：图片与预览、时间/树选择、自动补全、分栏、引导、右键菜单、固钉、锚点、回到顶部、统计数值、全局配置。
      </p>

      <h3 id="new-pickers">Image 图片 · ImagePreview 预览</h3>
      <KbSpace wrap :size="16" align="center">
        <KbImage
          v-for="(src, i) in galleryImages"
          :key="src"
          :src="src"
          :alt="`示例图 ${i + 1}`"
          :width="180"
          :height="112"
          fit="cover"
        />
        <KbButton @click="openImagePreview(0)">打开预览器</KbButton>
      </KbSpace>
      <p class="hint">点击图片即可预览，或点右侧按钮从第 1 张开始浏览（可左右切换）。</p>
      <KbImagePreview
        v-model:visible="imagePreviewVisible"
        v-model:index="imagePreviewIndex"
        :images="galleryImages"
      />

      <h3>TimePicker 时间选择</h3>
      <KbSpace wrap align="center">
        <KbTimePicker v-model="timePickerValue" clearable />
        <KbTimePicker format="HH:mm:ss" :minute-step="5" placeholder="步长 5 分钟" />
        <span class="hint">已选：{{ timePickerValue || '（空）' }}</span>
      </KbSpace>

      <h3>TreeSelect 树选择 / AutoComplete 自动补全</h3>
      <KbSpace wrap align="center">
        <KbTreeSelect
          v-model="treeSelectValue"
          :options="treeSelectOptions"
          placeholder="请选择城市"
          clearable
          default-expand-all
          style="width: 220px"
        />
        <KbAutoComplete
          v-model="autoCompleteValue"
          :options="autoCompleteOptions"
          placeholder="输入 vue / vite 试试"
          clearable
          style="width: 220px"
        />
      </KbSpace>
      <p class="hint">城市：{{ treeSelectValue || '（空）' }} · 补全输入：{{ autoCompleteValue || '（空）' }}</p>

      <h3 id="new-overlay">Splitter 分栏（拖拽 / 键盘调整）</h3>
      <KbSplitter
        v-model="splitterSize"
        style="height: 150px; border: 1px solid var(--kb-color-border); border-radius: var(--kb-radius-md)"
      >
        <template #panel-0>
          <div style="display: flex; align-items: center; justify-content: center; height: 100%">
            左栏 {{ splitterSize[0] }}%
          </div>
        </template>
        <template #panel-1>
          <div style="display: flex; align-items: center; justify-content: center; height: 100%">
            右栏 {{ splitterSize[1] }}%
          </div>
        </template>
      </KbSplitter>

      <h3>ContextMenu 右键菜单 / Tour 引导 / BackTop 回到顶部</h3>
      <KbSpace wrap align="center">
        <KbContextMenu :items="contextMenuItems" @select="onContextMenuSelect">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 220px;
              height: 88px;
              border: 1px dashed var(--kb-color-border);
              border-radius: var(--kb-radius-md);
              color: var(--kb-color-text-3);
              font-size: var(--kb-font-size-sm);
              cursor: context-menu;
            "
          >
            在此区域点击右键
          </div>
        </KbContextMenu>
        <KbButton type="primary" @click="tourVisible = true">开始引导</KbButton>
      </KbSpace>
      <p class="hint">最近选择：{{ contextMenuLast || '（未选择）' }}</p>
      <KbTour v-model="tourVisible" :steps="tourSteps" />
      <!-- 页面较长，滚过 400px 后右下角会出现回顶按钮 -->
      <KbBackTop :visibility-height="400" />

      <h3>Anchor 锚点 / Affix 固钉</h3>
      <KbAnchor :items="anchorItems" />
      <div
        id="scroll-demo"
        style="
          height: 200px;
          overflow: auto;
          border: 1px solid var(--kb-color-border);
          border-radius: var(--kb-radius-md);
        "
      >
        <KbAffix target="#scroll-demo" :offset-top="0">
          <div
            style="
              padding: 8px 12px;
              background: var(--kb-color-bg-elevated);
              border-bottom: 1px solid var(--kb-color-border);
              color: var(--kb-color-text-2);
              font-size: var(--kb-font-size-sm);
            "
          >
            Affix：滚动时固定在本容器顶部
          </div>
        </KbAffix>
        <div style="padding: 12px">
          <p v-for="n in 16" :key="n" class="hint">第 {{ n }} 行 · 滚动这个容器可以看到固钉效果。</p>
        </div>
      </div>

      <h3 id="new-config">Statistic 统计数值 / CountUp 数字滚动</h3>
      <KbRow :gutter="12">
        <KbCol v-for="item in statistics" :key="item.title" :span="8">
          <KbStatistic
            :title="item.title"
            :value="item.value"
            :prefix="item.prefix"
            :suffix="item.suffix"
            :precision="item.precision"
            :group-separator="item.groupSeparator"
          />
        </KbCol>
      </KbRow>
      <p class="hint">
        数字滚动：<KbCountUp :end="8866" prefix="¥" :duration="1200" /> ·
        <KbCountUp :end="99.5" suffix="%" :decimals="1" />
      </p>

      <h3>ConfigProvider 全局配置（语言 / 尺寸）</h3>
      <KbSpace wrap align="center">
        <KbRadio v-model="configLocale" value="zh-CN">中文</KbRadio>
        <KbRadio v-model="configLocale" value="en-US">English</KbRadio>
      </KbSpace>
      <KbConfigProvider :locale="configLocale" size="small">
        <KbSpace direction="vertical" :size="12" style="width: 100%">
          <KbEmpty />
          <KbPagination :current-page="1" :total="64" :page-size="10" />
        </KbSpace>
      </KbConfigProvider>
      <p class="hint">切换语言后，组件内置文案（如空状态描述）会跟随变化。</p>
    </section>

    <!-- 本轮新增组件（v0.3.x 扩展 Ⅱ） -->
    <section id="section-new2" class="block">
      <h2>本轮新增组件</h2>
      <KbDivider />
      <p class="hint">
        本轮新增 5 个组件：Layout 布局、FloatButton 悬浮按钮、Mentions @提及、VirtualList 虚拟列表、QRCode 二维码。
      </p>

      <h3>Layout 布局（Header / Sider / Content / Footer）</h3>
      <KbLayout style="height: 220px; border: 1px solid var(--kb-color-border); border-radius: var(--kb-radius-md)">
        <KbHeader style="background: var(--kb-color-bg-elevated); padding: 0 12px; display: flex; align-items: center">Header</KbHeader>
        <KbLayout>
          <KbSider width="120" style="background: color-mix(in srgb, var(--kb-color-primary) 10%, transparent); padding: 12px">Sider</KbSider>
          <KbContent style="padding: 12px">Content 区域，可放置任意内容。</KbContent>
        </KbLayout>
        <KbFooter style="background: var(--kb-color-bg-elevated); padding: 0 12px; display: flex; align-items: center">Footer</KbFooter>
      </KbLayout>

      <h3>FloatButton 悬浮按钮 / FloatButtonGroup</h3>
      <KbFloatButtonGroup shape="circle" direction="column" style="margin: 8px 0">
        <KbFloatButton type="primary" round>＋</KbFloatButton>
        <KbFloatButton round>？</KbFloatButton>
      </KbFloatButtonGroup>
      <p class="hint">（悬浮按钮组以内联方式演示，实际使用时可固定到视口角落）</p>

      <h3>Mentions @提及</h3>
      <KbMentions
        v-model="mentionValue"
        :options="mentionOptions"
        placeholder="输入 @ 试试"
        style="max-width: 360px"
      />
      <p class="hint">当前值：{{ mentionValue || '（空）' }}</p>

      <h3>VirtualList 虚拟列表（1000 项，仅渲染可视区）</h3>
      <KbVirtualList
        :items="virtualItems"
        :item-height="36"
        :height="220"
        style="border: 1px solid var(--kb-color-border); border-radius: var(--kb-radius-md)"
      >
        <template #item="{ item, index }">
          <div style="padding: 0 12px; line-height: 36px; border-bottom: 1px solid var(--kb-color-border)">
            #{{ index + 1 }} {{ item }}
          </div>
        </template>
      </KbVirtualList>

      <h3>QRCode 二维码</h3>
      <KbQRCode value="https://kb-ui.dev" :size="160" />
      <p class="hint">用手机扫描即可打开链接（默认纠错等级 M，UTF-8 字节编码）。</p>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 128px 24px 80px;
  font-family: var(--kb-font-family);
}

.theme-switcher {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 4px;
  padding: var(--kb-space-2) var(--kb-space-4);
  border-bottom: 1px solid var(--kb-color-border);
  background: color-mix(in srgb, var(--kb-color-bg) 90%, transparent);
  backdrop-filter: blur(8px);
}

.theme-switcher__label {
  margin-right: var(--kb-space-1);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.theme-switcher__label--group {
  margin-left: var(--kb-space-3);
}

.theme-switcher__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid transparent;
  border-radius: var(--kb-radius-round);
  background: transparent;
  cursor: pointer;
  transition: background var(--kb-transition-duration) var(--kb-transition-timing);
}

.theme-switcher__item:hover {
  background: var(--kb-color-bg-elevated);
}

.theme-switcher__item--active {
  border-color: var(--kb-color-border);
  background: var(--kb-color-bg-elevated);
}

.theme-switcher__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--kb-color-bg);
  box-shadow: 0 0 0 1px var(--kb-color-border);
}

.theme-switcher__name {
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-xs);
}

.subtitle {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.block {
  margin-top: 24px;
}

.block h2 {
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-xl);
}

.block h3 {
  margin: 20px 0 10px;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-lg);
  font-weight: 600;
}

.hint {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.hint--error {
  color: var(--kb-color-danger, #dc2626);
}

.hint code {
  padding: 1px 5px;
  border-radius: var(--kb-radius-sm);
  background: color-mix(in srgb, var(--kb-color-primary) 12%, transparent);
  font-family: var(--kb-font-family-mono, monospace);
}

.grid-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: var(--kb-radius-sm);
  background: color-mix(in srgb, var(--kb-color-primary) 12%, transparent);
  color: var(--kb-color-primary);
  font-size: var(--kb-font-size-sm);
}
</style>
