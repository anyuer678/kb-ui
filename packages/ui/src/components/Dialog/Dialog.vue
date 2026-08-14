<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({ name: 'KbDialog' })

export interface DialogProps {
  modelValue?: boolean
  title?: string
  width?: string | number
  closeOnClickOverlay?: boolean
  /** 是否支持 ESC 关闭（默认 true） */
  closeOnEsc?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: '',
  width: 480,
  closeOnClickOverlay: true,
  closeOnEsc: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const dialogRef = ref<HTMLDivElement | null>(null)
const previouslyFocused = ref<HTMLElement | null>(null)

const dialogStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}))

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick() {
  if (props.closeOnClickOverlay) close()
}

// 打开时聚焦对话框（供键盘用户），关闭后还原焦点
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      previouslyFocused.value = document.activeElement as HTMLElement | null
      nextTick(() => dialogRef.value?.focus())
    } else if (previouslyFocused.value?.isConnected) {
      previouslyFocused.value.focus()
    }
  },
)

function handleKeydown(event: KeyboardEvent) {
  if (props.closeOnEsc && event.key === 'Escape' && props.modelValue) close()
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="kb-dialog-overlay"
      @click.self="handleOverlayClick"
    >
      <div
        ref="dialogRef"
        class="kb-dialog"
        :style="dialogStyle"
        role="dialog"
        aria-modal="true"
        :aria-label="title || '对话框'"
        tabindex="-1"
      >
        <header v-if="title" class="kb-dialog__header">{{ title }}</header>
        <div class="kb-dialog__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="kb-dialog__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>
