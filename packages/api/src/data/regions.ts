export interface RegionNode {
  value: string
  label: string
  /** 末级标记：Cascader 异步模式直接消费这个字段 */
  leaf: boolean
  children?: RegionNode[]
}

/** 懒加载返回的节点摘要（不带 children，懒加载才有意义） */
export interface RegionSummary {
  value: string
  label: string
  leaf: boolean
}

const AREA_COUNT = 8
const CITY_PER_AREA = 6
const BLOCK_PER_CITY = 8

/** 全合成数据（8 大区 × 6 城市 × 8 区块 = 440 个节点），刻意不带真实行政区划含义 */
function buildRegions(): RegionNode[] {
  const areas: RegionNode[] = []
  for (let a = 1; a <= AREA_COUNT; a += 1) {
    const areaId = `a${a}`
    const cities: RegionNode[] = []
    for (let c = 1; c <= CITY_PER_AREA; c += 1) {
      const cityId = `${areaId}-c${c}`
      const blocks: RegionNode[] = []
      for (let b = 1; b <= BLOCK_PER_CITY; b += 1) {
        blocks.push({ value: `${cityId}-b${b}`, label: `区块 ${b}`, leaf: true })
      }
      cities.push({ value: cityId, label: `城市 ${c}`, leaf: false, children: blocks })
    }
    areas.push({ value: areaId, label: `大区 ${a}`, leaf: false, children: cities })
  }
  return areas
}

const store = buildRegions()

const index = new Map<string, RegionNode>()
function indexNodes(nodes: RegionNode[]): void {
  for (const node of nodes) {
    index.set(node.value, node)
    if (node.children) indexNodes(node.children)
  }
}
indexNodes(store)

/** 节点总数（8 + 48 + 384） */
export const REGION_NODE_COUNT = index.size

/** 完整嵌套树，供 Tree 的虚拟滚动演示 */
export const regionTree: RegionNode[] = store

export function toSummary(node: RegionNode): RegionSummary {
  return { value: node.value, label: node.label, leaf: node.leaf }
}

/** 取某个节点的下一级；parent 为空时返回顶层。节点不存在或已是末级时返回 undefined */
export function childrenOf(parent: string | null): RegionNode[] | undefined {
  if (!parent) return store
  return index.get(parent)?.children
}

export function findRegion(value: string): RegionNode | undefined {
  return index.get(value)
}
