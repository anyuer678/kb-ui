<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox as KbCheckbox } from '../Checkbox'

defineOptions({ name: 'KbTransfer' })

export interface TransferItem {
  key: string
  label: string
  disabled?: boolean
}

export interface TransferProps {
  data?: TransferItem[]
  modelValue?: string[]
  /** 左右面板标题 */
  titles?: [string, string]
  /** 是否开启搜索过滤 */
  filterable?: boolean
  filterPlaceholder?: string
  /** 每页条数，0 表示不分页 */
  pageSize?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<TransferProps>(), {
  data: () => [],
  modelValue: () => [],
  titles: () => ['待选', '已选'],
  filterable: false,
  filterPlaceholder: '请输入搜索内容',
  pageSize: 0,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[], direction: 'left' | 'right']
}>()

const leftSelected = ref<string[]>([])
const rightSelected = ref<string[]>([])
const queries = ref<{ left: string; right: string }>({ left: '', right: '' })
const pages = ref<{ left: number; right: number }>({ left: 1, right: 1 })

const leftItems = computed(() => props.data.filter((item) => !props.modelValue.includes(item.key)))
const rightItems = computed(() => props.data.filter((item) => props.modelValue.includes(item.key)))

function filterItems(items: TransferItem[], query: string): TransferItem[] {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return items
  return items.filter((item) => item.label.toLowerCase().includes(keyword))
}

const leftFiltered = computed(() => filterItems(leftItems.value, queries.value.left))
const rightFiltered = computed(() => filterItems(rightItems.value, queries.value.right))

function pageCountOf(total: number): number {
  if (props.pageSize <= 0) return 1
  return Math.max(1, Math.ceil(total / props.pageSize))
}

const leftPageCount = computed(() => pageCountOf(leftFiltered.value.length))
const rightPageCount = computed(() => pageCountOf(rightFiltered.value.length))
/** 过滤/移动后当前页可能越界，取值时统一收敛 */
const leftPage = computed(() => Math.min(pages.value.left, leftPageCount.value))
const rightPage = computed(() => Math.min(pages.value.right, rightPageCount.value))

function paginate(items: TransferItem[], page: number): TransferItem[] {
  if (props.pageSize <= 0) return items
  const start = (page - 1) * props.pageSize
  return items.slice(start, start + props.pageSize)
}

const leftView = computed(() => paginate(leftFiltered.value, leftPage.value))
const rightView = computed(() => paginate(rightFiltered.value, rightPage.value))

function selectedOnView(view: TransferItem[], selected: string[]): number {
  return view.filter((item) => selected.includes(item.key)).length
}

const leftAllChecked = computed(
  () => leftView.value.length > 0 && selectedOnView(leftView.value, leftSelected.value) === leftView.value.length,
)
const leftIndeterminate = computed(() => {
  const count = selectedOnView(leftView.value, leftSelected.value)
  return count > 0 && count < leftView.value.length
})
const rightAllChecked = computed(
  () =>
    rightView.value.length > 0 &&
    selectedOnView(rightView.value, rightSelected.value) === rightView.value.length,
)
const rightIndeterminate = computed(() => {
  const count = selectedOnView(rightView.value, rightSelected.value)
  return count > 0 && count < rightView.value.length
})

