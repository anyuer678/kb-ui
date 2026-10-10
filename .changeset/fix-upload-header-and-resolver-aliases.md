---
'kb-ui-vue': patch
---

fix: Upload 自定义请求头移到 open() 之后设置（此前违反 XHR 规范,部分浏览器抛 InvalidStateError 导致头丢失）；resolver 别名映射补全 FloatButtonGroup 与 Layout 子组件（Header/Sider/Content/Footer）,按需引入不再丢失组件与样式
