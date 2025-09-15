import { Course, CourseSearchParams, CourseCreateRequest, CourseUpdateRequest, CourseType, CourseStatus, CourseListParams } from './types';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types';

// Import shared config
import { request, API_HOST } from '../config';
import { SimpleCourse } from './types';

// 课程列表缓存机制
// 缓存对象，键为查询参数字符串，值为缓存的响应和时间戳
let courseListCache: {
  [key: string]: {
    data: PaginatedResponse<Course>;
    timestamp: number;
  }
} = {};

// 缓存过期时间（毫秒）
const COURSE_LIST_CACHE_EXPIRY = 30000; // 30秒

// 清除课程列表缓存
export const clearCourseListCache = () => {
  console.log('清除课程列表缓存');
  courseListCache = {};
};

// API Path Constants
const COURSE_API_PATHS = {
  LIST: '/lesson/api/courses/list',
  DETAIL: (id: string) => `/lesson/api/courses/detail/${id}`,
  ADD: '/lesson/api/courses/create',
  UPDATE: '/lesson/api/courses/update',
  DELETE: (id: string) => `/lesson/api/courses/delete?id=${id}`,
  SIMPLE_LIST: '/lesson/api/courses/simple',
  SHARING_BATCH_DELETE: '/lesson/api/course/sharing/batch-delete'
};

// 课程相关接口
export const course = {
  // 获取课程列表
  getList: async (params?: CourseListParams): Promise<PaginatedResponse<Course>> => {

    // Use imported config and path constants
    const queryParams = new URLSearchParams();

    if (params?.pageNum) queryParams.append('pageNum', params.pageNum.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.keyword) {
      queryParams.append('keyword', String(params.keyword));
    } else if (params?.searchText) {
      queryParams.append('keyword', params.searchText);
    }

    // 课程类型参数处理 - 统一使用数组形式
    if (params?.selectedType && Array.isArray(params.selectedType) && params.selectedType.length > 0) {
      // 支持多个类型选择
      params.selectedType.forEach(typeId => {
        queryParams.append('typeIds', String(typeId));
      });
    } else if (params?.typeIds && Array.isArray(params.typeIds) && params.typeIds.length > 0) {
      // 直接支持typeIds数组参数
      params.typeIds.forEach(typeId => {
        queryParams.append('typeIds', String(typeId));
      });
    }

    // 修复状态过滤参数，确保传递字符串枚举名称
    if (params?.selectedStatus) {
      const statusKey = Object.keys(CourseStatus).find(
        key => CourseStatus[key as keyof typeof CourseStatus] === params.selectedStatus
      );
      if (statusKey) {
        queryParams.append('status', statusKey);
      } else {
        queryParams.append('status', String(params.selectedStatus));
      }
    }

    // 教练参数处理 - 统一使用数组形式
    if (params?.selectedCoach && Array.isArray(params.selectedCoach) && params.selectedCoach.length > 0) {
      // 支持多个教练选择
      params.selectedCoach.forEach(coachId => {
        queryParams.append('coachIds', String(coachId));
      });
    } else if (params?.coachIds && Array.isArray(params.coachIds) && params.coachIds.length > 0) {
      // 直接支持coachIds数组参数
      params.coachIds.forEach(coachId => {
        queryParams.append('coachIds', String(coachId));
      });
    }

    // 添加排序参数
    if (params?.sortField) {
      queryParams.append('sortField', params.sortField);
    }
    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    } else if (params?.sortField) {
      // 如果有sortField但没有sortOrder，默认使用desc
      queryParams.append('sortOrder', 'desc');
    } else {
      // 默认按创建时间降序排列
      queryParams.append('sortField', 'createdTime');
      queryParams.append('sortOrder', 'desc');
    }

    // 添加校区ID参数
    if (params?.campusId) queryParams.append('campusId', params.campusId.toString());
    // 如果未提供campusId，则尝试从localStorage获取当前校区ID
    else {
      const currentCampusId = localStorage.getItem('currentCampusId');
      if (currentCampusId) {
        queryParams.append('campusId', currentCampusId);
      }
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const cacheKey = `${COURSE_API_PATHS.LIST}${queryString}`;

    // 检查缓存
    const currentTime = Date.now();
    const cachedData = courseListCache[cacheKey];

    if (cachedData && (currentTime - cachedData.timestamp) < COURSE_LIST_CACHE_EXPIRY) {
      console.log(`使用缓存的课程列表数据, 缓存时间: ${(currentTime - cachedData.timestamp) / 1000}秒`);
      return cachedData.data;
    }

    // 如果没有缓存或缓存过期，发起请求
    console.log(`发起课程列表请求: ${cacheKey}`);
    const response = await request(`${cacheKey}`);

    // 检查响应格式
    if (response && response.code === 200 && response.data) {
      // 将响应数据转换为我们需要的格式
      const formattedResponse: PaginatedResponse<Course> = {
        list: response.data.list || [],
        total: response.data.total || 0,
        pageSize: params?.pageSize || 10,
        pageNum: params?.pageNum || 1
      };

      // 更新缓存
      courseListCache[cacheKey] = {
        data: formattedResponse,
        timestamp: currentTime
      };

      return formattedResponse;
    } else {
      console.error('课程列表响应格式错误:', response);
      return { list: [], total: 0, pageSize: params?.pageSize || 10, pageNum: params?.pageNum || 1 };
    }
  },

  // 获取课程详情
  getDetail: async (id: string): Promise<Course> => {

    // Use imported config and path constants
    // 使用导入的 request 和 API 路径常量
    return request(`${COURSE_API_PATHS.DETAIL(id)}`);
  },

  // 添加课程
  add: async (data: CourseCreateRequest): Promise<any> => {
    // 不再清除课程列表缓存
    // clearCourseListCache();


    // 使用导入的 request
    const res = await request(COURSE_API_PATHS.ADD, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  // 更新课程
  update: async (data: CourseUpdateRequest): Promise<void> => {
    // 不再清除课程列表缓存
    // clearCourseListCache();


    await request(COURSE_API_PATHS.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // 删除课程
  delete: async (id: string): Promise<void> => {
    // 不再清除课程列表缓存
    // clearCourseListCache();


    await request(COURSE_API_PATHS.DELETE(id), { method: 'DELETE' });
  },

  // 获取简化课程列表（用于下拉）
  getSimpleList: async (): Promise<SimpleCourse[]> => {

    // 附带 campusId 参数（从 localStorage 读取，默认 1）
    const campusId = (typeof window !== 'undefined' && localStorage.getItem('currentCampusId')) || '1';
    const url = `${COURSE_API_PATHS.SIMPLE_LIST}?campusId=${encodeURIComponent(campusId)}`;
    const res = await request(url);
    return res.data || [];
  },

  // 批量删除共享课程
  batchDeleteSharing: async (ids: number[]): Promise<any> => {
    console.log('批量删除共享课程，IDs:', ids);
    
    const response = await request(COURSE_API_PATHS.SHARING_BATCH_DELETE, {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
    
    console.log('批量删除共享课程响应:', response);
    return response;
  }
};

// 兼容旧调用：导出顶层函数名保持不变
export const getCourseSimpleList = async (): Promise<SimpleCourse[]> => {
  return course.getSimpleList();
};
