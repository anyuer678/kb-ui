<script setup lang="ts">
import { ref } from 'vue'

const dark = ref(false)

function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
}
</script>

<template>
  <main class="page">
    <h1>{{projectName}}</h1>
    <p class="subtitle">基于 @kb/ui 的 Vue 3 + Vite + TypeScript 项目</p>

    <div class="actions">
      <KbButton type="primary" @click="toggleTheme">
        切换到{{ dark ? '亮色' : '暗色' }}主题
      </KbButton>
      <KbButton plain>普通按钮</KbButton>
    </div>
  </main>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
  padding: 80px 24px;
  font-family: var(--kb-font-family);
  text-align: center;
}

.subtitle {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.actions {
  display: flex;
  justify-content: center;
  gap: var(--kb-space-2);
  margin-top: 32px;
}
</style>
