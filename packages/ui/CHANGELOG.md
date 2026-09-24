# @kb/ui

## 0.4.1

### Patch Changes

- fea1c8d: npm 页面观感补齐：为 kb-utils / kb-ui-vue / create-kb 补包级 README（此前 npm 页面显示 "No README data found"）；为 kb-ui-vue 与 create-kb 补 package.json description；create-kb `--template` 帮助文案列全 7 种模板并修正 description 中残留的旧包名 `@kb/ui`；kb-api 与 create-kb 的版本号改为运行时读取自身 package.json（此前 `/health` 与 `--version` 硬编码 0.1.0）。

## 0.4.0

### Minor Changes

- 19de01a: 新增 ConfigProvider 全局配置组件与国际化体系。

  **ConfigProvider**

  - 提供统一的 `locale` / `size` / `zIndex` / `theme` 配置，透传 slot、不产生额外 DOM
  - `theme="dark"` 会把 `data-theme="dark"` 同步到 `<html>`，配合内置 `dark.css` 生效
  - 配置通过 `reactive` 注入，运行时切换语言或尺寸会立即作用于整棵子树
  - 配套导出 `useGlobalConfig` / `useLocale` / `useSize` / `useZIndex`

  **国际化**

  - 内置 `zh-CN` 与 `en-US` 语言包，导出 `locales` / `getLocale` / `zhCN` / `enUS`
  - 把 15 个组件里硬编码的中文文案与无障碍标注（`aria-label`）全部抽到语言包：
    Calendar、Carousel、Cascader、ColorPicker、DatePicker、Dialog、Empty、Form、
    InputPassword、List、Pagination、Popconfirm、Search、Table、Transfer、Upload
  - 取值优先级为「显式 prop > 语言包 > 默认语言包」，未传 prop 时行为与之前一致，
    已有代码无需改动；自定义语言包缺字段会自动回退，不必抄全量

  **其他**

  - 文档站版本号改为从 `packages/ui/package.json` 读取，避免与发布版本脱节

- 19de01a: 新增 16 个组件，补齐表单、图片、滚动、浮层与布局五类常见场景，并修复一处 SSR 缺陷。

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

- 19de01a: 新增按需引入解析器与 Volar 全局组件类型。

  **按需引入**

  - 新增 `kb-ui-vue/resolver` 导出 `KbResolver`，配合 `unplugin-vue-components` 使用：

    ```ts
    import Components from 'unplugin-vue-components/vite'
    import { KbResolver } from 'kb-ui-vue/resolver'

    Components({ resolvers: [KbResolver()] })
    ```

  - 解析 `<KbButton>` 这类标签时自动注入 `import { KbButton } from 'kb-ui-vue'`
    以及对应的样式副作用 `kb-ui-vue/styles/<entry>.css`
  - 支持自定义前缀（`prefix`）与关闭样式注入（`importStyle: false`）
  - 处理了复用同一份样式的别名组件：`KbRow` / `KbCol` 归到 `Grid`，`KbFormItem` 归到 `Form`；
    `KbConfigProvider` 无独立样式，不注入 CSS

  **IDE 类型支持**

  - 新增 `kb-ui-vue/global` 类型入口，构建时由 `scripts/build-global-types.mjs` 生成
    `dist/global.d.ts`，为 `vue` 模块增补 `GlobalComponents` 声明
  - 在 `tsconfig.json` 的 `types` 中引入后，模板里使用 `<KbXxx>` 即可获得组件名提示与 props 类型，无需手动 import

  详见文档 [按需引入](/guide/on-demand)。

### Patch Changes

- 3bc1d7d: chore: docs/CI hygiene without user-facing API changes
- 89aee97: chore(deps-dev): bump dev dependencies (dev-minor-patch group)
- 4bfe3d4: chore(deps): bump vue from 3.5.41 to 3.5.42
- 7ac10c0: fix(affix): `target` 现在真正作为滚动容器生效

  此前 `KbAffix` 只监听 window 的 scroll/resize，`target` 仅被当成固定范围的边界使用。
  结果是：把 Affix 放进一个 `overflow: auto` 的容器里并传 `target` 时，滚动容器**完全不会触发**重新计算，
  组件永远不固定——而 playground 的演示恰好就是这么写的，等于演示了一个不生效的功能。

  现在 `target` 同时承担两个职责：
  - 作为滚动监听源（容器滚动即触发更新）
  - 作为固定范围的边界（固定线取「容器顶部 + offsetTop」，而不是视口顶部）

  不传 `target` 时的视口行为保持不变。

