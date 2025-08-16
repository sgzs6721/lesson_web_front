import { Institution } from './types';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types';

// Import shared config
import { request } from '../config';

// API Path Constants
const INSTITUTION_API_PATHS = {
  LIST: '/lesson/api/institutions',
  DETAIL: (id: string) => `/lesson/api/institutions/${id}`,
  ADD: '/lesson/api/institutions',
  UPDATE: (id: string) => `/lesson/api/institutions/${id}`,
  DELETE: (id: string) => `/lesson/api/institutions/${id}`,
};

// 机构相关接口
export const institution = {
  // 获取机构列表
  getList: async (params?: PaginationParams): Promise<PaginatedResponse<Institution>> => {
    const queryParams = params ? `?page=${params.pageNum}&pageSize=${params.pageSize}` : '';
    return request(`${INSTITUTION_API_PATHS.LIST}${queryParams}`);
  },

  // 获取机构详情
  getDetail: async (id: string): Promise<Institution> => {
    return request(`${INSTITUTION_API_PATHS.DETAIL(id)}`);
  },

  // 添加机构
  add: async (data: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>): Promise<Institution> => {
    return request(`${INSTITUTION_API_PATHS.ADD}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 更新机构
  update: async (id: string, data: Partial<Institution>): Promise<Institution> => {
    return request(`${INSTITUTION_API_PATHS.UPDATE(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // 删除机构
  delete: async (id: string): Promise<null> => {
    return request(`${INSTITUTION_API_PATHS.DELETE(id)}`, {
      method: 'DELETE'
    });
  }
};
