<script setup lang="ts">
import { ref } from 'vue'
import { KbSearch, KbTag, message } from 'kb-ui-vue'

const results = ref([
  { title: '组件库主题系统设计', snippet: 'CSS 变量驱动的多主题架构…', tag: '组件库' },
  { title: '从零搭建 Monorepo', snippet: 'pnpm workspace 最佳实践…', tag: '工程化' },
  { title: 'Vitepress 文档站实践', snippet: '组件文档自动生成方案…', tag: '文档' },
  { title: 'Electron 桌面应用开发', snippet: '主进程与渲染进程通信…', tag: '桌面' },
])
const keyword = ref('')

function doSearch(q: string) {
  keyword.value = q
  if (!q) {
    results.value = []
    return
  }
  message.info(`搜索「${q}」，共 ${results.value.length} 条（演示）`)
}
</script>

<template>
  <div class="search-module">
    <div class="search-module__bar">
      <KbSearch v-model="keyword" placeholder="搜索组件、文档、模块…" @search="doSearch" />
    </div>
    <div v-if="keyword" class="search-module__results">
      <div v-for="(item, index) in results" :key="index" class="search-module__result" @click="message.info(`打开：${item.title}（演示）`)">
        <div class="search-module__title">{{ item.title }}</div>
        <div class="search-module__snippet">{{ item.snippet }}</div>
        <KbTag size="small" type="info">{{ item.tag }}</KbTag>
      </div>
    </div>
    <p v-else class="search-module__hint">输入关键词搜索，按回车或点击搜索按钮</p>
  </div>
</template>

<style scoped>
.search-module {
  max-width: 600px;
}

.search-module__bar {
  margin-bottom: var(--kb-space-3);
}

.search-module__result {
  cursor: pointer;
}

.search-module__title {
  color: var(--kb-color-primary);
  font-size: var(--kb-font-size-md);
}

.search-module__snippet {
  margin: 2px 0;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.search-module__hint {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
  text-align: center;
  padding: var(--kb-space-6) 0;
}
</style>
