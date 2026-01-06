# 未读消息数量处理逻辑位置说明

## 📍 核心处理文件

### 1. **主要逻辑文件：`src/contexts/NotificationContext/NotificationContext.tsx`**

这是**所有未读消息数量处理逻辑的核心文件**，包含以下功能：

#### 🔹 状态管理（第 47 行）
```typescript
const [unreadCount, setUnreadCount] = useState(0);
```
- 存储未读消息数量的状态

#### 🔹 从服务端获取未读数量（第 28-42 行）
```typescript
async function fetchUnreadMessageCount(): Promise<number> {
  // 调用 HTTP API: /api/v1/my/unread-message-count
  const response = await myUnreadMessageCount();
  return response.data.count || 0;
}
```
- **位置**：`src/contexts/NotificationContext/NotificationContext.tsx:28-42`
- **功能**：通过 HTTP API 获取未读消息数量

#### 🔹 更新未读数量方法（第 61-65 行）
```typescript
const updateUnreadCount = useCallback((count: number) => {
  if (count >= 0) {
    setUnreadCount(count);
  }
}, []);
```
- **位置**：`src/contexts/NotificationContext/NotificationContext.tsx:61-65`
- **功能**：更新未读数量的通用方法

#### 🔹 手动刷新未读数量（第 70-83 行）
```typescript
const refreshUnreadCount = useCallback(async () => {
  const count = await fetchUnreadMessageCount();
  updateUnreadCount(count);
}, [updateUnreadCount]);
```
- **位置**：`src/contexts/NotificationContext/NotificationContext.tsx:70-83`
- **功能**：手动调用 HTTP API 刷新未读数量

#### 🔹 **WebSocket 实时更新处理（第 88-113 行）** ⭐
```typescript
const handleNotification = useCallback((data: notificationResponseData) => {
  // 验证数据格式
  if (typeof data === 'object' && typeof data.count === 'number') {
    const newCount = data.count;
    // 更新未读数量
    if (newCount >= 0) {
      setUnreadCount((prevCount) => {
        console.log('Updating unread count from', prevCount, 'to', newCount);
        return newCount;
      });
    }
  }
}, []);
```
- **位置**：`src/contexts/NotificationContext/NotificationContext.tsx:88-113`
- **功能**：处理 WebSocket 推送的实时通知，更新未读数量
- **触发时机**：服务端通过 WebSocket 推送 `{ type: "notification", data: { count: 5 } }` 时

#### 🔹 登录后自动获取初始数量（第 118-135 行）
```typescript
useEffect(() => {
  if (isAuthenticated) {
    fetchUnreadMessageCount()
      .then((count) => {
        updateUnreadCount(count);
      });
  } else {
    setUnreadCount(0); // 退出登录时重置
  }
}, [isAuthenticated, updateUnreadCount]);
```
- **位置**：`src/contexts/NotificationContext/NotificationContext.tsx:118-135`
- **功能**：用户登录后自动获取初始未读数量，退出登录时重置为 0

#### 🔹 订阅 WebSocket 通知事件（第 141-159 行）
```typescript
useEffect(() => {
  if (!isConnected || !isAuthenticated) {
    return;
  }
  const notificationTypeKey = apiConfig.websocket?.notificationTypeKey || 'notification';
  // 订阅 WebSocket 通知事件
  ws.on(notificationTypeKey, handleNotification);
  // 清理函数：取消订阅
  return () => {
    ws.off(notificationTypeKey, handleNotification);
  };
}, [isConnected, isAuthenticated, handleNotification]);
```
- **位置**：`src/contexts/NotificationContext/NotificationContext.tsx:141-159`
- **功能**：当 WebSocket 连接成功且用户已认证时，自动订阅 `notification` 事件

#### 🔹 标记已读方法（第 165-182 行）
```typescript
const markAsRead = useCallback(async () => {
  setUnreadCount(0);
}, []);
```
- **位置**：`src/contexts/NotificationContext/NotificationContext.tsx:165-182`
- **功能**：标记所有消息为已读（目前只是前端更新，需要调用后端接口）

---

## 🔄 WebSocket 消息分发流程

### 2. **WebSocket 消息接收和分发：`src/utils/websocket.tsx`**

#### 🔹 接收 WebSocket 消息（第 50-78 行）
```typescript
this.socket.onmessage = (event) => {
  const data: any = JSON.parse(event.data);
  // 根据消息类型分发事件
  if (data.type) {
    this.dispatchEvent(data.type, data.data);
  }
};
```
- **位置**：`src/utils/websocket.tsx:50-78`
- **功能**：接收 WebSocket 消息，根据 `type` 字段分发到对应事件
- **关键**：当收到 `{ type: "notification", data: { count: 5 } }` 时，会分发到 `notification` 事件

