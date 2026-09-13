/**
 * KB UI 端到端测试（Playwright + 真实浏览器）
 *
 *   pnpm e2e            # 需要外部已启动 playground(:8070) 与 docs(:8071)，即先 pnpm start
 *   pnpm e2e --serve    # 脚本自己拉起两个服务、跑完再关掉（CI 用）
 *   E2E_CHANNEL=msedge  # 可选：指定浏览器频道，默认用 Playwright 自带的 Chromium
 *
 * 注意（踩过的坑）：
 *   - 仓库只装了 @playwright/test，没有安装 playwright 包，直接 require('playwright') 必然失败；
 *   - 旧版写死 channel:'msedge'，CI 的 ubuntu runner 上没有 Edge，等于 e2e 从来没能在 CI 跑起来；
 *     现在默认用 Playwright 自带的 Chromium，频道改为可选。
 */
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'

const require = createRequire(import.meta.url)

const ARGV_SERVE = process.argv.includes('--serve')
const PLAYGROUND = 'http://localhost:8070'
const DOCS = 'http://localhost:8071'

// ---------- Playwright 解析 ----------
function resolvePlaywright() {
  // @playwright/test 与 playwright 都导出 chromium，项目里装的是前者
  for (const id of ['@playwright/test', 'playwright']) {
    try {
      return require(id)
    } catch {
      /* 继续尝试 */
    }
  }
  throw new Error('未找到 Playwright，请先执行 pnpm add -D -w @playwright/test')
}

// ---------- 服务就绪探测 ----------
/**
 * 用 HTTP 探测而不是 TCP 连 127.0.0.1：
 * Vite 开发服务器在 Windows 上可能只监听 IPv6 回环（::1），
 * 写死 127.0.0.1 的 TCP 探针会永远 ECONNREFUSED——这是踩过的坑。
 */
async function waitForServer(url, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs
  let lastError
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
      if (res.ok || res.status < 500) return
      lastError = new Error(`HTTP ${res.status}`)
    } catch (error) {
      lastError = error
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`等待 ${url} 超时（${timeoutMs}ms）：${lastError?.message ?? ''}`)
}

// ---------- 自启服务 ----------
function startServers() {
  const child = spawn('pnpm', ['start'], {
    stdio: 'inherit',
    shell: true,
    // detached 才能拿到进程组，关停时把整棵树一起杀掉（concurrently 会 fork 子进程）
    detached: process.platform !== 'win32',
  })
  return child
}

function stopServers(child) {
  if (!child || child.killed) return
  try {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    } else {
      process.kill(-child.pid, 'SIGTERM')
    }
  } catch {
    /* 已退出 */
  }
}

