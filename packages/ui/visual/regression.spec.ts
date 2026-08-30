import { test, expect } from '@playwright/test'

// 10 个核心组件 × 3 个主题 = 30 张基线截图
const THEMES = ['default', 'cyber', 'terminal']
const COMPONENTS = [
  { name: 'Button', path: '/button' },
  { name: 'Dialog', path: '/dialog' },
  { name: 'Select', path: '/select' },
  { name: 'Table', path: '/table' },
  { name: 'Form', path: '/form' },
  { name: 'Tabs', path: '/tabs' },
  { name: 'Message', path: '/message' },
  { name: 'DatePicker', path: '/datepicker' },
  { name: 'Switch', path: '/switch' },
  { name: 'Input', path: '/input' },
]

for (const theme of THEMES) {
  for (const comp of COMPONENTS) {
    test(`visual: ${comp.name} [${theme}]`, async ({ page }) => {
      // 设置主题
      await page.goto(comp.path)
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t)
      }, theme)

      // 等待渲染稳定
      await page.waitForTimeout(500)

      // 截图对比
      await expect(page).toHaveScreenshot(`${comp.name.toLowerCase()}-${theme}.png`, {
        maxDiffPixelRatio: 0.02,
      })
    })
  }
}
