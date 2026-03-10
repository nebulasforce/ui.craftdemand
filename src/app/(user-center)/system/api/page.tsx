import type { listRequest } from '@/api/api/request';
import { apiList, apiModules } from '@/api/ssr/api';
import ApiPageRender from './_render';
import { convertParams } from '@/api/common/functions';

// getApiList 从服务端获取API列表数据
async function getApiList(params?: listRequest) {
  try {
    const response = await apiList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// getApiModules 从服务端获取模块列表数据
async function getApiModules() {
  try {
    const response = await apiModules();
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// 关键：不直接解构 searchParams，而是通过 props 整体获取
const ApiPage = async ({ searchParams }: any) => {
  const params = convertParams(await searchParams);
  const data = await getApiList(params);
  const modules = await getApiModules();

  return (
    <>
      <ApiPageRender initialData={data} initialModules={modules || []} />
    </>
  );
};

export default ApiPage;
