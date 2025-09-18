import type { mySubAccountListRequest } from '@/api/my/request';
import { mySubAccountList } from '@/api/ssr/my';
import SecurityPageRender from './_render';



// getMySubAccountList 从服务端获取子账户列表数据
async function getMySubAccountList(params?: mySubAccountListRequest) {
  try {
    const response = await mySubAccountList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

const convertParams = (searchParams: any): mySubAccountListRequest => {
    const params:mySubAccountListRequest = {}
    // 遍历所有 searchParams 并自动转换
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined) {continue;}

      // 处理数组参数（取第一个值）
      const stringValue = Array.isArray(value) ? value[0] : value;

      // 尝试转换为数字（如果是数字字符串）
      const numValue = parseInt(stringValue, 10);
      if (!isNaN(numValue) && stringValue === numValue.toString()) {
        params[key] = numValue;
      } else {
        params[key] = stringValue;
      }
    }

    return params;
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
