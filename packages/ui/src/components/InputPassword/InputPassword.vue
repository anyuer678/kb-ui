<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbInputPassword' })

export interface InputPasswordProps {
  modelValue?: string
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<InputPasswordProps>(), {
  modelValue: '',
  placeholder: '',
  size: 'medium',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const visible = ref(false)

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="kb-input-password">
    <input
      class="kb-input-password__inner"
      :type="visible ? 'text' : 'password'"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
    />
    <button
      class="kb-input-password__toggle"
      type="button"
      :aria-label="visible ? '隐藏密码' : '显示密码'"
      @click="visible = !visible"
    >
      <Icon :name="visible ? 'info' : 'warning'" :size="16" />
    </button>
  </div>
</template>
