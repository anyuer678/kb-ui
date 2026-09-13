export interface VirtualListProps<T = unknown> {
  /** 数据源 */
  items: T[]
  /** 单项高度（px），固定高度模式 */
  itemHeight: number
  /** 可视区高度（px） */
  height: number
  /** 视口上下各额外渲染的项数，减少快速滚动时的白屏 */
  buffer?: number
  /** 触发 reachEnd 的提前量（px） */
  reachEndThreshold?: number
}
