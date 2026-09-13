/** 提及候选项 */
export interface MentionOption {
  /** 插入文本时使用的值 */
  value: string
  /** 展示文案，缺省用 value */
  label?: string
  disabled?: boolean
}

/** 自定义过滤函数；返回 true 表示保留 */
export type MentionFilter = (search: string, option: MentionOption) => boolean
