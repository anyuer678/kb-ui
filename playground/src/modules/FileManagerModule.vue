<script setup lang="ts">
import { ref } from 'vue'
import { KbTree, KbTag, KbButton, KbEmpty, message } from 'kb-ui-vue'

const treeData = [
  { label: '文档', children: [{ label: '设计文档', children: [{ label: '架构.md' }, { label: 'API.md' }] }, { label: '规范' }] },
  { label: '源码', children: [{ label: 'components', children: [{ label: 'Button.vue' }] }] },
  { label: '资源', children: [{ label: '图标' }, { label: '主题' }] },
]
const current = ref('')

function select(node: { label: string }) {
  current.value = node.label
  message.info(`打开：${node.label}（演示）`)
}
</script>

<template>
  <div class="file-module">
    <div class="file-module__tree">
      <KbTree :data="treeData" @select="select" />
    </div>
    <div class="file-module__main">
      <div class="file-module__toolbar">
        <KbTag type="primary">当前：{{ current || '未选择' }}</KbTag>
        <KbButton size="small" @click="message.success('新建文件夹（演示）')">新建</KbButton>
        <KbButton size="small" @click="message.info('上传文件（演示）')">上传</KbButton>
      </div>
      <div class="file-module__grid">
        <div v-for="name in ['报告.pdf', '截图.png', '数据.xlsx', '演示.pptx', '笔记.md', '压缩包.zip']" :key="name" class="file-module__file" @click="current = name">
          <div class="file-module__icon">📄</div>
          <span class="file-module__name">{{ name }}</span>
        </div>
      </div>
      <KbEmpty v-if="false" description="空目录" />
    </div>
  </div>
</template>

<style scoped>
.file-module {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--kb-space-3);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
  padding: var(--kb-space-3);
}

.file-module__toolbar {
  display: flex;
  align-items: center;
  gap: var(--kb-space-2);
  margin-bottom: var(--kb-space-3);
}

.file-module__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--kb-space-2);
}

.file-module__file {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kb-space-1);
  padding: var(--kb-space-3);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-md);
  cursor: pointer;
}

.file-module__file:hover {
  border-color: var(--kb-color-primary);
}

.file-module__icon {
  font-size: 28px;
}

.file-module__name {
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-xs);
}
</style>
