# 未读消息通知功能测试指南

## ✅ 订阅状态确认

**是的，已经订阅了未读消息主题！**

订阅逻辑在 `NotificationContext` 中，会在以下条件满足时自动订阅：
- ✅ WebSocket 连接成功 (`isConnected = true`)
- ✅ 用户已认证 (`isAuthenticated = true`)

订阅的主题键：`"notification"`（可在 `config/api.config.ts` 中配置）

## 🔍 如何验证订阅是否成功

### 1. 打开浏览器控制台

打开开发者工具（F12），查看 Console 标签页。

### 2. 查看订阅日志

当满足订阅条件时，你会看到：
```
NotificationContext: Subscribing to notification event with key: notification
```

### 3. 查看消息接收日志

当服务端发送通知消息时，你会看到：
```
WebSocket: Received message: { type: "notification", data: { count: 5 } }
WebSocket: Dispatching event for type: notification with data: { count: 5 }
NotificationContext: Received notification data: { count: 5 }
NotificationContext: Updating unread count from 0 to 5
```

## 📤 服务端发送消息格式

服务端需要发送以下格式的消息：

```json
{
  "type": "notification",
  "data": {
    "count": 5
  }
}
```

**重要**：
- `type` 字段必须是 `"notification"`（与客户端配置一致）
- `data.count` 必须是数字类型，且 >= 0

## 🧪 测试步骤

### 步骤 1：确保用户已登录
- 打开应用并登录
- 检查控制台是否有订阅日志

### 步骤 2：服务端发送测试消息
在服务端发送以下消息：
```json
{
  "type": "notification",
  "data": {
    "count": 10
  }
}
```

### 步骤 3：检查前端响应
- 查看浏览器控制台日志
- 检查页面上的未读数量是否更新为 10

### 步骤 4：再次发送消息
发送不同的数量：
```json
{
  "type": "notification",
  "data": {
    "count": 0
  }
}
```

页面上的未读数量应该更新为 0。

## 🐛 常见问题排查

### 问题 1：收不到消息

**检查清单**：
1. ✅ 用户是否已登录？（查看控制台是否有 "Subscribing" 日志）
2. ✅ WebSocket 是否已连接？（查看控制台是否有连接日志）
3. ✅ 服务端发送的 `type` 是否为 `"notification"`？
4. ✅ 服务端是否正确发送到该用户的连接？

**调试方法**：
- 查看控制台是否有 "WebSocket: Received message" 日志
- 如果没有，说明消息没有到达客户端
- 如果有但类型不对，检查服务端发送的 `type` 字段

### 问题 2：收到消息但数量不更新

**检查清单**：
1. ✅ 查看控制台是否有 "NotificationContext: Received notification data" 日志
2. ✅ 检查 `data.count` 是否为数字类型
3. ✅ 检查 `data.count` 是否 >= 0

**调试方法**：
- 查看控制台是否有警告日志
- 检查数据格式是否正确

### 问题 3：订阅日志没有出现

**可能原因**：
1. WebSocket 未连接
2. 用户未登录
3. NotificationProvider 未正确挂载

**解决方法**：
- 检查 `app/layout.tsx` 中是否包含 `<NotificationProvider>`
- 检查 WebSocket 连接状态
- 检查用户登录状态

## 📊 完整消息流

```
1. 应用启动
   ↓
2. WebSocket 连接建立
   ↓
3. 用户登录
   ↓
4. 认证成功
   ↓
5. NotificationContext 订阅 "notification" 事件
   ↓ (控制台: "Subscribing to notification event")
   ↓
6. 服务端发送通知消息
   ↓
7. WebSocket 接收消息
   ↓ (控制台: "WebSocket: Received message")
   ↓
8. 分发到 "notification" 事件
   ↓ (控制台: "Dispatching event for type: notification")
   ↓
9. NotificationContext 处理消息
   ↓ (控制台: "NotificationContext: Received notification data")
   ↓
10. 更新未读数量
    ↓ (控制台: "Updating unread count from X to Y")
    ↓
11. 页面 UI 自动更新
```

## 🔧 调试技巧

### 1. 启用详细日志
代码中已经添加了详细的日志，打开控制台即可查看。

### 2. 手动测试订阅
在浏览器控制台执行：
```javascript
// 查看 WebSocket 服务实例
import ws from '@/utils/websocket';

// 手动订阅（仅用于测试）
ws.on('notification', (data) => {
  console.log('Manual subscription received:', data);
});
```

### 3. 检查事件分发
在浏览器控制台执行：
```javascript
// 查看所有订阅的监听器
// 这需要访问 WebSocket 实例的内部状态（可能需要修改代码）
```

## ✅ 验证清单

- [ ] 用户已登录
- [ ] WebSocket 连接成功
- [ ] 看到 "Subscribing to notification event" 日志
- [ ] 服务端发送的消息格式正确
- [ ] 看到 "WebSocket: Received message" 日志
- [ ] 看到 "NotificationContext: Received notification data" 日志
- [ ] 看到 "Updating unread count" 日志
- [ ] 页面上的未读数量已更新

## 🎯 快速测试命令

如果你有服务端测试工具，可以使用以下命令测试：

```bash
# 使用 websocat 工具测试（需要先安装）
echo '{"type":"notification","data":{"count":5}}' | websocat ws://localhost:50000/api/v1/ws
```

或者使用 Node.js 脚本：
```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:50000/api/v1/ws');

ws.on('open', () => {
  // 先发送认证消息
  ws.send(JSON.stringify({
    type: 'authenticate',
    data: { token: 'your-token' }
  }));
  
  // 然后发送通知消息
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'notification',
      data: { count: 10 }
    }));
  }, 1000);
});
```

## 📝 总结

**是的，已经订阅了！** 只要满足以下条件：
1. ✅ WebSocket 连接成功
2. ✅ 用户已登录

服务端发送正确格式的消息后，页面上的未读数量会自动更新。

如果遇到问题，请查看浏览器控制台的日志，按照上面的排查步骤进行调试。

