import { Options } from '@/api/common/request';
import {
  listFrontRequest,
  listRequest,
  getMenuRequest,
  createMenuRequest,
  editMenuRequest,
  deleteMenuRequest,
} from '@/api/menu/request';
import {
  listFrontResponse,
  listResponse,
  getMenuResponse,
  createMenuResponse,
  editMenuResponse,
  deleteMenuResponse,
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
