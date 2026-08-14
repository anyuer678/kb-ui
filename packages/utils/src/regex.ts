/** 常用正则集合 */
export const regex = {
  email: /^[\w.+-]+@[\w-]+\.[\w.-]+$/,
  url: /^https?:\/\/[\w.-]+(?::\d+)?(?:\/[\w./?%&=#-]*)?$/i,
  phone: /^1[3-9]\d{9}$/,
  idCard: /^\d{15}$|^\d{17}[\dXx]$/,
  ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
  chinese: /[\u4e00-\u9fa5]/,
  hexColor: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
  passwordStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
}

/** 校验邮箱 */
export function isEmail(value: string): boolean {
  return regex.email.test(value)
}

/** 校验 URL */
export function isUrl(value: string): boolean {
  return regex.url.test(value)
}

/** 校验手机号 */
export function isPhone(value: string): boolean {
  return regex.phone.test(value)
}

/** 校验身份证 */
export function isIdCard(value: string): boolean {
  return regex.idCard.test(value)
}
