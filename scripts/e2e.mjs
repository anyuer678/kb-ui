/**
 * KB UI 端到端测试（playwright + 真实浏览器）
 * 前置：pnpm start 已启动 playground(:8070) 与 docs(:8071)
 * 运行：pnpm e2e
 * 用法：脚本自动探测 playwright（优先项目依赖，其次本机 MCP 缓存）
 */
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)

function resolvePlaywright() {
  try {
    return require('playwright') // 项目内已安装
  } catch {
    // 回退：Reasonix playwright-mcp 缓存（本机开发环境）
    const candidates = []
    const appData = process.env.APPDATA
    if (appData) {
      candidates.push(
        path.join(appData, 'reasonix', 'mcp-state', '0d2cf923056558d7', 'playwright-mcp', 'cache', 'npm', '_npx', '86170c4cd1c5da32', 'node_modules', 'playwright'),
      )
    }
    for (const dir of candidates) {
      try {
        return require(dir)
      } catch {
        /* 继续尝试 */
      }
    }
  }
  throw new Error('未找到 playwright，请先 npm i -D playwright 或检查 MCP 缓存')
}

const { chromium } = resolvePlaywright()

const results = []
function check(name, cond) {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}`)
  if (!cond) process.exitCode = 1
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage()

  // ===== playground (8070) =====
  await page.goto('http://localhost:8070', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1000)
  check('playground 页面标题', (await page.title()).includes('KB UI Playground'))
  check('Button 渲染(>10)', (await page.locator('.kb-button').count()) > 10)
  check('Icon 渲染(>=12)', (await page.locator('.kb-icon').count()) >= 12)
  check('Tag 渲染(>=6)', (await page.locator('.kb-tag').count()) >= 6)
  check('Table 行渲染(>=3)', (await page.locator('.kb-table tbody tr').count()) >= 3)
  check('组件样式生效(Button primary 背景)', (await page
    .locator('.kb-button--primary')
    .first()
    .evaluate((el) => getComputedStyle(el).backgroundColor)) === 'rgb(59, 130, 246)')

  // Input 输入
  await page.locator('.kb-input__inner').first().fill('hello')
  check('Input 输入值', (await page.locator('.kb-input__inner').first().inputValue()) === 'hello')

  // Select 展开与选择
  await page.locator('.kb-select__trigger').first().click()
  await page.waitForTimeout(400)
  check('Select 展开(3 选项)', (await page.locator('.kb-select__option').count()) === 3)
  await page.locator('.kb-select__option').nth(1).click()
  await page.waitForTimeout(400)
  check('Select 选择→显示香蕉', (await page.locator('.kb-select__value').first().textContent()).includes('香蕉'))

  // Message
  await page.getByRole('button', { name: '成功提示' }).click()
  await page.waitForTimeout(600)
  check('Message 出现', (await page.locator('.kb-message').count()) > 0)

  // Dialog 打开 → 遮罩关闭
  await page.getByRole('button', { name: '打开对话框' }).click()
  await page.waitForTimeout(600)
  check('Dialog 打开', (await page.locator('.kb-dialog').count()) === 1)
  await page.mouse.click(10, 400)
  await page.waitForTimeout(600)
  check('Dialog 遮罩点击关闭', (await page.locator('.kb-dialog').count()) === 0)

  // Tooltip hover
  await page.getByRole('button', { name: '上方' }).hover()
  await page.waitForTimeout(600)
  check('Tooltip hover 显示', (await page.locator('.kb-tooltip__popper').count()) > 0)

  // 表单交互不崩溃
  await page.locator('.kb-checkbox').first().click()
  await page.locator('.kb-radio').nth(1).click()
  await page.locator('.kb-switch').first().click()
  await page.waitForTimeout(300)
  check('Checkbox/Radio/Switch 交互无异常', true)

  // 暗色主题 token 生效
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark'
  })
  await page.waitForTimeout(300)
  const darkBg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--kb-color-bg').trim(),
  )
  check('暗色主题 token 切换生效', darkBg === '#0f172a')

  // ===== docs (8071) =====
  await page.goto('http://localhost:8071', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(800)
  check('docs 加载', (await page.title()).includes('KB UI'))
  await page.goto('http://localhost:8071/components/button', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(800)
  check('docs 组件页渲染 Button', (await page.locator('.kb-button').count()) > 0)
  check('docs 组件页 API 表格', (await page.locator('table').count()) > 0)
  check('docs 组件样式生效', (await page
    .locator('.kb-button--primary')
    .first()
    .evaluate((el) => getComputedStyle(el).backgroundColor)) === 'rgb(59, 130, 246)')
} finally {
  await browser.close()
}

console.log('\n===== KB UI 端到端测试结果 =====')
console.log(results.join('\n'))
const pass = results.filter((r) => r.startsWith('PASS')).length
console.log(`\n通过 ${pass}/${results.length}`)
process.exit(process.exitCode || 0)