// ---------- 断言 ----------
const results = []
function check(name, cond) {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}`)
  if (!cond) process.exitCode = 1
}

/** 断言不抛异常才算通过：组件交互崩了（比如未处理的报错）也要能被抓到 */
async function checkSafe(name, fn) {
  try {
    check(name, await fn())
  } catch (error) {
    results.push(`FAIL  ${name}（异常：${error.message}）`)
    process.exitCode = 1
  }
}

const { chromium } = resolvePlaywright()
const launchOptions = { headless: true }
if (process.env.E2E_CHANNEL) launchOptions.channel = process.env.E2E_CHANNEL

let servers
if (ARGV_SERVE) {
  console.log('正在启动 playground(:8070) 与 docs(:8071)…')
  servers = startServers()
  try {
    await waitForServer(PLAYGROUND)
    await waitForServer(DOCS)
  } catch (error) {
    // 起不来就别把服务扔在后台跑着
    stopServers(servers)
    throw error
  }
  console.log('两个服务已就绪\n')
}

const browser = await chromium.launch(launchOptions)
try {
  const page = await browser.newPage()
  const pageErrors = []
  page.on('pageerror', (err) => pageErrors.push(err.message))

  // ===== playground (8070) · 基础组件 =====
  await page.goto(PLAYGROUND, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1000)
  check('playground 页面标题', (await page.title()).includes('KB UI Playground'))
  check('Button 渲染(>10)', (await page.locator('.kb-button').count()) > 10)
  check('Icon 渲染(>=12)', (await page.locator('.kb-icon').count()) >= 12)
  check('Tag 渲染(>=6)', (await page.locator('.kb-tag').count()) >= 6)
  check('Table 行渲染(>=3)', (await page.locator('.kb-table tbody tr').count()) >= 3)
  check(
    '组件样式生效(Button primary 渐变背景)',
    (await page
      .locator('.kb-button--primary')
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundImage)) !== 'none',
  )

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

  // ===== playground · 新增组件（v0.3.x 扩展） =====
  await page.locator('#section-new').scrollIntoViewIfNeeded()

  check('Image 渲染(>=3)', (await page.locator('.kb-image').count()) >= 3)

  // ImagePreview：打开 → 是可命名的模态对话框 → Esc 关闭
  await checkSafe('ImagePreview 打开为可命名的模态对话框', async () => {
    await page.getByRole('button', { name: '打开预览器' }).click()
    await page.waitForTimeout(500)
    const dialog = page.locator('[role="dialog"][aria-modal="true"]').first()
    return (await dialog.count()) > 0 && !!(await dialog.getAttribute('aria-label'))
  })
  await checkSafe('ImagePreview Esc 关闭', async () => {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    return (await page.locator('[role="dialog"][aria-modal="true"]').count()) === 0
  })

  // TimePicker：展开出 listbox，选中后出现已选状态
  await checkSafe('TimePicker 展开并可选中', async () => {
    await page.locator('.kb-timepicker__control').first().click()
    await page.waitForTimeout(400)
    const options = page.locator('[role="listbox"] [role="option"]')
    if ((await options.count()) === 0) return false
    await options.nth(3).click()
    await page.waitForTimeout(400)
    return (await page.locator('[role="option"][aria-selected="true"]').count()) > 0
  })
  await page.keyboard.press('Escape')

  // TreeSelect：展开出可访问性树
  await checkSafe('TreeSelect 展开为 role=tree', async () => {
    await page.locator('.kb-treeselect__control').first().click()
    await page.waitForTimeout(400)
    const tree = page.locator('[role="tree"]')
    return (await tree.count()) > 0 && (await page.locator('[role="treeitem"]').count()) > 0
  })
  await page.keyboard.press('Escape')

  // AutoComplete：输入后出候选
  await checkSafe('AutoComplete 输入后出现候选', async () => {
    const input = page.locator('.kb-autocomplete input').first()
    await input.fill('vue')
    await page.waitForTimeout(500)
    return (await page.locator('[role="listbox"] [role="option"]').count()) > 0
  })
  await page.keyboard.press('Escape')

  // Splitter：separator 可聚焦、键盘可调
  // 注意必须限定在 .kb-splitter 内：KbDivider 同样是 role="separator"，
  // 不区分类名会抓到分隔线（它没有 aria-valuenow，断言必然失败）
  await checkSafe('Splitter 分隔条键盘可调整比例', async () => {
    const bar = page.locator('.kb-splitter [role="separator"]').first()
    const before = await bar.getAttribute('aria-valuenow')
    await bar.focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)
    const after = await bar.getAttribute('aria-valuenow')
    return before !== after
  })

  // ContextMenu：右键出菜单，方向键可移动，Esc 关闭
  await checkSafe('ContextMenu 右键弹出菜单', async () => {
    await page.getByText('在此区域点击右键').click({ button: 'right' })
    await page.waitForTimeout(400)
    return (
      (await page.locator('[role="menu"]').count()) > 0 &&
      (await page.locator('[role="menuitem"]').count()) >= 3
    )
  })
  await checkSafe('ContextMenu Esc 关闭', async () => {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    return (await page.locator('[role="menu"]').count()) === 0
  })

  // Tour：开始引导 → 气泡是模态对话框 → Esc 关闭
  await checkSafe('Tour 气泡为模态对话框', async () => {
    await page.getByRole('button', { name: '开始引导' }).click()
    await page.waitForTimeout(500)
    return (await page.locator('[role="dialog"][aria-modal="true"]').count()) > 0
  })
  await checkSafe('Tour Esc 关闭', async () => {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    return (await page.locator('[role="dialog"][aria-modal="true"]').count()) === 0
  })

  // BackTop：滚过阈值后出现
  await checkSafe('BackTop 滚动后出现', async () => {
    await page.evaluate(() => window.scrollTo(0, 900))
    await page.waitForTimeout(600)
    return (await page.locator('.kb-backtop').count()) > 0
  })
  await page.evaluate(() => window.scrollTo(0, 0))

  // Anchor：锚点链接渲染
  check('Anchor 链接渲染(>=3)', (await page.locator('.kb-anchor__link').count()) >= 3)

  // Affix：容器内滚动后固钉
  await checkSafe('Affix 容器内滚动后固定', async () => {
    await page.locator('#scroll-demo').evaluate((el) => {
      el.scrollTop = 150
    })
    await page.waitForTimeout(500)
    return (await page.locator('.kb-affix__inner--fixed').count()) > 0
  })

  // Statistic / CountUp
  check('Statistic 渲染(>=3)', (await page.locator('.kb-statistic').count()) >= 3)
  check('CountUp 渲染', (await page.locator('.kb-countup').count()) > 0)

  // ConfigProvider：切换语言，内置文案跟随变化
  await checkSafe('ConfigProvider 切英文后内置文案变化', async () => {
    await page.getByText('English', { exact: true }).click()
    await page.waitForTimeout(500)
    return (await page.getByText('No data').count()) > 0
  })
  await page.getByText('中文', { exact: true }).click()
  await page.waitForTimeout(300)

  // 暗色主题 token 生效
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark'
  })
  await page.waitForTimeout(300)
  const darkBg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--kb-color-bg').trim(),
  )
  check('暗色主题 token 切换生效', darkBg === '#0f172a')

  // Layout：栅格骨架渲染
  check('Layout 渲染(>=1)', (await page.locator('.kb-layout').count()) > 0)
  check('Layout 含 Sider', (await page.locator('.kb-layout__sider').count()) > 0)

  // FloatButton：浮动按钮渲染
  check('FloatButton 渲染(>=1)', (await page.locator('.kb-float-button').count()) > 0)

  // Mentions：@ 提及输入框渲染
  check('Mentions 渲染', (await page.locator('.kb-mentions').count()) > 0)

  // VirtualList：可视列表渲染
  check('VirtualList 渲染', (await page.locator('.kb-virtual-list').count()) > 0)

  // QRCode：二维码 svg path 渲染
  await checkSafe('QRCode svg 渲染', async () => {
    const pathCount = await page.locator('.kb-qrcode svg path').count()
    return pathCount >= 1
  })

  // 整个流程跑完，页面不应有未捕获异常
  check(`playground 无未捕获异常（${pageErrors.length}）`, pageErrors.length === 0)

  // ===== docs (8071) =====
  await page.goto(DOCS, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(800)
  check('docs 加载', (await page.title()).includes('KB UI'))
  await page.goto(`${DOCS}/components/button`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(800)
  check('docs 组件页渲染 Button', (await page.locator('.kb-button').count()) > 0)
  check('docs 组件页 API 表格', (await page.locator('table').count()) > 0)
  check(
    'docs 组件样式生效',
    (await page
      .locator('.kb-button--primary')
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundImage)) !== 'none',
  )

  // 5 个新组件的文档页：渲染 + 真实组件实例存在
  for (const [slug, selector] of [
    ['layout', '.kb-layout'],
    ['float-button', '.kb-float-button'],
    ['mentions', '.kb-mentions'],
    ['virtual-list', '.kb-virtual-list'],
    ['qrcode', '.kb-qrcode'],
  ]) {
    await page.goto(`${DOCS}/components/${slug}`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(500)
    check(`docs 页 ${slug} 渲染组件`, (await page.locator(selector).count()) > 0)
  }
} finally {
  await browser.close()
  stopServers(servers)
}

console.log('\n===== KB UI 端到端测试结果 =====')
console.log(results.join('\n'))
const pass = results.filter((r) => r.startsWith('PASS')).length
console.log(`\n通过 ${pass}/${results.length}`)
process.exit(process.exitCode || 0)
