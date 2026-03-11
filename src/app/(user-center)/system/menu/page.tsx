import type { listRequest } from '@/api/menu/request';
import { menuList } from '@/api/ssr/menu';
import MenuPageRender from './_render';
import { convertParams } from '@/api/common/functions';

async function getMenuList(params?: listRequest) {
  try {
    const response = await menuList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

const MenuPage = async ({ searchParams }: any) => {
  const params = convertParams(await searchParams);
  const data = await getMenuList(params);
  return <MenuPageRender initialData={data} />;
};

export default MenuPage;
