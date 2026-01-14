import type { listRequest } from '@/api/account/request';
import { list } from '@/api/ssr/account';
import AccountsPageRender from './_render';
import { convertParams } from '@/api/common/functions';

// getAccountList 从服务端获取账号列表数据
async function getAccountList(params?: listRequest) {
  try {
    const response = await list(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}


// 关键：不直接解构 searchParams，而是通过 props 整体获取
const AccountsPage = async ({ searchParams } :any) => {
  const params = convertParams(await searchParams);
  const data = await getAccountList(params);
  return (
    <>
      <AccountsPageRender initialData={data}  />
    </>
  );
};

export default AccountsPage;
