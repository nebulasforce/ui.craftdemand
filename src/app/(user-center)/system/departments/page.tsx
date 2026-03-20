import type { listRequest } from '@/api/department/request';
import { departmentList } from '@/api/ssr/department';
import DepartmentsPageRender from './_render';
import { convertParams } from '@/api/common/functions';

async function getDepartmentList(params?: listRequest) {
  try {
    const response = await departmentList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

const DepartmentsPage = async ({ searchParams }: any) => {
  const params = convertParams(await searchParams);
  const data = await getDepartmentList(params);
  return <DepartmentsPageRender initialData={data} />;
};

export default DepartmentsPage;
