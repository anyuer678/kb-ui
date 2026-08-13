# Changesets

本仓库使用 [changesets](https://github.com/changesets/changesets) 管理版本与 changelog。

- 每个功能/修复提交前，运行 `pnpm changeset` 添加变更记录
- 合并版本 PR 后，`changesets/action` 会自动发布到 npm
- 详情见 `docs/guide/` 或根 README「发布流程」
