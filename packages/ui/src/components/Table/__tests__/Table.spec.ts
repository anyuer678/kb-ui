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
    expect(wrapper.find('table').classes()).toContain('kb-table--stripe')
  })

  it('size=small 应用尺寸 class', () => {
    const wrapper = mount(KbTable, { props: { data, columns, size: 'small' } })
    expect(wrapper.find('table').classes()).toContain('kb-table--small')
  })

  it('空数据渲染 emptyText', () => {
    const wrapper = mount(KbTable, { props: { data: [], columns, emptyText: '没有记录' } })
    const empty = wrapper.find('.kb-table__empty')
    expect(empty.exists()).toBe(true)
    expect(empty.text()).toBe('没有记录')
  })

  it('pageSize 生效并复用分页组件', () => {
    const many = Array.from({ length: 25 }, (_, i) => ({ name: `n${i}`, age: i }))
    const wrapper = mount(KbTable, { props: { data: many, columns, pageSize: 10 } })
    expect(wrapper.findAll('tbody tr')).toHaveLength(10)
    expect(wrapper.find('.kb-table__pagination').exists()).toBe(true)
    expect(wrapper.find('.kb-pagination').exists()).toBe(true)
  })

  it('sortable: true 由组件内部排序', async () => {
    const descData = [
      { name: '李四', age: 20 },
      { name: '张三', age: 18 },
    ]
    const sortColumns = [{ prop: 'age', label: '年龄', sortable: true }]
    const wrapper = mount(KbTable, { props: { data: descData, columns: sortColumns } })
    await wrapper.find('th').trigger('click')
    expect(wrapper.findAll('tbody td')[0].text()).toBe('18')
  })

  it("sortable: 'custom' 不内部排序，仅派发 sort-change", async () => {
    const descData = [
      { name: '李四', age: 20 },
      { name: '张三', age: 18 },
    ]
    const sortColumns = [{ prop: 'age', label: '年龄', sortable: 'custom' as const }]
    const wrapper = mount(KbTable, { props: { data: descData, columns: sortColumns } })
    await wrapper.find('th').trigger('click')
    expect(wrapper.emitted('sort-change')?.[0]).toEqual(['age', 'asc'])
    expect(wrapper.findAll('tbody td')[0].text()).toBe('20')
  })

  it('固定列渲染 sticky 偏移与固定列 class', () => {
    const fixedColumns = [
      { prop: 'name', label: '姓名', width: 120, fixed: 'left' as const },
      { prop: 'city', label: '城市' },
      { prop: 'age', label: '年龄', width: 100, fixed: 'right' as const },
    ]
    const wrapper = mount(KbTable, { props: { data, columns: fixedColumns } })
    expect(wrapper.find('table').classes()).toContain('kb-table--fixed-cols')

    const headers = wrapper.findAll('th')
    expect(headers[0].classes()).toContain('kb-table__cell--fixed-left')
    expect(headers[0].attributes('style')).toContain('left: 0px')
    expect(headers[2].classes()).toContain('kb-table__cell--fixed-right')
    expect(headers[2].attributes('style')).toContain('right: 0px')
  })

  it('selection 打开后多出选择列', () => {
    const wrapper = mount(KbTable, { props: { data, columns, selection: true, rowKey: 'name' } })
    expect(wrapper.findAll('th')).toHaveLength(3)
    expect(wrapper.findAll('tbody .kb-checkbox')).toHaveLength(2)
  })

  it('勾选单行派发 update:selectedKeys', async () => {
    const wrapper = mount(KbTable, {
      props: { data, columns, selection: true, rowKey: 'name' },
    })
    await wrapper.findAll('tbody .kb-checkbox input')[0].setValue(true)
    expect(wrapper.emitted('update:selectedKeys')?.[0][0]).toEqual(['张三'])
    expect(wrapper.emitted('selection-change')?.[0][0]).toEqual(['张三'])
  })

  it('表头全选派发当前页所有 key', async () => {
    const wrapper = mount(KbTable, {
      props: { data, columns, selection: true, rowKey: 'name' },
    })
    await wrapper.find('thead .kb-checkbox input').setValue(true)
    expect(wrapper.emitted('update:selectedKeys')?.[0][0]).toEqual(['张三', '李四'])
  })

  it('部分选中时表头为半选态，全选时为勾选态', () => {
    const partial = mount(KbTable, {
      props: { data, columns, selection: true, rowKey: 'name', selectedKeys: ['张三'] },
    })
    const partialInput = partial.find('thead input').element as HTMLInputElement
    expect(partialInput.indeterminate).toBe(true)
    expect(partialInput.checked).toBe(false)

    const all = mount(KbTable, {
      props: { data, columns, selection: true, rowKey: 'name', selectedKeys: ['张三', '李四'] },
    })
    const allInput = all.find('thead input').element as HTMLInputElement
    expect(allInput.indeterminate).toBe(false)
    expect(allInput.checked).toBe(true)
  })
})
