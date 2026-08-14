import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbForm from '../Form.vue'
import KbFormItem from '../FormItem.vue'

const mountForm = (model: Record<string, unknown>, rules: Record<string, unknown[]>) =>
  mount({
    components: { KbForm, KbFormItem },
    template: `
      <kb-form :model="model" :rules="rules" ref="formRef">
        <kb-form-item label="姓名" prop="name"><input v-model="model.name" /></kb-form-item>
        <kb-form-item label="邮箱" prop="email"><input v-model="model.email" /></kb-form-item>
      </kb-form>`,
    data: () => ({ model, rules }),
  })

describe('KbForm', () => {
  it('渲染表单项', () => {
    const wrapper = mountForm({ name: '', email: '' }, {})
    expect(wrapper.findAll('.kb-form-item')).toHaveLength(2)
    expect(wrapper.find('.kb-form-item__label').text()).toContain('姓名')
  })

  it('校验失败显示错误', async () => {
    const wrapper = mountForm(
      { name: '', email: '' },
      { name: [{ required: true, message: '请输入姓名' }] },
    )
    const form = wrapper.findComponent(KbForm)
    const result = await (form.vm as unknown as { validate: () => Promise<boolean> }).validate()
    expect(result).toBe(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.kb-form-item__error').exists()).toBe(true)
    expect(wrapper.find('.kb-form-item__error').text()).toContain('请输入姓名')
  })

  it('校验通过', async () => {
    const wrapper = mountForm(
      { name: '张三', email: 'a@b.c' },
      { name: [{ required: true, message: '请输入姓名' }] },
    )
    const form = wrapper.findComponent(KbForm)
    const result = await (form.vm as unknown as { validate: () => Promise<boolean> }).validate()
    expect(result).toBe(true)
  })
})
