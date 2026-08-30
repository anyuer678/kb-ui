<script setup lang="ts">
import { ref } from 'vue'
import { KbInput, KbButton, KbAvatar, KbTag, message } from 'kb-ui-vue'

interface Comment {
  author: string
  content: string
  time: string
  likes: number
}

const comments = ref<Comment[]>([
  { author: '前端小白', content: '写得太好了，学到很多！', time: '10 分钟前', likes: 12 },
  { author: 'Vue 爱好者', content: '主题系统设计很巧妙，收藏了。', time: '2 小时前', likes: 8 },
  { author: '组件库作者', content: '感谢分享，正是我需要的方案。', time: '昨天', likes: 25 },
])
const input = ref('')

function submit() {
  const text = input.value.trim()
  if (!text) return
  comments.value.unshift({ author: '我', content: text, time: '刚刚', likes: 0 })
  input.value = ''
  message.success('评论成功（演示）')
}

function like(c: Comment) {
  c.likes++
}
</script>

<template>
  <div class="comments-module">
    <h3 class="comments-module__title">评论（{{ comments.length }}）</h3>
    <div class="comments-module__input">
      <KbInput v-model="input" placeholder="写下你的评论…" @keyup.enter="submit" style="flex: 1" />
      <KbButton type="primary" @click="submit">发表</KbButton>
    </div>
    <div v-for="(c, i) in comments" :key="i" class="comments-module__item">
      <KbAvatar :fallback="c.author[0]" :size="36" round />
      <div class="comments-module__main">
        <div class="comments-module__meta">
          <span class="comments-module__author">{{ c.author }}</span>
          <KbTag v-if="c.author === '我'" type="primary" size="small">我</KbTag>
          <span class="comments-module__time">{{ c.time }}</span>
        </div>
        <div class="comments-module__content">{{ c.content }}</div>
        <button class="comments-module__like" type="button" @click="like(c)">👍 {{ c.likes }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-module {
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.comments-module__title {
  margin: 0;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-lg);
}

.comments-module__input {
  display: flex;
  gap: var(--kb-space-2);
}

.comments-module__item {
  display: flex;
  gap: var(--kb-space-2);
  padding: var(--kb-space-3);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-md);
  background: var(--kb-color-bg);
}

.comments-module__meta {
  display: flex;
  align-items: center;
  gap: var(--kb-space-1);
}

.comments-module__author {
  color: var(--kb-color-primary);
  font-size: var(--kb-font-size-sm);
  font-weight: 600;
}

.comments-module__time {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-xs);
}

.comments-module__content {
  margin: var(--kb-space-1) 0;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-md);
}

.comments-module__like {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
  cursor: pointer;
}
</style>
