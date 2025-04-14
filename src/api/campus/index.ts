import { Campus, CampusCreateParams, CampusQueryParams, CampusListResponse, CampusDetailResponse, CampusCreateResponse } from './types';
import { PaginationParams, PaginatedResponse } from '../types';
import { mockApiResponse, mockCampuses, mockPaginatedResponse } from './mock';

// Import shared config
import { request, USE_MOCK } from '../config';

// API Path Constants
const CAMPUS_API_PATHS = {
  LIST: '/lesson/api/campus/list',
  DETAIL: (id: string) => `/lesson/api/campus/detail?id=${id}`,
  CREATE: '/lesson/api/campus/create',
  UPDATE: '/lesson/api/campus/update',
  DELETE: (id: string) => `/lesson/api/campus/delete?id=${id}`,
  UPDATE_STATUS: (id: string, status: number) => `/lesson/api/campus/updateStatus?id=${id}&status=${status}`,
  SIMPLE_LIST: '/lesson/api/campus/simple/list'
};

// 校区相关接口
export const campus = {
  // 获取校区列表
  getList: async (params?: CampusQueryParams): Promise<PaginatedResponse<Campus>> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const { page = 1, pageSize = 10 } = params || {};
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      // 过滤数据
      let filteredCampuses = [...mockCampuses];
      if (params?.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredCampuses = filteredCampuses.filter(campus =>
          campus.name.toLowerCase().includes(keyword) ||
          campus.address.toLowerCase().includes(keyword) ||
          (campus.phone ? campus.phone.includes(keyword) : false)
        );
      }

      if (params?.status) {
        filteredCampuses = filteredCampuses.filter(campus =>
          campus.status === params.status
        );
      }

      const list = filteredCampuses.slice(start, end);
      const response = mockPaginatedResponse(list, page, pageSize, filteredCampuses.length);
      return response.data;
    }

    // 构建查询参数
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('pageNum', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.keyword) queryParams.append('keyword', params.keyword);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return request(`${CAMPUS_API_PATHS.LIST}${queryString}`);
  },

  // 获取校区详情
  getDetail: async (id: string): Promise<Campus> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const campus = mockCampuses.find(c => c.id === id);
      if (!campus) {
        throw new Error('校区不存在');
      }
      return campus;
    }
    return request(`${CAMPUS_API_PATHS.DETAIL(id)}`);
  },

  // 添加校区
  create: async (data: CampusCreateParams): Promise<string> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newId = String(mockCampuses.length + 1);
      const newCampus: Campus = {
        ...data,
        id: newId,
        status: data.status || 'OPERATING',
        studentCount: 0,
        coachCount: 0,
        courseCount: 0
      };
      mockCampuses.push(newCampus);
      return newId;
    }
    return request(`${CAMPUS_API_PATHS.CREATE}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 更新校区
  update: async (id: string, data: Partial<Campus>): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockCampuses.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('校区不存在');
      }
      mockCampuses[index] = { ...mockCampuses[index], ...data };
      return null;
    }
    // 将id包含在请求体中
    const updateData = {
      id,
      ...data
    };
    return request(CAMPUS_API_PATHS.UPDATE, {
      method: 'POST',
      body: JSON.stringify(updateData)
    });
  },

  // 删除校区
  delete: async (id: string): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockCampuses.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('校区不存在');
      }
      mockCampuses.splice(index, 1);
      return null;
    }
    // 使用POST方法和查询参数
    return request(`${CAMPUS_API_PATHS.DELETE(id)}`, {
      method: 'POST'
    });
  },

  // 更新校区状态
  updateStatus: async (id: string, status: number): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockCampuses.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('校区不存在');
      }
      mockCampuses[index].status = status === 1 ? 'OPERATING' : 'CLOSED';
      return null;
    }
    // 使用查询参数而不是请求体
    return request(CAMPUS_API_PATHS.UPDATE_STATUS(id, status), {
      method: 'POST'
    });
  }
};
