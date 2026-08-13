# 主流 Vue 3 组件库调研

> 数据采集日期：2026-08-13 · 数据来源：npm registry API、GitHub API/页面
> 下载量口径：2026-07-11 ~ 2026-08-09 的 npm 月下载量

## 1. 总览对比

| 组件库 | 最新版 | 月下载量 | GitHub Star | License | 仓库语言 | 仓库活跃度 |
|---|---|---|---|---|---|---|
| Vuetify | 4.1.9 | 4,093,770 | 41,027 | MIT | TypeScript | 高（当日推送） |
| PrimeVue | — | 2,876,849 | 14,469 | MIT | Vue | **已归档**（2026-06 停止推送） |
| Element Plus | 2.14.4 | 2,776,255 | 27,673 | MIT | TypeScript | 高（当日推送） |
| Ant Design Vue | 4.2.6 | 1,202,827 | 21,618 | MIT（仓库标 Other） | Vue | 高（当日推送） |
| Naive UI | 2.44.1 | 737,637 | 18,493 | MIT | TypeScript | 高（3 天前推送） |
| TDesign Vue Next | 1.20.5 | 274,862 | 2,200 | MIT | TypeScript | 高 |

**解读：**
- **Vuetify** 全球下载量最大（Material Design 风格，海外主导）；**Element Plus** 是国内社区影响力最大的 Vue3 组件库（fork 数 1.98 万居首，open issues 1200 也最多）。
- **PrimeVue** 官方仓库已归档但 npm 下载量依然很高——存量用户仍在用，新开发注意其维护状态。
- **Naive UI** 是个人/小团队驱动的精品库（作者 07akioni），star 高、下载量中游，风格与工程做法最"现代化"（极简依赖、纯 TS）。
- **TDesign**（腾讯）跨框架统一设计语言（Vue2/Vue3/React/小程序），下载量在六大库中最低，但背靠大厂规范。

## 2. 各库架构细节

### Element Plus（2.14.4）
- **产物**：`main: lib/index.js`（CJS）、`module: es/index.mjs`（ESM）、`types: es/index.d.ts`；exports 提供 `./es/*`、`./lib/*` 子路径按需引入。
- **样式**：Sass 编写（theme-chalk），编译为 CSS 变量；`sideEffects` 声明 `dist/*` 与 `theme-chalk/**/*.css` 防误删。
- **主题**：CSS 变量 + 暗色模式（`html.dark` 切换）；提供 SCSS 变量覆盖入口。
- **依赖**：dayjs、lodash(-es)、@vueuse/core、@floating-ui/dom、@popperjs/core（fork 版）、async-validator、@element-plus/icons-vue 等——依赖较多。
- **发布**：GitHub Actions + npm OIDC（SLSA provenance 签名），`publishConfig.access: public`。
- **其他**：peerDependencies `vue ^3.3.7`；unpkg/jsdelivr 全量 UMD（`dist/index.full.js`）；提供 web-types/vetur 元数据。

### Naive UI（2.44.1）
- **产物**：`main: lib/index.js`、`module: es/index.mjs`、`types: es/index.d.ts`；`sideEffects: false`（纯 ESM 树摇友好）。
- **样式**：**css-render**（CSS-in-JS）运行时生成样式，组件级按需加载天然成立；@css-render/plugin-bem 管理 BEM 命名。
- **主题**：`NConfigProvider` + 主题覆盖对象（非纯 CSS 变量方案），支持暗色。
- **依赖**：自研工具库 evtd（事件）、vooks（组合式函数）、vueuc（虚拟列表等）、treemate（树算法）、seemly（工具）——**全栈自研、依赖极少**。
- **工程**：engines node >=20；构建 = tsc 双 target（esm/cjs）+ rollup + esm/umd 双测试；维护者单飞模式。
- **亮点**：devtools 支持、Volar 类型声明生成（gen-volar-dts）。

### Ant Design Vue（4.2.6）
- **产物**：`main: lib/index.js`、`module: es/index.js`、`typings: es/index.d.ts`。
- **样式**：Less 编写（antd 体系），token 化设计变量；`sideEffects` 含 `*.vue`、`dist/*`。
- **主题**：Design Token + 算法化主题定制（延续 antd 5 的思路）。
- **依赖**：dayjs、vue-types、@ant-design/colors、@ant-design/icons-vue、dom-align、async-validator 等——依赖多，且带 @babel/runtime（历史包袱）。
- **工程**：自研 antd-tools 工具链 + babel 编译；engines node >=12.22（较老）。
- **背景**：Ant Design 设计语言在 Vue 的移植，中文企业级后台事实标准之一。

