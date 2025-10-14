import type { mySubAccountListRequest } from '@/api/my/request';
import { mySubAccountList } from '@/api/ssr/my';
import SecurityPageRender from './_render';
import { convertParams } from '@/api/common/functions';

// getMySubAccountList 从服务端获取子账户列表数据
async function getMySubAccountList(params?: mySubAccountListRequest) {
  try {
    const response = await mySubAccountList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}



// 关键：不直接解构 searchParams，而是通过 props 整体获取
const SubAccountsPage = async ({ searchParams } :any) => {
  const params = convertParams(await searchParams);
  const data = await getMySubAccountList(params);

  return (
    <>
      <SecurityPageRender initialData={data} />
    </>
  );
};

export default SubAccountsPage;
