export { createApp, API_PREFIX, DEFAULT_API_NAME, DEFAULT_API_VERSION } from './app'
export type { CreateAppOptions } from './app'
export { startServer, DEFAULT_PORT } from './server'
export type { StartServerOptions } from './server'
export { HttpError } from './middleware/error'
export { validate } from './middleware/validate'
export {
  parsePageQuery,
  queryList,
  searchRows,
  sortRows,
  toPageResult,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from './query'
export type { ListQueryOptions, PageQuery, PageResult, SortOrder } from './query'
export type { ApiInfo } from './types'

/** 内存种子数据与访问器：想换成真实数据库时，只需替换这一层 */
export {
  listUsers,
  findUser,
  createUser,
  removeUser,
  USERS_TOTAL,
  USER_ROLES,
  USER_SEARCH_FIELDS,
  USER_SORT_KEYS,
} from './data/users'
export type { User } from './data/users'
export { regionTree, childrenOf, findRegion, toSummary, REGION_NODE_COUNT } from './data/regions'
export type { RegionNode, RegionSummary } from './data/regions'
export { options as optionItems, OPTIONS_TOTAL } from './data/options'
export type { OptionItem } from './data/options'
