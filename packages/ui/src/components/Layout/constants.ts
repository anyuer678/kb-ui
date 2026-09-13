import type { InjectionKey } from 'vue'

/** Layout 与 Sider 之间的上下文：Sider 挂载/卸载时登记，供 Layout 自动判断水平布局 */
export interface LayoutContext {
  /** 登记一个 Sider，返回注销函数 */
  registerSider: () => () => void
}

export const LAYOUT_CONTEXT_KEY: InjectionKey<LayoutContext> = Symbol('kb-layout-context')
