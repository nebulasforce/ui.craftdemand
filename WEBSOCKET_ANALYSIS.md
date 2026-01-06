# WebSocket 发送时机和业务逻辑分析

## 一、WebSocket 发送时机

### 1. 自动认证消息发送
**位置**: `src/utils/websocket.tsx` 第 139-158 行

**触发时机**:
- WebSocket 连接成功建立后（`onopen` 事件触发时）
- 在 `connect()` 方法的 `onopen` 回调中自动调用 `authenticate()` 方法

**发送条件**:
```typescript
// 第 44-46 行：连接打开时检查是否需要认证
if (!this.isAuthenticated || (now - this.expires > 0)) {
  this.authenticate()
}
```

**发送内容**:
```typescript
// 第 142-148 行：发送认证消息
const message: authenticateRequest = {
  type: apiConfig.websocket?.authMessageTypeKey || 'authenticate',
  data: {
    token,  // 从 localStorage 获取的 token
  }
}
this.socket.send(JSON.stringify(message))
```

### 2. 通过 Context 发送自定义消息
**位置**: `src/contexts/WebSocketContext/WebSocketContext.tsx` 第 50-54 行

**发送方法**:
```typescript
const send = (data: any) => {
  if (isConnected) {
    wsService.send(data);
  }
};
```

**使用方式**:
- 组件可以通过 `useWebSocket()` hook 获取 `send` 方法
- 目前代码中**未发现实际调用此方法发送业务消息**的情况
- 主要用于扩展，允许组件主动发送 WebSocket 消息

## 二、WebSocket 核心代码位置

### 1. WebSocket 服务类（单例模式）
**文件**: `src/utils/websocket.tsx`

**关键方法**:
- `connect()`: 建立 WebSocket 连接（第 28-88 行）
- `send(data)`: 发送消息（第 104-108 行）
- `authenticate()`: 发送认证消息（第 139-158 行）
- `reconnect()`: 重连 WebSocket（第 90-101 行）
- `on(event, callback)`: 订阅事件（第 119-124 行）
- `off(event, callback)`: 取消订阅（第 127-137 行）

### 2. WebSocket Context
**文件**: `src/contexts/WebSocketContext/WebSocketContext.tsx`

**功能**:
- 提供 React Context 封装
- 管理连接状态（`isConnected`）
- 存储接收到的消息（`messages`）
- 暴露 `send` 方法供组件使用

### 3. 认证上下文集成
**文件**: `src/contexts/AuthContext/AuthContext.tsx`

**关键调用**:
- 第 82 行：登录成功后调用 `wsService.reconnect()` 重新连接并认证
- 第 126 行：退出登录后调用 `wsService.reconnect()` 清理认证状态

## 三、业务逻辑流程

### 1. 连接建立流程

```
应用启动
  ↓
WebSocketProvider 组件挂载
  ↓
调用 wsService.connect()
  ↓
建立 WebSocket 连接（ws://localhost:50000/api/v1/ws）
  ↓
连接成功触发 onopen 事件
  ↓
检查认证状态
  ↓
如果未认证或已过期 → 调用 authenticate()
  ↓
发送认证消息（包含 token）
  ↓
等待服务端响应认证结果
```

### 2. 认证流程

```
连接建立
  ↓
从 localStorage 获取 token
  ↓
发送认证消息：
{
  type: 'authenticate',
  data: { token: 'xxx' }
}
  ↓
服务端验证 token
  ↓
接收认证响应：
{
  type: 'authenticate',
  data: {
    result: true/false,
    accountId: 'xxx',
    expires: 1234567890
  }
}
  ↓
如果认证成功：
  - 更新 isAuthenticated = true
  - 保存 accountId 和 expires
  - 调用 reconnect() 重新连接（使用 accountId 参数）
```

### 3. 重连机制

**触发场景**:
1. **登录成功后**（`AuthContext.tsx` 第 82 行）
   - 用户登录成功，获取新 token
   - 调用 `wsService.reconnect()` 使用新 token 重新认证

2. **退出登录后**（`AuthContext.tsx` 第 126 行）
   - 清除认证信息
   - 重新连接（但不会认证成功，因为没有 token）

3. **认证成功后**（`websocket.tsx` 第 65 行）
   - 认证成功后，使用 accountId 重新建立连接
   - 新连接 URL: `ws://...?accountId=xxx`

4. **连接断开后**（`websocket.tsx` 第 81 行）
   - 连接关闭时自动重连
   - 延迟 3 秒后重新连接

### 4. 消息接收和处理

**消息分发机制**（`websocket.tsx` 第 50-75 行）:
```
接收 WebSocket 消息
  ↓
解析 JSON 数据
  ↓
分发到 'default' 事件（所有消息）
  ↓
如果消息有 type 字段：
  ↓
根据 type 分发到对应事件：
  - 'authenticate': 处理认证响应
  - 'notification': 处理通知消息（由 NotificationContext 订阅）
  - 其他自定义类型
```

**通知消息处理**（`NotificationContext.tsx` 第 68-86 行）:
```
订阅 'notification' 事件
  ↓
接收通知消息：
{
  type: 'notification',
  data: {
    count: 5  // 未读消息数量
  }
}
  ↓
更新未读消息数量（unreadCount）
  ↓
UI 自动更新显示
```

## 四、关键配置

**文件**: `config/api.config.ts`

```typescript
websocket: {
  endpoint: 'ws://localhost:50000/api/v1/ws',
  authMessageTypeKey: 'authenticate',      // 认证消息类型
  notificationTypeKey: 'notification',    // 通知消息类型
}
```

## 五、使用场景总结

### 当前实际使用场景：
1. **实时通知系统**
   - 接收服务端推送的未读消息数量更新
   - 通过 `NotificationContext` 订阅 `notification` 事件
   - 自动更新 UI 中的未读消息徽章

2. **认证管理**
   - 连接建立后自动认证
   - 登录/登出时重新连接
   - 维护连接状态和认证状态

### 潜在扩展场景：
- 通过 `useWebSocket().send()` 发送自定义消息
- 订阅其他类型的 WebSocket 事件
- 实现实时聊天、实时数据更新等功能

## 六、代码调用链

```
应用启动
  ↓
app/layout.tsx
  ↓
WebSocketProvider (初始化连接)
  ↓
websocket.tsx.connect()
  ↓
onopen → authenticate() → send(认证消息)
  ↓
onmessage → 接收消息 → dispatchEvent(根据type分发)
  ↓
NotificationContext 订阅 'notification' 事件
  ↓
更新未读消息数量
```

## 七、注意事项

1. **单例模式**: WebSocket 服务使用单例模式，全局只有一个实例
2. **自动重连**: 连接断开后会自动重连（3秒延迟）
3. **认证过期**: 如果认证过期，会在连接打开时重新认证
4. **状态管理**: 认证状态、accountId、expires 都保存在 WebSocket 实例中
5. **事件订阅**: 使用观察者模式，支持多个组件订阅同一事件

