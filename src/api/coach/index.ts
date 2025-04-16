import {
  Coach,
  CoachQueryParams,
  CoachCreateParams,
  CoachUpdateParams,
  CoachStatusUpdateParams,
  CoachListResponse,
  CoachDetailResponse,
  CoachCreateResponse,
  CoachUpdateResponse,
  CoachDeleteResponse,
  CoachStatusUpdateResponse
} from './types';
import { PaginatedResponse } from '../types';
import { mockApiResponse, mockCoaches, mockPaginatedResponse } from './mock';

// Import shared config
import { request, USE_MOCK, API_HOST } from '../config';

// API Path Constants
const COACH_API_PATHS = {
  LIST: '/lesson/api/coach/list',
  DETAIL: (id: string | number) => `/lesson/api/coach/detail?id=${id}`,
  CREATE: '/lesson/api/coach/create',
  UPDATE: '/lesson/api/coach/update',
  DELETE: (id: string | number) => `/lesson/api/coach/delete?id=${id}`,
  UPDATE_STATUS: '/lesson/api/coach/updateStatus'
};

// 教练管理相关接口
export const coach = {
  // 获取教练列表
  getList: async (params?: CoachQueryParams): Promise<PaginatedResponse<Coach>> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // 过滤数据
      let filteredCoaches = [...mockCoaches];

      if (params?.name) {
        filteredCoaches = filteredCoaches.filter(coach =>
          coach.name.includes(params.name || '')
        );
      }

      if (params?.phone) {
        filteredCoaches = filteredCoaches.filter(coach =>
          coach.phone.includes(params.phone || '')
        );
      }

      if (params?.keyword) {
        filteredCoaches = filteredCoaches.filter(coach =>
          coach.name.includes(params.keyword || '') ||
          coach.phone.includes(params.keyword || '') ||
          coach.jobTitle.includes(params.keyword || '')
        );
      }

      if (params?.status) {
        filteredCoaches = filteredCoaches.filter(coach =>
          coach.status === params.status
        );
      }

      if (params?.jobTitle) {
        filteredCoaches = filteredCoaches.filter(coach =>
          coach.jobTitle.includes(params.jobTitle || '')
        );
      }

      if (params?.campusId) {
        filteredCoaches = filteredCoaches.filter(coach =>
          coach.campusId === params.campusId
        );
      }

      if (params?.campusIds && params.campusIds.length > 0) {
        filteredCoaches = filteredCoaches.filter(coach =>
          params.campusIds?.includes(coach.campusId || '')
        );
      }

      // 排序
      if (params?.sortField) {
        filteredCoaches = [...filteredCoaches].sort((a, b) => {
          const aValue = a[params.sortField as keyof Coach];
          const bValue = b[params.sortField as keyof Coach];

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return params.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
          }

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return params.sortOrder === 'desc'
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }

          return 0;
        });
      }

      // 分页
      const pageNum = params?.pageNum || 1;
      const pageSize = params?.pageSize || 10;
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedCoaches = filteredCoaches.slice(start, end);

      return mockPaginatedResponse(paginatedCoaches, pageNum, pageSize, filteredCoaches.length);
    }

    // 构建查询参数
    const queryParams = new URLSearchParams();

    // 分页参数
    queryParams.append('pageNum', String(params?.pageNum || 1));
    queryParams.append('pageSize', String(params?.pageSize || 10));

    // 搜索参数
    if (params?.name) queryParams.append('name', params.name);
    if (params?.phone) queryParams.append('phone', params.phone);
    if (params?.keyword) queryParams.append('keyword', params.keyword);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.jobTitle) queryParams.append('jobTitle', params.jobTitle);

    // 校区筛选 - 支持多选
    if (params?.campusIds && params.campusIds.length > 0) {
      params.campusIds.forEach(campusId => {
        queryParams.append('campusIds', String(campusId));
      });
    } else if (params?.campusId) {
      queryParams.append('campusIds', String(params.campusId));
    }

    // 排序参数
    if (params?.sortField) {
      queryParams.append('sortField', params.sortField);
      queryParams.append('sortOrder', params.sortOrder || 'asc');
    }

    console.log('教练列表请求参数:', queryParams.toString());

    // 使用GET方法发送请求
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response: CoachListResponse = await request(`${COACH_API_PATHS.LIST}${queryString}`);
    return response.data;
  },

  // 获取教练详情
  getDetail: async (id: string | number): Promise<Coach> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));

      const coach = mockCoaches.find(coach => coach.id === id);
      if (!coach) {
        throw new Error('教练不存在');
      }

      return coach;
    }

    const response: CoachDetailResponse = await request(COACH_API_PATHS.DETAIL(id));
    return response.data;
  },

  // 创建教练
  create: async (data: CoachCreateParams): Promise<string | number> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 检查手机号是否已存在
      const existingCoach = mockCoaches.find(coach => coach.phone === data.phone);
      if (existingCoach) {
        throw new Error('该手机号已被注册');
      }

      // 创建新教练
      const newId = mockCoaches.length + 1;
      const newCoach: Coach = {
        id: newId,
        ...data,
        // 确保字段名一致性
        socialInsurance: data.socialInsurance,
        classFee: data.classFee
      };

      mockCoaches.push(newCoach);
      return newId;
    }

    console.log('创建教练API请求数据:', data);

    const response: CoachCreateResponse = await request(COACH_API_PATHS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 更新教练
  update: async (data: CoachUpdateParams): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // 查找教练
      const coachIndex = mockCoaches.findIndex(coach => coach.id === data.id);
      if (coachIndex === -1) {
        throw new Error('教练不存在');
      }

      // 如果更新手机号，检查是否已存在
      if (data.phone && data.phone !== mockCoaches[coachIndex].phone) {
        const existingCoach = mockCoaches.find(coach => coach.phone === data.phone && coach.id !== data.id);
        if (existingCoach) {
          throw new Error('该手机号已被其他教练使用');
        }
      }

      // 更新教练
      mockCoaches[coachIndex] = {
        ...mockCoaches[coachIndex],
        ...data,
        // 确保字段名一致性
        socialInsurance: data.socialInsurance,
        classFee: data.classFee
      };

      return null;
    }

    console.log('发送教练更新请求:', data);

    const response: CoachUpdateResponse = await request(COACH_API_PATHS.UPDATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 删除教练
  delete: async (id: string | number): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // 查找教练
      const coachIndex = mockCoaches.findIndex(coach => coach.id === id);
      if (coachIndex === -1) {
        throw new Error('教练不存在');
      }

      // 删除教练
      mockCoaches.splice(coachIndex, 1);

      return null;
    }

    const response: CoachDeleteResponse = await request(COACH_API_PATHS.DELETE(id), {
      method: 'POST'
    });

    return response.data;
  },

  // 更新教练状态
  updateStatus: async (data: CoachStatusUpdateParams): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // 查找教练
      const coachIndex = mockCoaches.findIndex(coach => coach.id === data.id);
      if (coachIndex === -1) {
        throw new Error('教练不存在');
      }

      // 更新状态
      mockCoaches[coachIndex].status = data.status;

      return null;
    }

    const response: CoachStatusUpdateResponse = await request(COACH_API_PATHS.UPDATE_STATUS, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  }
};
