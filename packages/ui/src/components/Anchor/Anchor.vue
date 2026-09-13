<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbAnchor' })

export interface AnchorItem {
  /** 锚点文案 */
  title: string
  /** 目标锚点，形如 '#section-1' */
  href: string
  children?: AnchorItem[]
}

export interface AnchorProps {
  items?: AnchorItem[]
  /** 高亮判定偏移（px）：目标顶部进入该偏移以内即视为激活 */
  offsetTop?: number
  /** 点击后是否平滑滚动，默认 true */
  smooth?: boolean
}

const props = withDefaults(defineProps<AnchorProps>(), {
  items: () => [],
  offsetTop: 0,
  smooth: true,
})

const emit = defineEmits<{ change: [href: string] }>()

const { t } = useLocale()

/** 当前激活的锚点 href */
const activeHref = ref('')

/** 拍平所有锚点（含子级），便于统一计算激活项 */
const flatItems = computed<AnchorItem[]>(() => {
  const out: AnchorItem[] = []
  const walk = (list: AnchorItem[]): void => {
    for (const item of list) {
      out.push(item)
      if (item.children?.length) walk(item.children)
    }
  }
  walk(props.items)
  return out
})

/** 取 href 对应的目标元素，找不到返回 null */
function resolveTarget(href: string): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const id = href.startsWith('#') ? href.slice(1) : href
  return document.getElementById(id)
}

/** 滚动时取「最后一个已滚过顶部偏移的目标」为激活项 */
function updateActive(): void {
  const offset = props.offsetTop
  let current = ''
  for (const item of flatItems.value) {
    const el = resolveTarget(item.href)
    if (!el) continue
    if (el.getBoundingClientRect().top - offset <= 0) current = item.href
  }
  if (!current && flatItems.value.length) current = flatItems.value[0].href
  if (current !== activeHref.value) {
    activeHref.value = current
    emit('change', current)
  }
}

function handleClick(event: MouseEvent, href: string): void {
  event.preventDefault()
  const el = resolveTarget(href)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY - props.offsetTop
  window.scrollTo({ top, behavior: props.smooth ? 'smooth' : 'auto' })

  // 立即更新高亮，避免等待滚动结束
  activeHref.value = href
  emit('change', href)
}

onMounted(() => {
  window.addEventListener('scroll', updateActive, { passive: true })
  updateActive()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('scroll', updateActive)
})
</script>

<template>
  <nav class="kb-anchor" :aria-label="t('anchor.label')">
    <ul class="kb-anchor__list">
      <li
        v-for="item in items"
        :key="item.href"
        class="kb-anchor__item"
        :class="{ 'kb-anchor__item--active': activeHref === item.href }"
      >
        <a class="kb-anchor__link" :href="item.href" @click="handleClick($event, item.href)">
          {{ item.title }}
        </a>
        <ul v-if="item.children?.length" class="kb-anchor__sublist">
          <li
            v-for="child in item.children"
            :key="child.href"
            class="kb-anchor__item kb-anchor__item--sub"
            :class="{ 'kb-anchor__item--active': activeHref === child.href }"
          >
            <a class="kb-anchor__link" :href="child.href" @click="handleClick($event, child.href)">
              {{ child.title }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
