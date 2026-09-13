---
'kb-ui-vue': minor
---

新增 16 个组件，补齐表单、图片、滚动、浮层与布局五类常见场景，并修复一处 SSR 缺陷。

**表单（3）**

- `AutoComplete` 自动补全：本地过滤 + `fetchSuggestions` 远程取数，支持上下键导航
- `TreeSelect` 树选择：下拉面板内展开树形结构，`defaultExpandAll` 可默认全展开
- `TimePicker` 时间选择：时 / 分 / 秒三列，`format` 含 `ss` 时启用秒列，支持 `minuteStep`

**图片（2）**

- `Image` 图片：加载失败 `fallback` 兜底、点击打开预览、`previewList` 多图切换
- `ImagePreview` 图片预览：全屏查看器，支持缩放（`0.25 ~ 5`）、旋转、左右切换与键盘操作

**滚动与定位（3）**

- `BackTop` 回到顶部：`requestAnimationFrame` + easeOutCubic 动画，可监听自定义滚动容器
- `Affix` 固钉：按 `offsetTop` / `offsetBottom` 吸附，保留占位元素避免布局跳动，`target` 同时作为滚动监听来源与边界容器
- `Anchor` 锚点：滚动监听高亮当前锚点，支持嵌套与平滑跳转

**浮层与布局（4）**

- `Splitter` 分隔面板：拖拽调整相邻面板占比，`min` 限制下限，方向键可微调
- `Tour` 漫游式引导：分步高亮目标元素并展示气泡说明，支持跳过与遮罩关闭
- `ContextMenu` 右键菜单：位置按视口边界自动修正，支持禁用项与 `close()` 实例方法
- `Layout` 布局：`Layout` / `Header` / `Sider` / `Content` / `Footer` 组合，Sider 可折叠并注入 `layout.sider.collapse/expand` 文案

**悬浮与高级输入 / 列表 / 码（4）**

- `FloatButton` / `FloatButtonGroup` 悬浮按钮：圆形 / 方形、多尺寸，组内可受控展开收起
- `Mentions` @ 提及：textarea 内 `@` 触发下拉，支持过滤、禁用项与受控值
- `VirtualList` 虚拟列表：定高窗口化渲染，只渲染可视区 + 缓冲区，含 `scroll` / `reachEnd` 事件；已修复 SSR 无 `items` 默认值时渲染崩溃
- `QRCode` 二维码：零运行时依赖的自研 ISO 18004 编码器（GF(256) / Reed-Solomon / 8 掩码自动优选），SVG 单 `<path>` 渲染，与参考库 `qrcode` 逐位交叉验证一致

所有新组件均已接入 `ConfigProvider` 的语言包与尺寸配置，并补齐单元测试、playground 演示与按需引入。
