import type { listRequest } from '@/api/headDropdown/request';
import { headDropdownList, listGroup as headDropdownListGroup } from '@/api/ssr/headDropdown';
import HeaderDropdownsPageRender from './_render';
import { convertParams } from '@/api/common/functions';

// getHeadDropdownList 从服务端获取头部下拉列表数据
async function getHeadDropdownList(params?: listRequest) {
  try {
    const response = await headDropdownList(params);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

// getHeadDropdownGroups 从服务端 ListGroup 接口获取分组列表（用作高级筛选与新增/编辑弹窗的分组选项）
async function getHeadDropdownGroups(): Promise<string[]> {
  try {
    const response = await headDropdownListGroup();
    const data = response.data;
    if (!data || typeof data !== 'object') return [];
    return Object.keys(data);
  } catch (error) {
    return [];
  }
}

// 关键：不直接解构 searchParams，而是通过 props 整体获取
const HeaderDropdownsPage = async ({ searchParams }: any) => {
  const params = convertParams(await searchParams);
  const [data, groupOptions] = await Promise.all([
    getHeadDropdownList(params),
    getHeadDropdownGroups(),
  ]);

  return (
    <>
      <HeaderDropdownsPageRender initialData={data} groupOptions={groupOptions} />
    </>
  );
};

export default HeaderDropdownsPage;

