import type { listRequest } from '@/api/navbar/request';
import { navbarList, navbarListLabels } from '@/api/ssr/navbar';
import NavbarsPageRender from './_render';
import { convertParams } from '@/api/common/functions';

// getNavbarList 从服务端获取导航栏列表数据
async function getNavbarList(params?: listRequest) {
  try {
    const response = await navbarList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// getNavbarLabels 从服务端获取标签列表数据
async function getNavbarLabels(): Promise<string[]> {
  try {
    const response = await navbarListLabels();
    return response.data || [];
  } catch (error) {
    return [];
  }
}

// 关键：不直接解构 searchParams，而是通过 props 整体获取
const NavbarsPage = async ({ searchParams }: any) => {
  const params = convertParams(await searchParams);
  const [data, labels] = await Promise.all([
    getNavbarList(params),
    getNavbarLabels(),
  ]);
  return (
    <>
      <NavbarsPageRender initialData={data} labelOptions={labels} />
    </>
  );
};

export default NavbarsPage;
