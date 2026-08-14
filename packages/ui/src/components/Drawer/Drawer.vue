<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbDrawer' })

export interface DrawerProps {
  modelValue?: boolean
  title?: string
  /** 抽屉方向 */
  direction?: 'left' | 'right' | 'top' | 'bottom'
  width?: string | number
}

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  title: '',
  direction: 'right',
  width: 320,
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const sizeStyle = computed(() => {
  if (props.direction === 'top' || props.direction === 'bottom') {
    return { height: typeof props.width === 'number' ? `${props.width}px` : props.width }
  }
  return { width: typeof props.width === 'number' ? `${props.width}px` : props.width }
})

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="kb-drawer-overlay" @click.self="close">
      <div class="kb-drawer" :class="`kb-drawer--${direction}`" :style="sizeStyle" role="dialog" aria-modal="true">
        <header class="kb-drawer__header">
          <span>{{ title }}</span>
          <button class="kb-drawer__close" type="button" aria-label="close" @click="close">×</button>
        </header>
        <div class="kb-drawer__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="kb-drawer__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>
