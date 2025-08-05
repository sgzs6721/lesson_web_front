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
  CoachStatusUpdateResponse,
  CoachSimple,
  CoachSimpleListResponse
} from './types';
import { PaginatedResponse } from '../types';

// Import shared config
import { request, API_HOST } from '../config';

// API Path Constants
const COACH_API_PATHS = {
  LIST: '/lesson/api/coach/list',
  DETAIL: (id: string | number, campusId?: string | number) =>
    `/lesson/api/coach/detail?id=${id}${campusId ? `&campusId=${campusId}` : ''}`,
  CREATE: '/lesson/api/coach/create',
  UPDATE: '/lesson/api/coach/update',
  DELETE: (id: string | number) => `/lesson/api/coach/delete?id=${id}`,
  UPDATE_STATUS: '/lesson/api/coach/updateStatus',
  SIMPLE_LIST: '/lesson/api/coach/simple/list'
};

// 教练管理相关接口
export const coach = {
  // 获取教练列表
  getList: async (params?: CoachQueryParams): Promise<PaginatedResponse<Coach>> => {
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
      queryParams.append('campusId', String(params.campusId));
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
  getDetail: async (id: string | number, campusId?: string | number): Promise<Coach> => {
    // 如果没有提供campusId，尝试从localStorage获取
    const currentCampusId = localStorage.getItem('currentCampusId');
    let finalCampusId = campusId;

    if (!finalCampusId && currentCampusId) {
      finalCampusId = Number(currentCampusId);
    }

    if (!finalCampusId) {
      console.warn('获取教练详情时没有提供campusId，将使用默认值');
    }

    const response: CoachDetailResponse = await request(COACH_API_PATHS.DETAIL(id, finalCampusId));
    return response.data;
  },

  // 创建教练
  create: async (data: CoachCreateParams): Promise<string | number> => {
    console.log('创建教练API请求数据:', data);

    const response: CoachCreateResponse = await request(COACH_API_PATHS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 更新教练
  update: async (data: CoachUpdateParams): Promise<null> => {
    console.log('发送教练更新请求:', data);

    const response: CoachUpdateResponse = await request(COACH_API_PATHS.UPDATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 删除教练
  delete: async (id: string | number): Promise<null> => {
    const response: CoachDeleteResponse = await request(COACH_API_PATHS.DELETE(id), {
      method: 'POST'
    });

    return response.data;
  },

  // 更新教练状态
  updateStatus: async (data: CoachStatusUpdateParams): Promise<null> => {
    const response: CoachStatusUpdateResponse = await request(COACH_API_PATHS.UPDATE_STATUS, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 获取教练简单列表
  getSimpleList: async (campusId?: string | number): Promise<CoachSimple[]> => {
    try {
      // 如果没有提供campusId，尝试从localStorage获取
      const currentCampusId = localStorage.getItem('currentCampusId');
      let finalCampusId = campusId;

      if (!finalCampusId && currentCampusId) {
        finalCampusId = currentCampusId;
      }

      if (!finalCampusId) {
        console.warn('获取教练简单列表时没有提供campusId，将使用默认值');
        finalCampusId = '1'; // 使用默认值
      }

      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('campusId', String(finalCampusId));

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response: CoachSimpleListResponse = await request(`${COACH_API_PATHS.SIMPLE_LIST}${queryString}`);

      // 确保返回的教练ID是数字类型
      const formattedCoaches = response.data.map(coach => ({
        ...coach,
        id: Number(coach.id) // 转换为数字类型
      }));

      console.log('获取教练简单列表成功:', formattedCoaches);
      return formattedCoaches;
    } catch (error) {
      console.error('获取教练简单列表失败:', error);
      return [];
    }
  }
};
