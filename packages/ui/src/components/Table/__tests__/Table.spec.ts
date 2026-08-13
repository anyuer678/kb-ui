import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTable from '../Table.vue'

const data = [
  { name: '张三', age: 18 },
  { name: '李四', age: 20 },
]

const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
]

describe('KbTable', () => {
  it('渲染表头 label', () => {
    const wrapper = mount(KbTable, { props: { data, columns } })
    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(2)
    expect(headers[0].text()).toContain('姓名')
    expect(headers[1].text()).toContain('年龄')
  })

  it('渲染行数据', () => {
    const wrapper = mount(KbTable, { props: { data, columns } })
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('张三')
    expect(rows[0].text()).toContain('18')
  })

  it('cell scoped slot 覆盖默认值', () => {
    const wrapper = mount(KbTable, {
      props: { data, columns },
      slots: {
        cell: '<template #cell="{ row, column }">{{ column.prop }}-{{ row.name }}</template>',
      },
    })
    const firstCell = wrapper.findAll('tbody td')[0]
    expect(firstCell.text()).toContain('name-张三')
  })

  it('stripe 应用条纹 class', () => {
    const wrapper = mount(KbTable, { props: { data, columns, stripe: true } })
    expect(wrapper.classes()).toContain('kb-table--stripe')
  })
})
