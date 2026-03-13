import type { listRequest } from '@/api/role/request';
import { roleList } from '@/api/ssr/role';
import RolesPageRender from './_render';
import { convertParams } from '@/api/common/functions';

async function getRoleList(params?: listRequest) {
  try {
    const response = await roleList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

const RolesPage = async ({ searchParams }: any) => {
  const params = convertParams(await searchParams);
  const data = await getRoleList(params);
  return <RolesPageRender initialData={data} />;
};

export default RolesPage;