function toggle(key: string, side: 'left' | 'right') {
  if (props.disabled) return
  const item = props.data.find((entry) => entry.key === key)
  if (item?.disabled) return
  const target = side === 'left' ? leftSelected : rightSelected
  const next = new Set(target.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  target.value = [...next]
}

/** 全选/取消全选当前可见（当前页 + 当前搜索结果）的可选条目 */
function toggleAll(side: 'left' | 'right', checked: boolean) {
  if (props.disabled) return
  const view = side === 'left' ? leftView.value : rightView.value
  const keys = view.filter((item) => !item.disabled).map((item) => item.key)
  const target = side === 'left' ? leftSelected : rightSelected
  const next = new Set(target.value)
  for (const key of keys) {
    if (checked) next.add(key)
    else next.delete(key)
  }
  target.value = [...next]
}

function move(toRight: boolean) {
  if (props.disabled) return
  const source = toRight ? leftSelected.value : rightSelected.value
  if (!source.length) return
  const next = toRight
    ? [...props.modelValue, ...source.filter((key) => !props.modelValue.includes(key))]
    : props.modelValue.filter((key) => !source.includes(key))
  emit('update:modelValue', next)
  emit('change', next, toRight ? 'right' : 'left')
  leftSelected.value = []
  rightSelected.value = []
  pages.value = { left: 1, right: 1 }
}

function onFilter(side: 'left' | 'right', event: Event) {
  const value = (event.target as HTMLInputElement).value
  queries.value = { ...queries.value, [side]: value }
  pages.value = { ...pages.value, [side]: 1 }
}

function goto(side: 'left' | 'right', page: number) {
  const count = side === 'left' ? leftPageCount.value : rightPageCount.value
  pages.value = { ...pages.value, [side]: Math.min(count, Math.max(1, page)) }
}
</script>

<template>
  <div class="kb-transfer" :class="{ 'kb-transfer--disabled': disabled }">
    <div class="kb-transfer__side kb-transfer__side--left">
      <div class="kb-transfer__header">
        <KbCheckbox
          :model-value="leftAllChecked"
          :indeterminate="leftIndeterminate"
          :disabled="disabled || !leftView.length"
          @update:model-value="(checked: boolean) => toggleAll('left', checked)"
        >
          <span class="kb-transfer__title">{{ titles[0] }} · {{ leftItems.length }}</span>
        </KbCheckbox>
      </div>
      <div v-if="filterable" class="kb-transfer__filter">
        <input
          class="kb-transfer__input"
          type="text"
          :placeholder="filterPlaceholder"
          :disabled="disabled"
          :value="queries.left"
          @input="onFilter('left', $event)"
        />
      </div>
      <div class="kb-transfer__box kb-transfer__left">
        <div
          v-for="item in leftView"
          :key="item.key"
          class="kb-transfer__item"
          :class="{
            'kb-transfer__item--selected': leftSelected.includes(item.key),
            'kb-transfer__item--disabled': item.disabled,
          }"
          @click="toggle(item.key, 'left')"
        >
          {{ item.label }}
        </div>
        <div v-if="!leftView.length" class="kb-transfer__empty">无匹配数据</div>
      </div>
      <div v-if="pageSize > 0" class="kb-transfer__pager">
        <button
          class="kb-transfer__page kb-transfer__page--prev"
          type="button"
          aria-label="上一页"
          :disabled="leftPage <= 1"
          @click="goto('left', leftPage - 1)"
        >
          ‹
        </button>
        <span class="kb-transfer__page-info">{{ leftPage }} / {{ leftPageCount }}</span>
        <button
          class="kb-transfer__page kb-transfer__page--next"
          type="button"
          aria-label="下一页"
          :disabled="leftPage >= leftPageCount"
          @click="goto('left', leftPage + 1)"
        >
          ›
        </button>
      </div>
    </div>

    <div class="kb-transfer__actions">
      <button
        class="kb-transfer__move kb-transfer__move--right"
        type="button"
        :disabled="disabled || !leftSelected.length"
        @click="move(true)"
      >
        →
      </button>
      <button
        class="kb-transfer__move kb-transfer__move--left"
        type="button"
        :disabled="disabled || !rightSelected.length"
        @click="move(false)"
      >
        ←
      </button>
    </div>

    <div class="kb-transfer__side kb-transfer__side--right">
      <div class="kb-transfer__header">
        <KbCheckbox
          :model-value="rightAllChecked"
          :indeterminate="rightIndeterminate"
          :disabled="disabled || !rightView.length"
          @update:model-value="(checked: boolean) => toggleAll('right', checked)"
        >
          <span class="kb-transfer__title">{{ titles[1] }} · {{ rightItems.length }}</span>
        </KbCheckbox>
      </div>
      <div v-if="filterable" class="kb-transfer__filter">
        <input
          class="kb-transfer__input"
          type="text"
          :placeholder="filterPlaceholder"
          :disabled="disabled"
          :value="queries.right"
          @input="onFilter('right', $event)"
        />
      </div>
      <div class="kb-transfer__box kb-transfer__right">
        <div
          v-for="item in rightView"
          :key="item.key"
          class="kb-transfer__item"
          :class="{
            'kb-transfer__item--selected': rightSelected.includes(item.key),
            'kb-transfer__item--disabled': item.disabled,
          }"
          @click="toggle(item.key, 'right')"
        >
          {{ item.label }}
        </div>
        <div v-if="!rightView.length" class="kb-transfer__empty">无匹配数据</div>
      </div>
      <div v-if="pageSize > 0" class="kb-transfer__pager">
        <button
          class="kb-transfer__page kb-transfer__page--prev"
          type="button"
          aria-label="上一页"
          :disabled="rightPage <= 1"
          @click="goto('right', rightPage - 1)"
        >
          ‹
        </button>
        <span class="kb-transfer__page-info">{{ rightPage }} / {{ rightPageCount }}</span>
        <button
          class="kb-transfer__page kb-transfer__page--next"
          type="button"
          aria-label="下一页"
          :disabled="rightPage >= rightPageCount"
          @click="goto('right', rightPage + 1)"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>
