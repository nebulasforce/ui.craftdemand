# WebSocket 消息格式示例

## 一、认证消息（参考）

### 客户端发送认证请求
```json
{
  "type": "authenticate",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}
```

### 服务端响应认证结果
```json
{
  "type": "authenticate",
  "data": {
    "result": true,
    "accountId": "user123",
    "expires": 1704153600
  }
}
```

## 二、未读消息通知（新增）

### 服务端主动推送通知

**场景1：新消息到达**
```json
{
  "type": "notification",
  "data": {
    "count": 6,
    "timestamp": 1704067200000
  }
}
```

**场景2：消息被标记为已读**
```json
{
  "type": "notification",
  "data": {
    "count": 0,
    "timestamp": 1704067200000
  }
}
```

**场景3：用户上线时推送当前数量**
```json
{
  "type": "notification",
  "data": {
    "count": 3,
    "timestamp": 1704067200000
  }
}
```

**场景4：最小格式（仅必需字段）**
```json
{
  "type": "notification",
  "data": {
    "count": 5
  }
}
```

## 三、消息格式要求

### 必需字段
- `type`: 必须为 `"notification"`（与客户端配置一致）
- `data.count`: 必须为数字类型，且 >= 0

### 可选字段
- `data.timestamp`: 时间戳（毫秒），用于调试

### 类型定义（TypeScript）
```typescript
interface notificationResponse {
  type: "notification";
  data: {
    count: number;           // 必需：未读消息数量
    timestamp?: number;      // 可选：时间戳（毫秒）
  }
}
```

## 四、错误示例（避免）

### ❌ 错误1：type 字段不匹配
```json
{
  "type": "notify",  // ❌ 应该是 "notification"
  "data": {
    "count": 5
  }
}
```

### ❌ 错误2：count 字段缺失
```json
{
  "type": "notification",
  "data": {
    "timestamp": 1704067200000
    // ❌ 缺少 count 字段
  }
}
```

### ❌ 错误3：count 类型错误
```json
{
  "type": "notification",
  "data": {
    "count": "5"  // ❌ 应该是数字，不是字符串
  }
}
```

### ❌ 错误4：count 为负数
```json
{
  "type": "notification",
  "data": {
    "count": -1  // ❌ 应该是 >= 0 的数字
  }
}
```

## 五、完整消息流示例

### 1. 连接建立
```
客户端 → 服务端: 建立 WebSocket 连接
ws://localhost:50000/api/v1/ws
```

### 2. 认证流程
```
客户端 → 服务端:
{
  "type": "authenticate",
  "data": { "token": "xxx" }
}

服务端 → 客户端:
{
  "type": "authenticate",
  "data": {
    "result": true,
    "accountId": "user123",
    "expires": 1704153600
  }
}
```

### 3. 通知推送
```
服务端 → 客户端:
{
  "type": "notification",
  "data": {
    "count": 5,
    "timestamp": 1704067200000
  }
}
```

## 六、测试用例

### 测试用例1：正常推送
```json
输入: { "type": "notification", "data": { "count": 5 } }
预期: 客户端更新未读数量为 5
```

### 测试用例2：数量为0
```json
输入: { "type": "notification", "data": { "count": 0 } }
预期: 客户端更新未读数量为 0
```

### 测试用例3：包含时间戳
```json
输入: { "type": "notification", "data": { "count": 3, "timestamp": 1704067200000 } }
预期: 客户端更新未读数量为 3，时间戳被忽略（可选字段）
```

## 七、服务端实现检查清单

- [ ] 消息格式符合规范（type 和 data 字段）
- [ ] type 字段值为 `"notification"`
- [ ] data.count 为数字类型且 >= 0
- [ ] 在新消息到达时推送
- [ ] 在消息状态变更时推送
- [ ] 在用户上线时推送（可选）
- [ ] 只向已认证的用户推送
- [ ] 处理连接断开的情况
- [ ] 记录推送日志（便于调试）

## 八、调试建议

### 客户端调试
在浏览器控制台查看：
```javascript
// NotificationContext 会输出日志
console.log('Unread message count updated via WebSocket:', newCount);
```

### 服务端调试
建议记录：
- 推送时间
- 目标用户 accountId
- 推送的 count 值
- 推送是否成功

### 常见问题排查

1. **客户端收不到通知**
   - 检查 type 是否为 `"notification"`
   - 检查 WebSocket 连接是否正常
   - 检查用户是否已认证

2. **数量更新不正确**
   - 检查 count 字段是否为数字
   - 检查 count 值是否正确计算

3. **推送频率过高**
   - 只在数量变化时推送
   - 避免重复推送相同数量

