---
'kb-ui-vue': minor
---

新增 11 个组件，补齐表单、图片、滚动与浮层四类常见场景。

**表单**

- `AutoComplete` 自动补全：本地过滤 + `fetchSuggestions` 远程取数，支持上下键导航
- `TreeSelect` 树选择：下拉面板内展开树形结构，`defaultExpandAll` 可默认全展开
- `TimePicker` 时间选择：时 / 分 / 秒三列，`format` 含 `ss` 时启用秒列，支持 `minuteStep`

**图片**

- `Image` 图片：加载失败 `fallback` 兜底、点击打开预览、`previewList` 多图切换
- `ImagePreview` 图片预览：全屏查看器，支持缩放（`0.25 ~ 5`）、旋转、左右切换与键盘操作

**滚动与定位**

- `BackTop` 回到顶部：`requestAnimationFrame` + easeOutCubic 动画，可监听自定义滚动容器
- `Affix` 固钉：按 `offsetTop` / `offsetBottom` 吸附，保留占位元素避免布局跳动，`target` 限定边界容器
- `Anchor` 锚点：滚动监听高亮当前锚点，支持嵌套与平滑跳转

**浮层与布局**

- `Splitter` 分隔面板：拖拽调整相邻面板占比，`min` 限制下限，方向键可微调
- `Tour` 漫游式引导：分步高亮目标元素并展示气泡说明，支持跳过与遮罩关闭
- `ContextMenu` 右键菜单：位置按视口边界自动修正，支持禁用项与 `close()` 实例方法

所有新组件均已接入 `ConfigProvider` 的语言包与尺寸配置，并补齐单元测试与文档页面。
