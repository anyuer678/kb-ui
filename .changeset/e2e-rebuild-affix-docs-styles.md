---
'kb-ui-vue': patch
---

fix(affix): `target` 现在真正作为滚动容器生效

此前 `KbAffix` 只监听 window 的 scroll/resize，`target` 仅被当成固定范围的边界使用。
结果是：把 Affix 放进一个 `overflow: auto` 的容器里并传 `target` 时，滚动容器**完全不会触发**重新计算，
组件永远不固定——而 playground 的演示恰好就是这么写的，等于演示了一个不生效的功能。

现在 `target` 同时承担两个职责：
- 作为滚动监听源（容器滚动即触发更新）
- 作为固定范围的边界（固定线取「容器顶部 + offsetTop」，而不是视口顶部）

不传 `target` 时的视口行为保持不变。
