import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import KbUpload from '../Upload.vue'

interface FakeXHR {
  status: number
  responseText: string
  withCredentials: boolean
  open: ReturnType<typeof vi.fn>
  send: ReturnType<typeof vi.fn>
  setRequestHeader: ReturnType<typeof vi.fn>
  upload: { addEventListener: (t: string, cb: (e?: unknown) => void) => void }
  addEventListener: (t: string, cb: (e?: unknown) => void) => void
  __emit: (evt: string, arg?: unknown) => void
}

function createFakeXHR(): FakeXHR {
  const handlers: Record<string, Array<(e?: unknown) => void>> = {}
  const xhr = {
    status: 0,
    responseText: '',
    withCredentials: false,
    open: vi.fn(),
    send: vi.fn(),
    setRequestHeader: vi.fn(),
    upload: {
      addEventListener: (t: string, cb: (e?: unknown) => void) => {
        ;(handlers[`upload:${t}`] ||= []).push(cb)
      },
    },
    addEventListener: (t: string, cb: (e?: unknown) => void) => {
      ;(handlers[t] ||= []).push(cb)
    },
    __emit: (evt: string, arg?: unknown) => {
      for (const cb of handlers[evt] ?? []) cb(arg)
    },
    __handlers: handlers,
  }
  return xhr
}

function pickFile(wrapper: ReturnType<typeof mount>, name = 'a.png') {
  const file = new File(['x'], name, { type: 'image/png' })
  Object.defineProperty(wrapper.find('input').element, 'files', { value: [file] })
  return wrapper.find('input').trigger('change')
}

describe('KbUpload 基础行为（无 action = 纯文件选择器）', () => {
  it('渲染选择按钮', () => {
    const wrapper = mount(KbUpload)
    expect(wrapper.find('.kb-upload__button').exists()).toBe(true)
  })

  it('选择文件加入列表', async () => {
    const wrapper = mount(KbUpload)
    await pickFile(wrapper, 'test.txt')
    expect(wrapper.find('.kb-upload__name').text()).toContain('test.txt')
  })

  it('删除文件', async () => {
    const wrapper = mount(KbUpload)
    await pickFile(wrapper, 'test.txt')
    await wrapper.find('.kb-upload__delete').trigger('click')
    expect(wrapper.find('.kb-upload__item').exists()).toBe(false)
  })
})

describe('KbUpload 上传能力（配置 action）', () => {
  let fake: ReturnType<typeof createFakeXHR>

  beforeEach(() => {
    fake = createFakeXHR()
    vi.stubGlobal('XMLHttpRequest', function () { return fake })
  })
  afterEach(() => vi.unstubAllGlobals())

  it('选择文件立即发起 POST 上传，FormData 携带文件', async () => {
    const wrapper = mount(KbUpload, { props: { action: '/api/upload' } })
    await pickFile(wrapper, 'a.png')
    expect(fake.open).toHaveBeenCalledWith('POST', '/api/upload')
    expect(fake.send).toHaveBeenCalledTimes(1)
    const fd = (fake as { send: ReturnType<typeof vi.fn> }).send.mock.calls[0][0] as FormData
    expect(fd.get('file')).toBeInstanceOf(File)
  })

  it('上报 progress 与 success，状态显示已上传', async () => {
    const wrapper = mount(KbUpload, { props: { action: '/api/upload' } })
    await pickFile(wrapper, 'a.png')
    fake.__emit('upload:progress', { lengthComputable: true, loaded: 50, total: 100 })
    expect(wrapper.emitted('progress')).toBeTruthy()
    fake.status = 200
    fake.responseText = '{"ok":true}'
    fake.__emit('load')
    await wrapper.vm.$nextTick()
    const success = wrapper.emitted('success')
    expect(success).toBeTruthy()
    expect((success![0][0] as { file: { name: string } }).file.name).toBe('a.png')
    expect(wrapper.find('.kb-upload__status--success').exists()).toBe(true)
  })

  it('非 2xx 响应上报 error，状态显示上传失败', async () => {
    const wrapper = mount(KbUpload, { props: { action: '/api/upload' } })
    await pickFile(wrapper, 'a.png')
    fake.status = 500
    fake.__emit('load')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('error')).toBeTruthy()
    expect(wrapper.find('.kb-upload__status--error').exists()).toBe(true)
  })

  it('携带自定义请求头与 withCredentials', async () => {
    const wrapper = mount(KbUpload, {
      props: { action: '/api/upload', headers: { 'X-Token': 'abc' }, withCredentials: true },
    })
    await pickFile(wrapper, 'a.png')
    expect(fake.setRequestHeader).toHaveBeenCalledWith('X-Token', 'abc')
    expect(fake.withCredentials).toBe(true)
  })
})
