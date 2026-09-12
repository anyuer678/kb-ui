/** 服务自身的标识信息，由 createApp 注入，健康检查与根路由都会用到 */
export interface ApiInfo {
  name: string
  version: string
}
