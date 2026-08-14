<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'KbCascader' })

export interface CascaderOption {
  label: string
  value: string | number
  children?: CascaderOption[]
}

export interface CascaderProps {
  options: CascaderOption[]
  modelValue?: (string | number)[]
  placeholder?: string
}

const props = withDefaults(defineProps<CascaderProps>(), {
  options: () => [],
  modelValue: () => [],
  placeholder: '请选择',
})

const emit = defineEmits<{ 'update:modelValue': [value: (string | number)[]] }>()

const open = ref(false)
const levels = ref<CascaderOption[][]>([])

const displayText = computed(() => {
  const parts: string[] = []
  let current: CascaderOption[] = props.options
  for (const value of props.modelValue) {
    const found = current.find((o) => o.value === value)
    if (!found) break
    parts.push(found.label)
    current = found.children ?? []
  }
  return parts.join(' / ') || props.placeholder
})

function showLevel(level: number) {
  if (level === 0) {
    levels.value = [props.options]
  } else {
    // 根据已选值构建下一级
    let current = props.options
    const next: CascaderOption[][] = []
    for (const value of props.modelValue.slice(0, level)) {
      current = current.find((o) => o.value === value)?.children ?? []
      next.push(current)
    }
    levels.value = next.length ? next : [props.options]
  }
}

function select(option: CascaderOption, level: number) {
  const next = [...props.modelValue.slice(0, level), option.value]
  emit('update:modelValue', next)
  if (option.children?.length) {
    levels.value = levels.value.slice(0, level + 1)
    levels.value.push(option.children)
  } else {
    open.value = false
  }
}
</script>

<template>
  <div class="kb-cascader">
    <div class="kb-cascader__trigger" tabindex="0" @click="open = !open; showLevel(0)">
      <span :class="{ 'kb-cascader__placeholder': displayText === placeholder }">{{ displayText }}</span>
      <span class="kb-cascader__arrow">▾</span>
    </div>
    <div v-if="open" class="kb-cascader__panel">
      <div v-for="(list, level) in levels" :key="level" class="kb-cascader__column">
        <div
          v-for="option in list"
          :key="option.value"
          class="kb-cascader__option"
          :class="{ 'kb-cascader__option--active': props.modelValue[level] === option.value }"
          @click="select(option, level)"
        >
          {{ option.label }}
          <span v-if="option.children?.length" class="kb-cascader__more">›</span>
        </div>
      </div>
    </div>
  </div>
</template>
