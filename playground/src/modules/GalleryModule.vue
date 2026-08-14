<script setup lang="ts">
import { ref } from 'vue'
import { KbTag, KbButton, message } from '@kb/ui'

const images = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: ['晨光', '山色', '海岸', '星空', '森林', '城市', '秋叶', '雪景', '云海'][i],
  color: `hsl(${(i * 40) % 360} 60% 55%)`,
}))

const selected = ref<number | null>(null)

function open(id: number) {
  selected.value = id
}
</script>

<template>
  <div class="gallery-module">
    <div class="gallery-module__grid">
      <div
        v-for="img in images"
        :key="img.id"
        class="gallery-module__item"
        :style="{ background: img.color }"
        @click="open(img.id)"
      >
        <span class="gallery-module__title">{{ img.title }}</span>
        <KbTag v-if="img.id === 1" type="danger" size="small">精选</KbTag>
      </div>
    </div>

    <div v-if="selected !== null" class="gallery-module__lightbox" @click="selected = null">
      <div class="gallery-module__lightbox-inner" :style="{ background: images[selected - 1]?.color }">
        <h3>{{ images[selected - 1]?.title }}</h3>
        <p>点击任意位置关闭</p>
        <KbButton size="small" @click.stop="message.info('下载图片（演示）')">下载</KbButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-module__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--kb-space-2);
}

.gallery-module__item {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  aspect-ratio: 4 / 3;
  padding: var(--kb-space-3);
  border-radius: var(--kb-radius-md);
  color: var(--kb-color-bg);
  cursor: pointer;
  transition: transform var(--kb-transition-duration) var(--kb-transition-timing);
}

.gallery-module__item:hover {
  transform: scale(1.02);
}

.gallery-module__title {
  font-size: var(--kb-font-size-lg);
  font-weight: 600;
  text-shadow: 0 1px 4px rgb(0 0 0 / 30%);
}

.gallery-module__lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 70%);
}

.gallery-module__lightbox-inner {
  padding: var(--kb-space-6);
  border-radius: var(--kb-radius-lg);
  color: var(--kb-color-bg);
  text-align: center;
}
</style>
