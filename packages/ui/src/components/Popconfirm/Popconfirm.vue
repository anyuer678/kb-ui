<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({ name: 'KbPopconfirm' })

export interface PopconfirmProps {
  title: string
  /** 确定按钮文字 */
  confirmText?: string
  cancelText?: string
}

withDefaults(defineProps<PopconfirmProps>(), {
  confirmText: '确定',
  cancelText: '取消',
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const open = ref(false)
const rootEl = ref<HTMLDivElement | null>(null)

function handleConfirm() {
  emit('confirm')
  open.value = false
}

function handleCancel() {
  emit('cancel')
  open.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  }
}

function handleOutside(event: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', handleOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleOutside))
</script>

<template>
  <div
    ref="rootEl"
    class="kb-popconfirm"
    :aria-expanded="open"
    @click="open = !open"
    @keydown="handleKeydown"
  >
    <slot />
    <div
      v-if="open"
      class="kb-popconfirm__panel"
      role="dialog"
      aria-modal="false"
      @click.stop
    >
      <div class="kb-popconfirm__title">{{ title }}</div>
      <div class="kb-popconfirm__actions">
        <button class="kb-popconfirm__cancel" type="button" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="kb-popconfirm__ok" type="button" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
