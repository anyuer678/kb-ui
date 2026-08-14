import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'KB UI',
  description: '一套自建的 Vue 3 组件库',
  // GitHub Pages 部署到 /kb-ui/ 子路径时通过 BASE_URL 覆盖
  base: process.env.BASE_URL ?? '/',
  vite: { server: { port: 8071 } },
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/quickstart' },
      { text: '组件', link: '/components/button' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速上手', link: '/guide/quickstart' },
            { text: '主题定制', link: '/guide/theme' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Space 间距', link: '/components/space' },
            { text: 'Divider 分割线', link: '/components/divider' },
            { text: 'Grid 栅格', link: '/components/grid' },
          ],
        },
        {
          text: '表单组件',
          items: [
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Checkbox 复选框', link: '/components/checkbox' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Select 选择器', link: '/components/select' },
          ],
        },
        {
          text: '反馈组件',
          items: [
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Dialog 对话框', link: '/components/dialog' },
            { text: 'Message 消息提示', link: '/components/message' },
          ],
        },
        {
          text: '数据展示',
          items: [
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Badge 徽标', link: '/components/badge' },
            { text: 'Avatar 头像', link: '/components/avatar' },
            { text: 'Progress 进度条', link: '/components/progress' },
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Alert 警告提示', link: '/components/alert' },
            { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
            { text: 'Empty 空状态', link: '/components/empty' },
            { text: 'Statistic 统计数值', link: '/components/statistic' },
            { text: 'Descriptions 描述列表', link: '/components/descriptions' },
            { text: 'Calendar 日历', link: '/components/calendar' },
            { text: 'Timeline 时间线', link: '/components/timeline' },
            { text: 'Carousel 轮播图', link: '/components/carousel' },
          ],
        },
        {
          text: '导航组件',
          items: [
            { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Pagination 分页', link: '/components/pagination' },
            { text: 'Steps 步骤条', link: '/components/steps' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
            { text: 'Segmented 分段控制器', link: '/components/segmented' },
          ],
        },
        {
          text: '表单扩展',
          items: [
            { text: 'Form 表单', link: '/components/form' },
            { text: 'DatePicker 日期选择', link: '/components/date-picker' },
            { text: 'InputNumber 数字输入', link: '/components/input-number' },
            { text: 'Textarea 文本域', link: '/components/textarea' },
            { text: 'Search 搜索框', link: '/components/search' },
            { text: 'Upload 文件上传', link: '/components/upload' },
            { text: 'Tree 树形控件', link: '/components/tree' },
            { text: 'ColorPicker 颜色选择', link: '/components/color-picker' },
            { text: 'Transfer 穿梭框', link: '/components/transfer' },
            { text: 'Cascader 级联选择', link: '/components/cascader' },
            { text: 'Rate 评分', link: '/components/rate' },
            { text: 'Slider 滑块', link: '/components/slider' },
            { text: 'InputPassword 密码输入', link: '/components/input-password' },
          ],
        },
        {
          text: '反馈与功能',
          items: [
            { text: 'Collapse 折叠面板', link: '/components/collapse' },
            { text: 'Drawer 抽屉', link: '/components/drawer' },
            { text: 'Popover 气泡卡片', link: '/components/popover' },
            { text: 'Popconfirm 气泡确认', link: '/components/popconfirm' },
            { text: 'Notification 通知', link: '/components/notification' },
            { text: 'Result 结果页', link: '/components/result' },
            { text: 'Watermark 水印', link: '/components/watermark' },
            { text: 'Loading 加载中', link: '/components/loading' },
            { text: 'CountUp 数字滚动', link: '/components/count-up' },
            { text: 'List 列表', link: '/components/list' },
          ],
        },
      ],
    },
  },
})
