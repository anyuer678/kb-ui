import { test, expect, type Page } from '@playwright/test'

/**
 * 视觉回归用例
 *
 * 每个用例加载取样台的一个「定格样本」（?c=<组件>&theme=<主题>），
 * 固定 800×520 视口整屏截图，与 snapshots/ 下的基线逐像素比对。
 *
 * 更新基线：
 *   pnpm test:visual:update          # 全量重刷
 *   pnpm test:visual:update --grep Button   # 只刷某个组件
 *
 * 基线必须与运行平台一致（Windows ↔ Windows），详见 playwright.config.ts 注释。
 */

const VIEWPORT = { width: 800, height: 520 } as const

const THEMES = ['default', 'cyber', 'terminal'] as const

interface Specimen {
  /** 与取样台 FIXTURES 的 key 一致 */
  name: string
  /** 浮层类组件：截图前先展开面板，并等待对应 role 出现 */
  panelRole?: 'listbox' | 'tree'
}

const SPECIMENS: Specimen[] = [
  { name: 'Button' },
  { name: 'Input' },
  { name: 'Select', panelRole: 'listbox' },
  { name: 'Switch' },
  { name: 'Checkbox' },
  { name: 'Tag' },
  { name: 'Badge' },
  { name: 'Alert' },
  { name: 'Card' },
  { name: 'Table' },
  { name: 'Tabs' },
  { name: 'Progress' },
  { name: 'Steps' },
  { name: 'Pagination' },
  { name: 'Image' },
  { name: 'Dialog' },
  { name: 'Splitter' },
  { name: 'TreeSelect', panelRole: 'tree' },
]

async function bootHarness(page: Page, name: string, theme: string) {
  await page.setViewportSize(VIEWPORT)
  await page.goto(`/?c=${encodeURIComponent(name)}&theme=${encodeURIComponent(theme)}`)
  // 取样台挂载后置位 data-ready="1"，避免截到半成品
  await page.waitForSelector('[data-ready="1"]')
  await page.evaluate(() => document.fonts.ready)
}

for (const theme of THEMES) {
  for (const specimen of SPECIMENS) {
    test(`${specimen.name} · ${theme}`, async ({ page }) => {
      await bootHarness(page, specimen.name, theme)

      if (specimen.panelRole) {
        await page.getByRole('combobox').first().click()
        await page.locator(`[role="${specimen.panelRole}"]`).first().waitFor({ state: 'visible' })
      }

      await expect(page).toHaveScreenshot(`${specimen.name.toLowerCase()}-${theme}.png`)
    })
  }
}
