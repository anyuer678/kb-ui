# Message 消息提示

函数式调用，无需在模板中声明组件。

## 基础用法

```ts
import { message } from '@kb/ui'

message.success('操作成功')
message.error('出错了')
message.warning('请注意')
message.info('这是一条信息')
```

<KbSpace wrap>
  <KbButton type="success" @click="message.success('操作成功')">成功</KbButton>
  <KbButton type="danger" @click="message.error('出错了')">错误</KbButton>
  <KbButton type="warning" @click="message.warning('请注意')">警告</KbButton>
  <KbButton type="info" @click="message.info('这是一条信息')">信息</KbButton>
</KbSpace>

## API

| 方法 | 参数 | 说明 |
|---|---|---|
| `message.success(content, duration?)` | `string`, `number` | 成功提示 |
| `message.error(content, duration?)` | 同上 | 错误提示 |
| `message.warning(content, duration?)` | 同上 | 警告提示 |
| `message.info(content, duration?)` | 同上 | 信息提示 |
| `message.show(content, options?)` | `string`, `{ type?, duration? }` | 通用入口 |

::: tip
默认 3000ms 后自动关闭；传 `duration: 0` 可保持不关闭，返回的 unmount 函数可手动关闭。
:::
