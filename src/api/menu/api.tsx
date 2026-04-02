import { Options } from '@/api/common/request';
import {
  listFrontRequest,
  listRequest,
  getMenuRequest,
  createMenuRequest,
  editMenuRequest,
  deleteMenuRequest,
  setMenuCodeRequest,
  bindMenuApisRequest,
} from '@/api/menu/request';
import {
  listFrontResponse,
  listResponse,
  getMenuResponse,
  createMenuResponse,
  editMenuResponse,
  deleteMenuResponse,
  listMenuTypesResponse,
  setMenuCodeResponse,
  bindMenuApisResponse,
} from '@/api/menu/response';
import request from '@/utils/request';

// listFront
export async function listFront(req?: listFrontRequest, options?: Options) {
  return request<listFrontResponse>({
    url: '/api/v1/menu/front',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// list 获取菜单列表
export async function list(req?: listRequest, options?: Options) {
  return request<listResponse>({
    url: '/api/v1/menu',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// getMenu 获取菜单详情
export async function getMenu(req?: getMenuRequest, options?: Options) {
  return request<getMenuResponse>({
    url: `/api/v1/menu/${req?.id}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: req || {},
    ...(options || {}),
  });
}

// createMenu 创建菜单
export async function createMenu(req?: createMenuRequest, options?: Options) {
  return request<createMenuResponse>({
    url: '/api/v1/menu/add',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: req || {},
    ...(options || {}),
  });
}

// editMenu 编辑菜单
export async function editMenu(req?: editMenuRequest, options?: Options) {
  return request<editMenuResponse>({
    url: `/api/v1/menu/${req?.id}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: req || {},
    ...(options || {}),
  });
}

// deleteMenu 删除菜单
export async function deleteMenu(req?: deleteMenuRequest, options?: Options) {
  return request<deleteMenuResponse>({
    url: '/api/v1/menu/delete',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: req || {},
    ...(options || {}),
  });
}

// listMenuTypes 获取菜单类型映射
export async function listMenuTypes(options?: Options) {
  return request<listMenuTypesResponse>({
    url: '/api/v1/menu/types',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    ...(options || {}),
  });
}

// setMenuCode 设置菜单权限展示码
export async function setMenuCode(req?: setMenuCodeRequest, options?: Options) {
  const { id, ...body } = req || { id: '', code: '' };
  return request<setMenuCodeResponse>({
    url: `/api/v1/menu/${id}/code`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { code: body.code },
    ...(options || {}),
  });
}

// bindMenuApis 绑定菜单与接口
export async function bindMenuApis(req?: bindMenuApisRequest, options?: Options) {
  const { id, apiIds } = req || { id: '', apiIds: [] };
  return request<bindMenuApisResponse>({
    url: `/api/v1/menu/${id}/apis`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { apiIds: apiIds ?? [] },
    ...(options || {}),
  });
}
