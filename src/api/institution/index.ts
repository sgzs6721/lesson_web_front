import { Institution } from './types';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types';
import { mockApiResponse, mockInstitutions, mockPaginatedResponse } from './mock';

// Import shared config
import { API_HOST, request, USE_MOCK } from '../config';

// API Path Constants
const INSTITUTION_API_PATHS = {
  LIST: '/api/institutions',
  DETAIL: (id: string) => `/api/institutions/${id}`,
  ADD: '/api/institutions',
  UPDATE: (id: string) => `/api/institutions/${id}`,
  DELETE: (id: string) => `/api/institutions/${id}`,
};

// 机构相关接口
export const institution = {
  // 获取机构列表
  getList: async (params?: PaginationParams): Promise<PaginatedResponse<Institution>> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const { page = 1, pageSize = 10 } = params || {};
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = mockInstitutions.slice(start, end);
      return mockPaginatedResponse(list, page, pageSize, mockInstitutions.length);
    }
    const queryParams = params ? `?page=${params.page}&pageSize=${params.pageSize}` : '';
    return request(`${API_HOST}${INSTITUTION_API_PATHS.LIST}${queryParams}`);
  },
  
  // 获取机构详情
  getDetail: async (id: string): Promise<Institution> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const institution = mockInstitutions.find(i => i.id === id);
      if (!institution) {
        throw new Error('机构不存在');
      }
      return institution;
    }
    return request(`${API_HOST}${INSTITUTION_API_PATHS.DETAIL(id)}`);
  },
  
  // 添加机构
  add: async (data: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>): Promise<Institution> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const now = new Date().toISOString();
      const newInstitution: Institution = { ...data, id: String(mockInstitutions.length + 1), createdAt: now, updatedAt: now };
      mockInstitutions.push(newInstitution);
      return newInstitution;
    }
    return request(`${API_HOST}${INSTITUTION_API_PATHS.ADD}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 更新机构
  update: async (id: string, data: Partial<Institution>): Promise<Institution> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockInstitutions.findIndex(i => i.id === id);
      if (index === -1) { throw new Error('机构不存在'); }
      const updatedInstitution = { ...mockInstitutions[index], ...data, updatedAt: new Date().toISOString() };
      mockInstitutions[index] = updatedInstitution;
      return updatedInstitution;
    }
    return request(`${API_HOST}${INSTITUTION_API_PATHS.UPDATE(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  // 删除机构
  delete: async (id: string): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockInstitutions.findIndex(i => i.id === id);
      if (index === -1) { throw new Error('机构不存在'); }
      mockInstitutions.splice(index, 1);
      return null;
    }
    return request(`${API_HOST}${INSTITUTION_API_PATHS.DELETE(id)}`, {
      method: 'DELETE'
    });
  }
};
