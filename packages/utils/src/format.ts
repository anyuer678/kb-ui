/** 日期格式化：YYYY-MM-DD HH:mm:ss，支持自定义模板 */
export function formatDate(
  date: Date | string | number = new Date(),
  template = 'YYYY-MM-DD HH:mm:ss',
): string {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number, len = 2) => String(n).padStart(len, '0')
  const map: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  }
  return template.replace(/YYYY|MM|DD|HH|mm|ss/g, (k) => map[k])
}

/** 数字千分位格式化 */
export function formatNumber(n: number, decimals = 0): string {
  const fixed = n.toFixed(decimals)
  const [int, dec] = fixed.split('.')
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec ? `.${dec}` : '')
}

/** 文件大小格式化：B/KB/MB/GB */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unit = ''
  for (const u of units) {
    size /= 1024
    unit = u
    if (size < 1024) break
  }
  return `${size >= 100 ? size.toFixed(0) : size.toFixed(1)} ${unit}`
}

/** 时长格式化：秒 → 1天2小时3分4秒 */
export function formatDuration(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const parts: string[] = []
  if (d) parts.push(`${d}天`)
  if (h) parts.push(`${h}小时`)
  if (m) parts.push(`${m}分`)
  if (!parts.length || s) parts.push(`${s}秒`)
  return parts.join('')
}

/** 相对时间：刚刚/x分钟前/x小时前/x天前 */
export function timeAgo(input: Date | string | number): string {
  const date = input instanceof Date ? input : new Date(input)
  const diff = Date.now() - date.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  return formatDate(date, 'YYYY-MM-DD')
}
