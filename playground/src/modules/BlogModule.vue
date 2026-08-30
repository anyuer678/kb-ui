<script setup lang="ts">
import { ref } from 'vue'
import { KbCard, KbTag, KbPagination, message } from 'kb-ui-vue'

const posts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: ['组件库主题系统设计', '从零搭建 Monorepo', 'Vitepress 文档站实践', 'Electron 桌面应用开发'][i % 4],
  excerpt: '这是一篇关于前端工程化与组件化实践的示例文章，涵盖架构设计、最佳实践与踩坑记录。',
  date: `2026-08-${String((i % 28) + 1).padStart(2, '0')}`,
  tag: ['工程化', '组件库', '文档', '桌面'][i % 4],
  views: 100 + i * 37,
}))

const currentPage = ref(1)
const pageSize = 6
const paged = ref(posts.slice(0, pageSize))

function onPage(page: number) {
  currentPage.value = page
  paged.value = posts.slice((page - 1) * pageSize, page * pageSize)
}

function open(title: string) {
  message.info(`打开文章：${title}（演示）`)
}
</script>

<template>
  <div class="blog-module">
    <div v-for="post in paged" :key="post.id" class="blog-module__item">
      <KbCard shadow="hover">
        <div class="blog-module__meta">
          <KbTag type="primary" size="small">{{ post.tag }}</KbTag>
          <span class="blog-module__date">{{ post.date }}</span>
          <span class="blog-module__views">{{ post.views }} 阅读</span>
        </div>
        <h3 class="blog-module__title" @click="open(post.title)">{{ post.title }}</h3>
        <p class="blog-module__excerpt">{{ post.excerpt }}</p>
      </KbCard>
    </div>
    <div class="blog-module__pager">
      <KbPagination v-model:current-page="currentPage" :total="posts.length" :page-size="pageSize" @update:current-page="onPage" />
    </div>
  </div>
</template>

<style scoped>
.blog-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.blog-module__meta {
  display: flex;
  align-items: center;
  gap: var(--kb-space-2);
  margin-bottom: var(--kb-space-2);
}

.blog-module__date,
.blog-module__views {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-xs);
}

.blog-module__title {
  margin: 0 0 var(--kb-space-2);
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-lg);
  cursor: pointer;
}

.blog-module__title:hover {
  color: var(--kb-color-primary);
}

.blog-module__excerpt {
  margin: 0;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
  line-height: 1.6;
}

.blog-module__pager {
  display: flex;
  justify-content: center;
}
</style>
