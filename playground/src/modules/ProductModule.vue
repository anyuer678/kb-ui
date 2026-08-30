<script setup lang="ts">
import { KbCard, KbButton, KbTag, KbRate, message } from 'kb-ui-vue'

const products = [
  { name: 'KB 主题包', desc: '30 套风格主题一键换肤', price: 49, rating: 5, tag: '热门' },
  { name: '组件源码', desc: '45+ 组件完整 TypeScript 源码', price: 199, rating: 5, tag: '旗舰' },
  { name: '模块模板', desc: '12 个完整页面模板', price: 99, rating: 4, tag: '精选' },
  { name: '脚手架 CLI', desc: 'create-kb 一键生成项目', price: 29, rating: 4, tag: '入门' },
]

function buy(name: string) {
  message.success(`已将「${name}」加入购物车（演示）`)
}
</script>

<template>
  <div class="product-module">
    <div v-for="p in products" :key="p.name" class="product-module__card">
      <KbCard shadow="hover">
        <div class="product-module__cover">{{ p.name.slice(0, 2) }}</div>
        <div class="product-module__body">
          <div class="product-module__head">
            <h4 class="product-module__name">{{ p.name }}</h4>
            <KbTag v-if="p.tag" type="danger" size="small">{{ p.tag }}</KbTag>
          </div>
          <p class="product-module__desc">{{ p.desc }}</p>
          <KbRate :model-value="p.rating" disabled />
          <div class="product-module__foot">
            <span class="product-module__price">¥{{ p.price }}</span>
            <KbButton type="primary" size="small" @click="buy(p.name)">购买</KbButton>
          </div>
        </div>
      </KbCard>
    </div>
  </div>
</template>

<style scoped>
.product-module {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--kb-space-3);
}

.product-module__cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: linear-gradient(135deg, var(--kb-color-primary), color-mix(in srgb, var(--kb-color-primary) 40%, transparent));
  color: var(--kb-color-bg);
  font-size: 32px;
  font-weight: 700;
}

.product-module__body {
  padding: var(--kb-space-3);
}

.product-module__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--kb-space-2);
}

.product-module__name {
  margin: 0;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-md);
}

.product-module__desc {
  margin: var(--kb-space-1) 0 var(--kb-space-2);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.product-module__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--kb-space-2);
}

.product-module__price {
  color: var(--kb-color-danger);
  font-size: var(--kb-font-size-lg);
  font-weight: 600;
}

@media (max-width: 720px) {
  .product-module {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
