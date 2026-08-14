<script setup lang="ts">
import { ref } from 'vue'
import { KbCard, KbButton, KbInputNumber, KbDivider, KbTag, message } from '@kb/ui'

interface CartItem {
  name: string
  price: number
  count: number
}

const items = ref<CartItem[]>([
  { name: 'KB 主题包', price: 49, count: 1 },
  { name: '组件源码', price: 199, count: 1 },
  { name: '模块模板', price: 99, count: 2 },
])

const total = ref(0)
const computeTotal = () => {
  total.value = items.value.reduce((sum, i) => sum + i.price * i.count, 0)
}
computeTotal()

function checkout() {
  message.success(`订单提交成功，合计 ¥${total.value}（演示）`)
}
</script>

<template>
  <div class="checkout-module">
    <KbCard title="购物车">
      <div v-for="(item, i) in items" :key="item.name" class="checkout-module__row">
        <span class="checkout-module__name">{{ item.name }}</span>
        <span class="checkout-module__price">¥{{ item.price }}</span>
        <KbInputNumber v-model="item.count" :min="1" :max="99" />
        <KbTag type="primary">¥{{ item.price * item.count }}</KbTag>
        <button class="checkout-module__remove" type="button" @click="items.splice(i, 1); computeTotal()">×</button>
      </div>
      <KbDivider />
      <div class="checkout-module__summary">
        <span>共 {{ items.reduce((s, i) => s + i.count, 0) }} 件</span>
        <span class="checkout-module__total">合计 <b>¥{{ total }}</b></span>
      </div>
    </KbCard>
    <div class="checkout-module__actions">
      <KbButton type="primary" size="large" @click="checkout">提交订单</KbButton>
    </div>
  </div>
</template>

<style scoped>
.checkout-module {
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.checkout-module__row {
  display: flex;
  align-items: center;
  gap: var(--kb-space-3);
  padding: var(--kb-space-2) 0;
}

.checkout-module__name {
  flex: 1;
  color: var(--kb-color-text-1);
}

.checkout-module__price {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.checkout-module__remove {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-lg);
  cursor: pointer;
}

.checkout-module__summary {
  display: flex;
  justify-content: space-between;
  color: var(--kb-color-text-2);
}

.checkout-module__total b {
  color: var(--kb-color-danger);
  font-size: var(--kb-font-size-lg);
}

.checkout-module__actions {
  display: flex;
  justify-content: flex-end;
}
</style>
