export interface OptionItem {
  key: string
  label: string
  disabled?: boolean
}

export const OPTIONS_TOTAL = 240

/** 240 条候选项，每 17 条埋一个 disabled，用来演示穿梭框的禁用态 */
export const options: OptionItem[] = Array.from({ length: OPTIONS_TOTAL }, (_, index) => ({
  key: `opt-${index + 1}`,
  label: `候选项 ${String(index + 1).padStart(3, '0')}`,
  disabled: index % 17 === 0,
}))