#### 🔹 事件分发机制（第 164-169 行）
```typescript
private dispatchEvent(event: string, data: any): void {
  if (this.listeners.has(event)) {
    const callbacks = this.listeners.get(event);
    callbacks?.forEach(callback => callback(data));
  }
}
```
- **位置**：`src/utils/websocket.tsx:164-169`
- **功能**：将消息分发给所有订阅了该事件的回调函数

---

## 📡 HTTP API 调用

### 3. **HTTP API 定义：`src/api/my/api.tsx`**

#### 🔹 获取未读消息数量 API（第 168-173 行）
```typescript
export async function myUnreadMessageCount(req?: myUnreadMessageCountRequest, options?: Options) {
  return request<myUnreadMessageCountResponse>({
    url: '/api/v1/my/unread-message-count',
    method: 'GET',
    params: req || {},
  });
}
```
- **位置**：`src/api/my/api.tsx:168-173`
- **功能**：定义 HTTP API 调用，获取未读消息数量
- **接口**：`GET /api/v1/my/unread-message-count`

---

## 🎨 UI 显示位置

### 4. **组件中使用：`src/components/HeaderDropdown/HeaderDropdown.tsx`**

#### 🔹 获取并使用未读数量（第 169 行）
```typescript
const { unreadCount } = useNotifications();
```
- **位置**：`src/components/HeaderDropdown/HeaderDropdown.tsx:169`
- **功能**：在头部下拉菜单中显示未读消息数量徽章

#### 🔹 显示未读数量徽章（第 254-261 行）
```typescript
{unreadCount > 0 && (
  <Badge className={classes.notificationBadge}>
    {unreadCount > 9 ? '9+' : unreadCount}
  </Badge>
)}
```
- **位置**：`src/components/HeaderDropdown/HeaderDropdown.tsx:254-261`
- **功能**：当未读数量 > 0 时显示徽章

---

## 📋 完整数据流

```
1. 用户登录
   ↓
2. NotificationContext 检测到登录状态变化
   ↓ (src/contexts/NotificationContext/NotificationContext.tsx:118)
   ↓
3. 调用 fetchUnreadMessageCount()
   ↓ (src/contexts/NotificationContext/NotificationContext.tsx:28)
   ↓
4. 调用 HTTP API: myUnreadMessageCount()
   ↓ (src/api/my/api.tsx:168)
   ↓
5. 获取初始未读数量并更新状态
   ↓ (setUnreadCount)
   ↓
6. WebSocket 连接成功 + 用户已认证
   ↓
7. 订阅 'notification' 事件
   ↓ (src/contexts/NotificationContext/NotificationContext.tsx:152)
   ↓
8. 服务端推送通知消息
   ↓
9. WebSocket 接收消息
   ↓ (src/utils/websocket.tsx:50)
   ↓
10. 分发到 'notification' 事件
    ↓ (src/utils/websocket.tsx:74)
    ↓
11. handleNotification 处理消息
    ↓ (src/contexts/NotificationContext/NotificationContext.tsx:88)
    ↓
12. 更新未读数量状态
    ↓ (setUnreadCount)
    ↓
13. UI 自动更新显示
    ↓ (HeaderDropdown 组件)
```

---

## 🎯 关键代码位置总结

| 功能 | 文件位置 | 行号 |
|------|---------|------|
| **状态存储** | `NotificationContext.tsx` | 47 |
| **HTTP 获取未读数量** | `NotificationContext.tsx` | 28-42 |
| **WebSocket 实时更新处理** | `NotificationContext.tsx` | **88-113** ⭐ |
| **订阅 WebSocket 事件** | `NotificationContext.tsx` | 141-159 |
| **登录后自动获取** | `NotificationContext.tsx` | 118-135 |
| **WebSocket 消息接收** | `websocket.tsx` | 50-78 |
| **事件分发** | `websocket.tsx` | 164-169 |
| **HTTP API 定义** | `api/my/api.tsx` | 168-173 |
| **UI 显示** | `HeaderDropdown.tsx` | 169, 254-261 |

---

## 💡 快速定位

**如果你要修改未读消息数量的处理逻辑，主要关注以下文件：**

1. **`src/contexts/NotificationContext/NotificationContext.tsx`** - 所有核心逻辑都在这里
   - 第 88-113 行：WebSocket 实时更新处理（最重要）
   - 第 118-135 行：登录后自动获取
   - 第 141-159 行：订阅 WebSocket 事件

2. **`src/utils/websocket.tsx`** - WebSocket 消息接收和分发
   - 第 50-78 行：消息接收
   - 第 164-169 行：事件分发

3. **`src/components/HeaderDropdown/HeaderDropdown.tsx`** - UI 显示
   - 第 169 行：获取未读数量
   - 第 254-261 行：显示徽章

