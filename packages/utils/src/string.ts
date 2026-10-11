/** 截断字符串 */
export function truncate(text: string, max = 20, suffix = '…'): string {
  if (text.length <= max) return text
  return text.slice(0, max) + suffix
}

/** 驼峰命名：hello-world → helloWorld */
export function camelCase(text: string): string {
  return text
    .replace(/[-_\s]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
}

/** 短横线命名：helloWorld → hello-world */
export function kebabCase(text: string): string {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/** 首字母大写 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** 敏感信息打码：13800138000 → 138****8000 */
export function maskString(text: string, start = 3, end = 4): string {
  if (text.length <= start + end) return text
  return text.slice(0, start) + '*'.repeat(Math.min(text.length - start - end, 6)) + text.slice(-end)
}

/** 随机字符串 */
export function randomString(length = 8, chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): string {
  let result = ''
  for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

/** 移除 HTML 标签（单遍线性扫描，无正则回溯；非 XSS sanitizer——渲染前仍须转义） */
export function stripHtml(html: string): string {
  let out = ''
  for (let i = 0; i < html.length; ) {
    const lt = html.indexOf('<', i)
    if (lt < 0) { out += html.slice(i); break }
    out += html.slice(i, lt)
    const gt = html.indexOf('>', lt)
    if (gt < 0) { out += html.slice(lt); break } // 孤立'<'：与正则语义一致，原样保留
    i = gt + 1
  }
  return out
}
