import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'KB UI',
  description: '一套自建的 Vue 3 组件库',
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
          ],
        },
      ],
    },
  },
})
