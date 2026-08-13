<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({ name: 'KbSelect' })

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  modelValue?: string | number
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: undefined,
  placeholder: '',
  disabled: false,
  size: 'medium',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const open = ref(false)
const triggerEl = ref<HTMLDivElement | null>(null)

const selectedLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label ?? '',
)

const classes = computed(() => [
  'kb-select',
  `kb-select--${props.size}`,
  {
    'kb-select--open': open.value,
    'kb-select--disabled': props.disabled,
  },
])

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function selectOption(option: SelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  open.value = false
}

function handleOutsideClick(event: MouseEvent) {
  if (triggerEl.value && !triggerEl.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
  <div ref="triggerEl" :class="classes">
    <div class="kb-select__trigger" tabindex="0" @click="toggle">
      <span class="kb-select__value" :class="{ 'kb-select__placeholder': !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <span class="kb-select__arrow" aria-hidden="true">▾</span>
    </div>
    <div v-if="open" class="kb-select__panel">
      <div
        v-for="option in options"
        :key="option.value"
        class="kb-select__option"
        :class="{
          'kb-select__option--selected': option.value === modelValue,
          'kb-select__option--disabled': option.disabled,
        }"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>
