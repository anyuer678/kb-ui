/** 数字钳制 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** 随机整数 [min, max] 闭区间 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 百分比转小数：45% → 0.45 */
export function percentToRatio(value: number): number {
  return value / 100
}

/** 金额格式化：12345.6 → ¥12,345.60 */
export function formatCurrency(value: number, symbol = '¥'): string {
  return `${symbol}${formatNumber(value, 2)}`
}

// 复用 format 里的千分位（避免循环依赖，内联实现）
function formatNumber(n: number, decimals: number): string {
  const fixed = n.toFixed(decimals)
  const [int, dec] = fixed.split('.')
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec ? `.${dec}` : '')
}
