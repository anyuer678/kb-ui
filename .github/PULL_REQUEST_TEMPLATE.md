## 变更类型

<!-- 勾选适用的项（可多选） -->

- [ ] 新组件
- [ ] 缺陷修复（fix）
- [ ] 功能增强（feat）
- [ ] 文档
- [ ] 工程 / CI / 构建
- [ ] 破坏性变更（BREAKING CHANGE）

## 做了什么

<!-- 一句话说清动机；如果是修 bug，说明「现象 → 根因 → 修法」 -->

## 验证情况

<!-- 本地至少跑过 lint / typecheck / test；涉及 UI 变化时请补上视觉与 e2e -->

- [ ] `pnpm lint` 通过
- [ ] `pnpm typecheck` 通过
- [ ] `pnpm test` 通过（新增/修改了组件请补单测）
- [ ] `pnpm e2e` 通过（改动影响交互时）
- [ ] `pnpm test:visual` 通过（改动影响外观时；基线变化请说明原因）
- [ ] `pnpm check-size` 通过（改动影响产物体积时）

## 影响面

- 是否影响现有 API：是 / 否
- 是否需要更新文档：是 / 否
- 是否需要 changeset：是 / 否（面向 `kb-ui-vue` 的变更**必须**有，执行 `pnpm changeset`）

## 备注

<!-- 截图、基线对比、权衡说明等 -->
