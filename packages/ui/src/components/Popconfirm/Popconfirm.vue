<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbPopconfirm' })

export interface PopconfirmProps {
  title: string
  /** 确定按钮文字，不传时取语言包中的 `popconfirm.confirmText` */
  confirmText?: string
  /** 取消按钮文字，不传时取语言包中的 `popconfirm.cancelText` */
  cancelText?: string
}

const props = withDefaults(defineProps<PopconfirmProps>(), {
  confirmText: '',
  cancelText: '',
})

const { t } = useLocale()
const confirmLabel = computed(() => props.confirmText || t('popconfirm.confirmText'))
const cancelLabel = computed(() => props.cancelText || t('popconfirm.cancelText'))

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
          {{ cancelLabel }}
        </button>
        <button class="kb-popconfirm__ok" type="button" @click="handleConfirm">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
