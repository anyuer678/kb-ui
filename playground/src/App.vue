<script setup lang="ts">
import { ref } from 'vue'
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
  KbTooltip,
  KbDialog,
  KbTable,
  KbBadge,
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
  notification,
  message,
} from '@kb/ui'

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
  { title: '如何按需引入？', content: 'import { KbButton } from "@kb/ui"; import "@kb/ui/styles/Button.css"' },
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

const icons = ['check', 'close', 'info', 'warning', 'success', 'error', 'arrow-left', 'arrow-right', 'search', 'menu', 'loading', 'chevron-down']
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

      <h3>Table</h3>
      <KbTable :data="tableData" :columns="tableColumns" stripe border />
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
