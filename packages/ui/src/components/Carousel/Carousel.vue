<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'KbCarousel' })

export interface CarouselItem {
  title: string
  description?: string
}

export interface CarouselProps {
  items: CarouselItem[]
  /** 高度（px） */
  height?: number
  /** 自动播放间隔（ms，0 关闭） */
  autoplay?: number
}

const props = withDefaults(defineProps<CarouselProps>(), {
  items: () => [],
  height: 180,
  autoplay: 0,
})

const current = ref(0)
const count = computed(() => props.items.length)

function goTo(index: number) {
  current.value = ((index % count.value) + count.value) % count.value
}

function next() {
  goTo(current.value + 1)
}

function prev() {
  goTo(current.value - 1)
}
</script>

<template>
  <div class="kb-carousel" :style="{ height: `${height}px` }">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="kb-carousel__item"
      :class="{ 'kb-carousel__item--active': index === current }"
    >
      <div class="kb-carousel__content">
        <div class="kb-carousel__title">{{ item.title }}</div>
        <div v-if="item.description" class="kb-carousel__description">{{ item.description }}</div>
      </div>
    </div>
    <button class="kb-carousel__prev" type="button" aria-label="上一张" @click="prev">‹</button>
    <button class="kb-carousel__next" type="button" aria-label="下一张" @click="next">›</button>
    <div class="kb-carousel__dots">
      <button
        v-for="(_, index) in items"
        :key="index"
        class="kb-carousel__dot"
        :class="{ 'kb-carousel__dot--active': index === current }"
        type="button"
        :aria-label="`第 ${index + 1} 张`"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>
