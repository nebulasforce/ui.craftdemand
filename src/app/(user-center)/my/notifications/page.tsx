import type { listRequest } from '@/api/message/request';
import { myCustomMessageList, mySystemMessageList, mySentMessageList } from '@/api/ssr/my';
import NotificationsPageRender from './_render';
import { convertParams } from '@/api/common/functions';

// getCustomMessageList 从服务端获取收到的消息列表数据
async function getCustomMessageList(params?: listRequest) {
  try {
    const response = await myCustomMessageList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// getSystemMessageList 从服务端获取系统消息列表数据
async function getSystemMessageList(params?: listRequest) {
  try {
    const response = await mySystemMessageList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// getSentMessageList 从服务端获取发送的消息列表数据
async function getSentMessageList(params?: listRequest) {
  try {
    const response = await mySentMessageList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// 关键：不直接解构 searchParams，而是通过 props 整体获取
const NotificationsPage = async ({ searchParams }: any) => {
  const resolvedSearchParams = await searchParams;
  const params = convertParams(resolvedSearchParams);
  
  // 从 URL 参数中读取 tab，默认为 'system'
  const tabParam = Array.isArray(resolvedSearchParams?.tab) 
    ? resolvedSearchParams.tab[0] 
    : resolvedSearchParams?.tab;
  const initialTab = (tabParam === 'system' || tabParam === 'custom') ? tabParam : 'system';
  
  const [systemMessageData, customMessageData, sentMessageData] = await Promise.all([
    getSystemMessageList(params),
    getCustomMessageList(params),
    getSentMessageList(params),
  ]);
  return (
    <>
      <NotificationsPageRender 
        initialSystemMessageData={systemMessageData}
        initialCustomMessageData={customMessageData} 
        initialSentMessageData={sentMessageData}
        initialTab={initialTab}
      />
    </>
  );
};

export default NotificationsPage;
