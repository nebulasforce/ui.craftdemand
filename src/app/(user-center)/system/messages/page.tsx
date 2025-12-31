import type { listRequest } from '@/api/message/request';
import { messageList } from '@/api/ssr/message';
import { listAllAccount } from '@/api/ssr/account';
import MessagesPageRender from './_render';
import { convertParams } from '@/api/common/functions';

// getMessageList 从服务端获取消息列表数据
async function getMessageList(params?: listRequest) {
  try {
    const response = await messageList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// getAccountList 从服务端获取账户列表数据
async function getAccountList() {
  try {
    const response = await listAllAccount({});
    return response.data || [];
  } catch (error) {
    return [];
  }
}

// 关键：不直接解构 searchParams，而是通过 props 整体获取
const MessagesPage = async ({ searchParams } :any) => {
  const params = convertParams(await searchParams);
  const [data, accountList] = await Promise.all([
    getMessageList(params),
    getAccountList(),
  ]);
  return (
    <>
      <MessagesPageRender initialData={data} initialAccountList={accountList} />
    </>
  );
};

export default MessagesPage;
