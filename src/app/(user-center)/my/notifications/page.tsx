import type { messageListRequest } from '@/api/message/request';
import { myCustomMessageList, mySystemMessageList } from '@/api/ssr/my';
import NotificationsPageRender from './_render';
import { convertParams } from '@/api/common/functions';

// getCustomMessageList 从服务端获取普通消息列表数据
async function getCustomMessageList(params?: messageListRequest) {
  try {
    const response = await myCustomMessageList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// getSystemMessageList 从服务端获取系统消息列表数据
async function getSystemMessageList(params?: messageListRequest) {
  try {
    const response = await mySystemMessageList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// 关键：不直接解构 searchParams，而是通过 props 整体获取
const NotificationsPage = async ({ searchParams }: any) => {
  const params = convertParams(await searchParams);
  const [customMessageData, systemMessageData] = await Promise.all([
    getCustomMessageList(params),
    getSystemMessageList(params),
  ]);
  return (
    <>
      <NotificationsPageRender 
        initialCustomMessageData={customMessageData} 
        initialSystemMessageData={systemMessageData} 
      />
    </>
  );
};

export default NotificationsPage;
