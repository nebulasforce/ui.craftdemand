# 未读消息实时更新功能实现总结

## 一、已完成的改动

### 1. 类型定义（`src/api/ws/request.tsx` 和 `src/api/ws/response.tsx`）

✅ **新增通知消息类型定义**：
- `subscribeNotificationRequest` - 订阅通知请求（预留，可选）
- `notificationResponseData` - 通知响应数据
- `notificationResponse` - 通知响应消息

**格式参考认证消息**：
```typescript
// 与认证消息格式一致
interface notificationResponse extends Message<notificationResponseData> {
  type: "notification";
  data: {
    count: number;
    timestamp?: number;
  }
}
```

### 2. NotificationContext 完善（`src/contexts/NotificationContext/NotificationContext.tsx`）

✅ **封装的功能**：
- ✅ 自动订阅 WebSocket 通知事件
- ✅ 实时接收并更新未读消息数量
- ✅ 登录后自动获取初始未读数量
- ✅ 退出登录时重置数量
- ✅ 手动刷新未读数量（新增 `refreshUnreadCount` 方法）
- ✅ 错误处理和日志记录
- ✅ 使用 `useCallback` 和 `useRef` 优化性能

✅ **新增方法**：
- `refreshUnreadCount()` - 手动刷新未读数量

✅ **改进点**：
- 使用 `useRef` 避免闭包问题
- 更好的错误处理（不干扰用户体验）
- 更清晰的代码注释
- 自动管理 WebSocket 订阅生命周期

### 3. 服务端接口规范文档（`WEBSOCKET_NOTIFICATION_API.md`）

✅ **包含内容**：
- 消息格式规范（JSON 示例）
- 服务端实现要求
- 推送时机说明
- Go 语言伪代码示例
- 测试建议
- 扩展建议

## 二、使用方式

### 在组件中使用

```typescript
import { useNotifications } from '@/contexts/NotificationContext/NotificationContext';

function MyComponent() {
  const { unreadCount, isLoading, refreshUnreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <Badge>{unreadCount}</Badge>
      <Button onClick={refreshUnreadCount}>刷新</Button>
      <Button onClick={markAsRead}>标记已读</Button>
    </div>
  );
}
```

### 自动工作流程

1. **应用启动** → WebSocket 连接建立
2. **用户登录** → 自动获取初始未读数量
3. **服务端推送** → 自动更新未读数量（实时）
4. **用户退出** → 重置未读数量为 0

## 三、服务端需要实现的内容

### 1. 消息格式

服务端需要推送以下格式的消息：

```json
{
  "type": "notification",
  "data": {
    "count": 5,
    "timestamp": 1704067200000
  }
}
```

### 2. 推送时机

- ✅ 新消息到达时
- ✅ 消息被标记为已读/未读时
- ✅ 用户上线时（可选，确保同步）

### 3. 配置要求

确保 `type` 字段为 `"notification"`（与客户端配置一致）

详细说明请参考：`WEBSOCKET_NOTIFICATION_API.md`

## 四、文件清单

### 修改的文件
- ✅ `src/api/ws/request.tsx` - 新增订阅请求类型
- ✅ `src/api/ws/response.tsx` - 新增通知响应类型
- ✅ `src/contexts/NotificationContext/NotificationContext.tsx` - 完善实现

### 新增的文件
- ✅ `WEBSOCKET_NOTIFICATION_API.md` - 服务端接口规范文档
- ✅ `NOTIFICATION_UPDATE_SUMMARY.md` - 本总结文档

## 五、测试建议

### 前端测试
1. 打开应用，检查是否自动获取未读数量
2. 模拟服务端推送通知消息，检查数量是否更新
3. 测试登录/退出时数量是否正确重置
4. 测试手动刷新功能

### 服务端测试
1. 创建新消息，检查是否推送通知
2. 标记消息已读，检查是否推送通知
3. 用户上线时，检查是否推送当前数量
4. 测试多个客户端同时在线的情况

## 六、注意事项

1. ✅ 所有逻辑已封装在 `NotificationContext` 中，无需在其他组件中处理
2. ✅ 使用标准的 WebSocket 消息格式，与认证消息格式一致
3. ✅ 自动管理订阅生命周期，无需手动清理
4. ✅ 错误处理完善，不会影响用户体验
5. ✅ 性能优化：使用 `useCallback` 和 `useRef` 避免不必要的重渲染

## 七、后续扩展建议

如果需要更丰富的通知功能，可以扩展 `notificationResponseData`：

```typescript
interface notificationResponseData {
  count: number;
  timestamp?: number;
  messageId?: string;           // 最新消息ID
  lastMessageTime?: number;      // 最新消息时间
  lastMessageTitle?: string;     // 最新消息标题
  lastMessageContent?: string;   // 最新消息内容预览
}
```

这样可以在通知中显示最新消息的预览信息。

