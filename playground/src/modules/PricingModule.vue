<script setup lang="ts">
import { ref } from 'vue'
import { KbCard, KbButton, KbTag, message } from '@kb/ui'

const plans = [
  { name: '免费版', price: 0, features: ['50 个项目', '基础组件', '社区支持'], highlight: false },
  { name: '专业版', price: 99, features: ['无限项目', '全部 50+ 组件', '30 套主题', '优先支持'], highlight: true },
  { name: '企业版', price: 499, features: ['团队协作', '私有部署', '专属客服', '定制主题'], highlight: false },
]
const yearly = ref(false)
</script>

<template>
  <div class="pricing-module">
    <div class="pricing-module__toggle">
      <KbButton :type="yearly ? 'default' : 'primary'" size="small" @click="yearly = false">月付</KbButton>
      <KbButton :type="yearly ? 'primary' : 'default'" size="small" @click="yearly = true">年付 -20%</KbButton>
    </div>
    <div class="pricing-module__grid">
      <KbCard v-for="p in plans" :key="p.name" shadow="hover" class="pricing-module__card">
        <template #default>
          <div class="pricing-module__name">
            {{ p.name }}
            <KbTag v-if="p.highlight" type="danger" size="small">推荐</KbTag>
          </div>
          <div class="pricing-module__price">
            <b>¥{{ yearly ? Math.round(p.price * 0.8) : p.price }}</b>
            <span>/{{ yearly ? '年' : '月' }}</span>
          </div>
          <ul class="pricing-module__features">
            <li v-for="f in p.features" :key="f">✓ {{ f }}</li>
          </ul>
        </template>
        <template #footer>
          <KbButton :type="p.highlight ? 'primary' : 'default'" style="width: 100%" @click="message.info(`选择${p.name}（演示）`)">
            {{ p.price === 0 ? '开始使用' : '立即订阅' }}
          </KbButton>
        </template>
      </KbCard>
    </div>
  </div>
</template>

<style scoped>
.pricing-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-4);
}

.pricing-module__toggle {
  display: flex;
  justify-content: center;
  gap: var(--kb-space-1);
}

.pricing-module__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--kb-space-3);
}

.pricing-module__name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-lg);
  font-weight: 600;
}

.pricing-module__price {
  margin: var(--kb-space-3) 0;
  color: var(--kb-color-text-1);
}

.pricing-module__price b {
  font-size: 32px;
}

.pricing-module__price span {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.pricing-module__features {
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
  line-height: 2;
}
</style>
