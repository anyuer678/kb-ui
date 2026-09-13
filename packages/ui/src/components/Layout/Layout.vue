<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { LAYOUT_CONTEXT_KEY } from './constants'

defineOptions({ name: 'KbLayout' })

export interface LayoutProps {
  /** 布局方向；不传时按是否含 Sider 自动判断 */
  direction?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<LayoutProps>(), {
  direction: undefined,
})

/** 已挂载的 Sider 数量：>0 说明是「侧边 + 内容」的水平布局 */
const siderCount = ref(0)

provide(LAYOUT_CONTEXT_KEY, {
  registerSider: () => {
    siderCount.value++
    return () => {
      siderCount.value--
    }
  },
})

const resolvedDirection = computed<'horizontal' | 'vertical'>(
  () => props.direction ?? (siderCount.value > 0 ? 'horizontal' : 'vertical'),
)
</script>

<template>
  <section class="kb-layout" :class="`kb-layout--${resolvedDirection}`">
    <slot />
  </section>
</template>
