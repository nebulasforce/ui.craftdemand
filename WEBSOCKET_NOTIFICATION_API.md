# WebSocket 未读消息通知接口规范

## 一、消息格式规范

### 1. 消息结构（参考认证消息格式）

所有 WebSocket 消息都遵循统一的格式：

```typescript
interface Message<T> {
  type: string;  // 消息类型
  data: T;       // 消息数据
}
```

### 2. 未读消息通知消息格式

**服务端主动推送格式**：

```json
{
  "type": "notification",
  "data": {
    "count": 5,
    "timestamp": 1704067200000
  }
}
```

**TypeScript 类型定义**：

```typescript
// 通知响应数据
interface notificationResponseData {
  count: number;           // 未读消息数量（必需）
  timestamp?: number;      // 时间戳（可选，用于调试）
}

// 通知响应消息
interface notificationResponse extends Message<notificationResponseData> {
  type: "notification";    // 固定为 "notification"
  data: notificationResponseData;
}
```

## 二、服务端实现要求

### 1. WebSocket 连接建立

**连接 URL 格式**：
```
ws://localhost:50000/api/v1/ws?accountId={accountId}
```

**连接流程**：
1. 客户端建立 WebSocket 连接
2. 客户端发送认证消息（包含 token）
3. 服务端验证 token，返回认证结果
4. 认证成功后，服务端保存客户端连接，关联 accountId

### 2. 认证消息格式（参考）

**客户端发送**：
```json
{
  "type": "authenticate",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**服务端响应**：
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

### 3. 未读消息通知推送时机

服务端应在以下场景主动推送未读消息数量更新：

1. **新消息到达时**
   - 当有新消息发送给该用户时
   - 立即推送最新的未读数量

2. **消息状态变更时**
   - 当用户的消息被标记为已读/未读时
   - 推送更新后的未读数量

3. **用户上线时**（可选）
   - 当用户 WebSocket 连接建立并认证成功后
   - 推送当前未读数量（确保客户端状态同步）

4. **定时同步**（可选）
   - 可以定期（如每30秒）推送一次当前未读数量
   - 用于确保客户端和服务端数据一致性

### 4. 推送消息示例

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

**场景3：用户上线时推送**
```json
{
  "type": "notification",
  "data": {
    "count": 3,
    "timestamp": 1704067200000
  }
}
```

## 三、服务端实现伪代码示例

### Go 语言示例

```go
package websocket

import (
    "encoding/json"
    "time"
)

// 消息结构
type Message struct {
    Type string      `json:"type"`
    Data interface{} `json:"data"`
}

// 通知数据
type NotificationData struct {
    Count     int   `json:"count"`
    Timestamp int64 `json:"timestamp,omitempty"`
}

// 通知消息
type NotificationMessage struct {
    Type string           `json:"type"`
    Data NotificationData `json:"data"`
}

// 推送未读消息通知
func PushUnreadCountNotification(conn *websocket.Conn, count int) error {
    msg := NotificationMessage{
        Type: "notification",
        Data: NotificationData{
            Count:     count,
            Timestamp: time.Now().UnixMilli(),
        },
    }
    
    data, err := json.Marshal(msg)
    if err != nil {
        return err
    }
    
    return conn.WriteMessage(websocket.TextMessage, data)
}

// 在以下场景调用 PushUnreadCountNotification：
// 1. 新消息创建时
// 2. 消息状态变更时
// 3. 用户连接建立时（可选）
```

### 推送时机示例

```go
// 场景1：新消息创建时
func CreateMessage(message *Message) error {
    // ... 创建消息逻辑 ...
    
    // 通知所有相关用户
    for _, accountId := range message.Recipients {
        if conn := GetWebSocketConnection(accountId); conn != nil {
            count := GetUnreadCount(accountId)
            PushUnreadCountNotification(conn, count)
        }
    }
    
    return nil
}

// 场景2：消息被标记为已读时
func MarkMessageAsRead(messageId string, accountId string) error {
    // ... 标记已读逻辑 ...
    
    // 通知用户
    if conn := GetWebSocketConnection(accountId); conn != nil {
        count := GetUnreadCount(accountId)
        PushUnreadCountNotification(conn, count)
    }
    
    return nil
}

// 场景3：用户认证成功后
func OnAuthenticated(conn *websocket.Conn, accountId string) {
    // ... 认证逻辑 ...
    
    // 推送当前未读数量
    count := GetUnreadCount(accountId)
    PushUnreadCountNotification(conn, count)
}
```

## 四、HTTP API 接口（可选）

如果需要在客户端主动获取未读数量，可以使用现有的 HTTP API：

**接口**：`GET /api/v1/my/unread-message-count`

**响应格式**：
```json
{
  "success": true,
  "code": 0,
  "message": "success",
  "data": {
    "result": true,
    "count": 5
  }
}
```

## 五、错误处理

### 1. 连接断开处理
- 服务端应检测连接断开，及时清理连接资源
- 客户端会自动重连（3秒延迟）

### 2. 认证失败处理
- 如果认证失败，服务端应关闭连接
- 客户端会尝试重新认证

### 3. 消息格式错误
- 如果客户端收到格式错误的消息，会记录警告日志
- 不会影响其他功能

## 六、配置说明

客户端配置（`config/api.config.ts`）：

```typescript
websocket: {
  endpoint: 'ws://localhost:50000/api/v1/ws',
  authMessageTypeKey: 'authenticate',
  notificationTypeKey: 'notification',  // 通知消息类型
}
```

**重要**：服务端的 `notificationTypeKey` 必须与客户端配置一致，默认为 `"notification"`。

## 七、测试建议

### 1. 功能测试
- [ ] 新消息到达时，客户端能收到通知并更新数量
- [ ] 消息被标记为已读时，客户端能收到通知并更新数量
- [ ] 用户上线时，客户端能收到当前未读数量
- [ ] 多个客户端同时在线时，都能收到正确的通知

### 2. 异常测试
- [ ] 连接断开后重连，能正常接收通知
- [ ] 认证失败后，不会收到通知
- [ ] 消息格式错误时，不会影响其他功能

### 3. 性能测试
- [ ] 大量用户同时在线时，推送性能正常
- [ ] 频繁推送时，不影响其他功能

## 八、注意事项

1. **消息类型一致性**：确保服务端推送的 `type` 字段与客户端配置的 `notificationTypeKey` 一致
2. **数据格式**：确保 `data.count` 始终是数字类型，且 >= 0
3. **推送频率**：避免过于频繁的推送，建议只在数量变化时推送
4. **连接管理**：及时清理断开的连接，避免内存泄漏
5. **安全性**：确保只有认证成功的用户才能收到通知

## 九、扩展建议

如果需要更丰富的通知信息，可以扩展 `notificationResponseData`：

```typescript
interface notificationResponseData {
  count: number;                    // 未读消息数量
  timestamp?: number;               // 时间戳
  messageId?: string;                // 最新消息ID
  lastMessageTime?: number;          // 最新消息时间
  lastMessageTitle?: string;         // 最新消息标题（可选）
  lastMessageContent?: string;       // 最新消息内容预览（可选）
}
```

这样可以实现更丰富的通知功能，如显示最新消息预览等。

