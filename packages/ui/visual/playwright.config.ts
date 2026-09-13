import { defineConfig } from '@playwright/test'

/**
 * 视觉回归配置
 *
 * 注意：playwright 的快照与「操作系统 + 字体 + 浏览器版本」强相关，
 * 基线必须在同一平台上生成。本仓库的基线在 Windows 上生成，
 * 因此 CI 里对应的 job 也跑 windows-latest（见 .github/workflows/ci.yml）。
 */
export default defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.ts$/,
  snapshotDir: './snapshots',
  outputDir: './test-results',
  // 一图一文件名，避免 playwright 默认的 spec 目录前缀，便于人工比对
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : [['list']],
  expect: {
    toHaveScreenshot: {
      // 允许 2% 像素差异，容忍亚像素抗锯齿抖动
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:5199',
    screenshot: 'only-on-failure',
    deviceScaleFactor: 1,
    colorScheme: 'light',
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  },
  webServer: {
    command: 'node ../node_modules/vite/bin/vite.js --config vite.config.ts',
    url: 'http://127.0.0.1:5199/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