### Vuetify（4.1.9）
- **产物**：`type: module`；`main: lib/framework.js`（ESM）；exports 极详尽——`./styles`（sass/css）、`./components/*`、`./labs/*`、`./locale`、`./directives/*`、`./iconsets/*` 等子路径。
- **样式**：Sass 编写（Material Design 3 风格），同时导出 `sass` 字段与 CSS。
- **主题**：蓝图层 + 设计 token；提供 vite-plugin-vuetify / webpack-plugin-vuetify（optional peer）做样式按需注入。
- **依赖**：peerDependencies `vue ^3.5.0`、typescript>=4.7（可选）；运行时依赖极少（babel 编译产物）。
- **发布**：GitHub Actions + OIDC provenance。
- **特点**：组件最全（含 labs 实验组件）、i18n 内置、SSR 支持好；Material 风格不一定适合所有业务。

### TDesign Vue Next（1.20.5）
- **产物**：`main: cjs/index-lib.js`、`module: es/index.mjs`、`typings: es/index.d.ts`；多种 bundle（es/cjs/umd）。
- **样式**：Less 编写；`sideEffects` 含 `es/**/style/**`（按组件样式目录）。
- **主题**：暗色 + 可定制主题；跨框架统一设计规范（tdesign-vue/tdesign-react/tdesign-miniprogram）。
- **依赖**：mitt、dayjs、lodash-es、validator、sortablejs、tinycolor2、@popperjs/core、tdesign-icons-vue-next——依赖克制。
- **工程**：monorepo（pnpm workspace + internal/ 包）、vitest、commitlint + husky、babel；浏览器支持 Edge>=84 / Chrome>=84 / Firefox>=83 / Safari>=14.1。
- **发布**：GitHub Actions + OIDC provenance；`publishConfig.registry` 显式指定。

## 3. 共性结论（可借鉴到自研库）

1. **产物双格式是标配**：ESM（module）+ CJS（main）双产物 + 独立 d.ts；`exports` 字段精确映射，子路径按需引入（`./es/*` 或 `./components/*`）。
2. **sideEffects 必须声明**：CSS 文件要列入 `sideEffects`，否则会被打包器 tree-shake 误删；纯 JS 侧用 `sideEffects: false` 换最大树摇。
3. **样式方案两派**：
   - 静态 CSS（Element/TDesign/Vuetify/AntD）：构建期编译，CSS 变量做主题 → 简单、SSR 友好、主题切换靠变量覆盖；
   - CSS-in-JS（Naive）：运行时生成，按需天然、主题对象化 → 灵活但运行时开销与 SSR 处理更复杂。
   - **自研建议：静态 CSS + CSS 变量**（成本低、可控，与我们设计一致）。
4. **主题 = 设计 token 层**：颜色/圆角/间距/阴影全部 token 化，暗色模式通过根节点类名/属性切换变量即可。
5. **依赖策略**：大库依赖多（Element/AntD），精品库自研小工具（Naive）；自研库建议**少依赖**，只引入真正必要的（popper/floating-ui、日期处理可选）。
6. **发布现代化**：GitHub Actions + npm OIDC 自动发布并带 SLSA provenance；`publishConfig.access: public`。
7. **引擎要求**：新版库普遍 engines `node >= 18/20`；脚手架类（create-vue/create-vite）要求更高（Node 20+/22+）。
8. **辅助元数据**：web-types / vetur / Volar 声明可提升编辑器体验（可后置）。

## 4. 对我们设计的影响

- 设计文档中的 **ESM+CJS 双产物、exports 映射、sideEffects 声明、CSS 变量 token 化、暗色主题** 方案与主流做法一致，无需调整。
- **peerDependencies** 建议 `vue ^3.4.0`（Element 用 ^3.3.7，Naive 用 ^3.0.0，放宽更友好；我们取中间值合理）。
- 依赖控制：首版不引入 popper 等定位库，Tooltip/Dropdown 先用简单 CSS 方案，需要时再评估 @floating-ui/dom。
- 发布链路：采用 GitHub Actions + npm OIDC（需在 CI 配置），本地发布 `pnpm publish` 亦可。
