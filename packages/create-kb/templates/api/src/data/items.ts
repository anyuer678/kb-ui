export interface Item {
  id: number
  name: string
  done: boolean
}

/** 内存数据（演示用，可替换为数据库） */
export const items: Item[] = [
  { id: 1, name: '搭建 API 服务', done: true },
  { id: 2, name: '接入数据库', done: false },
]
