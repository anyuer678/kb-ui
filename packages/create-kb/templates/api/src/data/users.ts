/* eslint-disable */
// ⚠️ 自动生成文件，请勿直接修改。
// 源：packages/api/src —— 改动请改源文件后运行 `pnpm sync:api-template`。
export interface User {
  id: number
  name: string
  company: string
  city: string
  email: string
  role: string
  score: number
  createdAt: string
}

const SURNAMES = ['李', '王', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭']
const GIVEN_NAMES = ['明', '华', '静', '敏', '伟', '芳', '强', '磊', '洋', '艳', '勇', '军', '杰', '娟', '涛', '超']
const COMPANIES = ['星尘科技', '云图数据', '南栀软件', '澜川网络', '青梧智能', '归墟信息', '未名云', '鸣石科技']
const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '苏州']
export const USER_ROLES = ['管理员', '编辑', '访客'] as const

/** 参与 keyword 模糊匹配的字段 */
export const USER_SEARCH_FIELDS = ['name', 'company', 'city', 'email'] as const
/** 允许排序的字段白名单 */
export const USER_SORT_KEYS = ['id', 'name', 'company', 'city', 'role', 'score', 'createdAt'] as const

export const USERS_TOTAL = 500

function formatDate(offsetDays: number): string {
  const base = Date.UTC(2026, 0, 1)
  return new Date(base + offsetDays * 86_400_000).toISOString().slice(0, 10)
}

/** 500 条确定性数据：用下标做取模而不是随机数，保证分页与测试可复现 */
const store: User[] = Array.from({ length: USERS_TOTAL }, (_, index) => ({
  id: index + 1,
  name: `${SURNAMES[index % SURNAMES.length]}${GIVEN_NAMES[(index * 7) % GIVEN_NAMES.length]}`,
  company: COMPANIES[index % COMPANIES.length],
  city: CITIES[(index * 3) % CITIES.length],
  email: `user${index + 1}@example.com`,
  role: USER_ROLES[index % USER_ROLES.length],
  score: (index * 37) % 100,
  createdAt: formatDate(index),
}))

/** 只读视图，路由层拿它做查询 */
export function listUsers(): User[] {
  return store
}

export function findUser(id: number): User | undefined {
  return store.find((user) => user.id === id)
}

let nextId = USERS_TOTAL + 1

export function createUser(payload: Pick<User, 'name'> & Partial<User>): User {
  const user: User = {
    id: nextId++,
    name: payload.name,
    company: payload.company ?? COMPANIES[0],
    city: payload.city ?? CITIES[0],
    email: payload.email ?? `user${nextId - 1}@example.com`,
    role: payload.role ?? USER_ROLES[2],
    score: payload.score ?? 0,
    createdAt: formatDate(0),
  }
  store.push(user)
  return user
}

export function removeUser(id: number): boolean {
  const index = store.findIndex((user) => user.id === id)
  if (index < 0) return false
  store.splice(index, 1)
  return true
}
