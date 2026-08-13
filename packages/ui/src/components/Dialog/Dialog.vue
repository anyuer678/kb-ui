<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbDialog' })

export interface DialogProps {
  modelValue?: boolean
  title?: string
  width?: string | number
  closeOnClickOverlay?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: '',
  width: 480,
  closeOnClickOverlay: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const dialogStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}))

function handleOverlayClick() {
  if (props.closeOnClickOverlay) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="kb-dialog-overlay" @click.self="handleOverlayClick">
      <div class="kb-dialog" :style="dialogStyle" role="dialog" aria-modal="true">
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