- 99a4319: Security dependency refresh (js-yaml, fast-uri, vite, electron templates).
- 1d3263a: 补强可访问性、SSR 兼容与质量门禁。

  **可访问性修复（axe-core 复现的真实缺陷）**

  - `ContextMenu`：补齐 WAI-ARIA 菜单键盘导航（↑/↓ 移动焦点、Home/End 跳转首尾、Esc 关闭），菜单项 `tabindex="-1"`，并新增 `:focus-visible` 可见焦点样式；面板补 `aria-label`
  - `Tour`：支持 Esc 关闭；气泡补 `aria-label`
  - `ImagePreview` / `Splitter`：浮层与分隔条补 `aria-label`
  - `TimePicker` / `TreeSelect`：combobox 补 `aria-label` 与 `aria-controls`（ARIA 1.2 要求），下拉面板补稳定 `id` 与名称
  - 新增 `splitter` / `contextMenu` / `tour.label` / `image.previewDialog` / `timePicker.*` / `treeSelect.label` 等国际化词条（中英双语）

  **新增测试**

  - SSR 冒烟测试：node 环境下对全部组件执行 `renderToString`，拦截未做环境判断的 `window` / `document` 访问（71 例）
  - a11y 测试：axe-core 规则校验 + 结构断言，覆盖 9 个组件（13 例）
  - 覆盖率上报：新增 `pnpm test:coverage`（v8 provider）

  **新增质量门禁**

  - `pnpm check-size`：产物原始 / gzip 体积预算，并校验单组件引入的 tree-shaking 比例（当前约 3.6%）
  - `pnpm test:visual`：重建视觉回归取样台。原用例依赖 playground 路由（该站并无路由，`/button` 等路径全部 404），实际从未跑通；现改为独立的确定性取样台，覆盖 18 个组件 × 3 套主题共 54 张基线

- b0adb10: 视觉回归覆盖补齐：Layout / FloatButton / Mentions / VirtualList / QRCode 五个组件接入取样台，新增 15 张基线（三主题）；QRCode 交叉验证测试在 coverage 插桩下的超时放宽到 30s。

## 0.3.0

### Minor Changes

- 7706553: Cascader 支持异步加载，Transfer 支持搜索与分页：

  **Cascader**

  - 新增 `lazy` / `lazyLoad`，展开面板时按需拉取根级与各级子节点，加载中的那列显示「加载中…」
  - 选项新增 `leaf` 标记，异步模式下点击即收起；`resolve` 返回空数组同样视为末级
  - 新增 `clearable` / `disabled` / `separator`（已选路径分隔符）

  **Transfer**

  - 新增 `filterable` / `filterPlaceholder`，两侧独立搜索，无匹配时显示空状态
  - 新增 `pageSize`，两侧独立分页；表头复选框作用于当前页，支持全选与半选态
  - 新增 `titles` 自定义标题（带该侧条目数量）、`disabled` 整体禁用、条目级 `disabled`
  - 新增 `change` 事件，携带穿梭方向

- 8d29575: DatePicker 支持日期范围与多选，Calendar 支持区间高亮：

  - **DatePicker** 新增 `mode`（`'single' | 'range' | 'multiple'`）：
    - `range`：第一次点击定起点、第二次点击收口成区间，倒序点击自动交换起止；重新打开面板时会沿用只剩起点的那半截区间
    - `multiple`：面板保持展开，再次点击已选日期即取消该日期
  - **DatePicker** 新增 `clearable`（清空按钮）与 `separator`（range 起止分隔符）；补上文档里已声明、但组件此前并未实现的 `disabled`
  - **DatePicker** `placeholder` 默认值改为空字符串并按模式自动生成文案（原固定为「选择日期」）；`modelValue` 类型扩展为 `string | string[]`
  - **Calendar** 新增 `range`（区间高亮）与 `marked`（额外标记）属性，并导出 `CalendarDay` 类型

- 6afc74b: Table 表格能力补全，KbCheckbox 支持半选态：

  - **Table 固定列**：新增 `TableColumn.fixed`（`'left' | 'right'`），配合 `width` 自动计算 sticky 偏移，列宽超出容器时自动横向滚动
  - **Table 行选择**：新增 `selection` 与 `v-model:selectedKeys`，表头支持全选与半选态（全选作用于当前页），并派发 `selection-change`
  - **Table 其他**：新增 `size` / `emptyText` / `TableColumn.align`；`sortable` 支持 `'custom'`（仅派发 `sort-change`，用于服务端排序）；`currentPage` 越界时自动回落到最后一页
  - **Table 分页**：内部改用 `KbPagination` 组件渲染，替换原先无样式的裸 `<button>`；分页总数改为基于排序后的数据计算
  - **Table 服务端分页**：新增 `total` 属性——传入后总页数以 `total` 为准且 `data` 视为当前页（组件不再切片），配合 `sortable: 'custom'` 即可做真正的服务端分页排序；不传时行为与原先完全一致
  - **KbCheckbox**：新增 `indeterminate` 半选态属性（通过 DOM property 设置并同步刷新）

- 13c36b8: Tree 支持虚拟滚动与节点拖拽排序：

  - 新增 `height` / `itemHeight`，设置后只渲染视口内的行，支撑上千节点场景
  - 新增 `draggable` 与 `allowDrop`，支持 before / after / inner 三种落点，并内置「禁止拖入自身子孙」校验
  - 新增 `drop` 事件，抛出 `{ dragNode, dropNode, position, data }`，`data` 为调整后的完整树
  - 新增 `defaultExpandAll` 默认展开全部节点
  - 节点新增 `disabled` 支持，禁用后不可选中、不可拖拽

## 0.2.0

### Minor Changes

- 首次正式发布：14 个基础组件（Button/Icon/Tag/Space/Divider/Grid/Input/Checkbox/Radio/Switch/Select/Tooltip/Dialog/Message/Table）+ create-kb 脚手架 CLI。
