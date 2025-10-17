import { convertParams } from '@/api/common/functions';
import { messageListRequest } from '@/api/message/request';
import { messageList } from '@/api/ssr/message';
import MessagesPageRender from './_render';

// getMySubAccountList 从服务端获取子账户列表数据
async function getMessageList(params?: messageListRequest) {
  try {
    const response = await messageList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// 关键：不直接解构 searchParams，而是通过 props 整体获取
const MessagePage = async ({ searchParams } :any) => {
  const params = convertParams(await searchParams);
  const data = await getMessageList(params);

  return (
    <>
      <MessagesPageRender initialData={data} />
    </>
  );
};

export default MessagePage;
