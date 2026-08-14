<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'KbUpload' })

export interface UploadFile {
  name: string
  size: number
}

export interface UploadProps {
  /** 接受的文件类型 */
  accept?: string
  multiple?: boolean
}

const props = withDefaults(defineProps<UploadProps>(), {
  accept: '',
  multiple: false,
})

const emit = defineEmits<{
  change: [files: UploadFile[]]
  remove: [file: UploadFile]
}>()

const files = ref<UploadFile[]>([])

function formatSize(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function handleChange(event: Event) {
  const input = event.target as HTMLInputElement
  const selected = Array.from(input.files ?? []).map((f) => ({ name: f.name, size: f.size }))
  files.value = props.multiple ? [...files.value, ...selected] : selected
  emit('change', selected)
  input.value = ''
}

function remove(file: UploadFile) {
  files.value = files.value.filter((f) => f !== file)
  emit('remove', file)
}
</script>

<template>
  <div class="kb-upload">
    <label class="kb-upload__button">
      <input
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleChange"
      />
      选择文件
    </label>
    <div v-if="files.length" class="kb-upload__list">
      <div v-for="file in files" :key="file.name" class="kb-upload__item">
        <span class="kb-upload__icon">📄</span>
        <span class="kb-upload__name">{{ file.name }}</span>
        <span class="kb-upload__size">{{ formatSize(file.size) }}</span>
        <button class="kb-upload__delete" type="button" aria-label="删除" @click="remove(file)">×</button>
      </div>
    </div>
  </div>
</template>
