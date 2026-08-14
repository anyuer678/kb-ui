<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'KbTransfer' })

export interface TransferItem {
  key: string
  label: string
}

export interface TransferProps {
  data: TransferItem[]
  modelValue?: string[]
}

const props = withDefaults(defineProps<TransferProps>(), {
  data: () => [],
  modelValue: () => [],
})

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const leftSelected = ref<string[]>([])
const rightSelected = ref<string[]>([])

const leftItems = computed(() => props.data.filter((d) => !props.modelValue.includes(d.key)))
const rightItems = computed(() => props.data.filter((d) => props.modelValue.includes(d.key)))

function toggle(key: string, side: 'left' | 'right') {
  const target = side === 'left' ? leftSelected : rightSelected
  const next = new Set(target.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  target.value = [...next]
}

function move(toRight: boolean) {
  const source = toRight ? leftSelected.value : rightSelected.value
  const next = toRight
    ? [...props.modelValue, ...source]
    : props.modelValue.filter((k) => !source.includes(k))
  emit('update:modelValue', next)
  leftSelected.value = []
  rightSelected.value = []
}
</script>

<template>
  <div class="kb-transfer">
    <div class="kb-transfer__box kb-transfer__left">
      <div class="kb-transfer__title">待选</div>
      <div
        v-for="item in leftItems"
        :key="item.key"
        class="kb-transfer__item"
        :class="{ 'kb-transfer__item--selected': leftSelected.includes(item.key) }"
        @click="toggle(item.key, 'left')"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="kb-transfer__actions">
      <button class="kb-transfer__move kb-transfer__move--right" type="button" :disabled="!leftSelected.length" @click="move(true)">
        →
      </button>
      <button class="kb-transfer__move kb-transfer__move--left" type="button" :disabled="!rightSelected.length" @click="move(false)">
        ←
      </button>
    </div>
    <div class="kb-transfer__box kb-transfer__right">
      <div class="kb-transfer__title">已选</div>
      <div
        v-for="item in rightItems"
        :key="item.key"
        class="kb-transfer__item"
        :class="{ 'kb-transfer__item--selected': rightSelected.includes(item.key) }"
        @click="toggle(item.key, 'right')"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
