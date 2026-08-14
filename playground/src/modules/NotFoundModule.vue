<script setup lang="ts">
import { KbButton, KbResult, KbSpace } from '@kb/ui'

function goHome() {
  window.location.hash = ''
}
</script>

<template>
  <div class="notfound-module">
    <KbResult status="error" title="404" description="你访问的页面不存在或已被移除">
      <template #action>
        <KbSpace>
          <KbButton type="primary" @click="goHome">返回首页</KbButton>
          <KbButton>联系支持</KbButton>
        </KbSpace>
      </template>
    </KbResult>
  </div>
</template>

<style scoped>
.notfound-module {
  padding: var(--kb-space-6);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
}

.notfound-module :deep(.kb-result__title) {
  font-size: 64px;
}
</style>
