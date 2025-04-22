import { Course, CourseSearchParams, CourseCreateRequest, CourseUpdateRequest, CourseType, CourseStatus } from './types';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types';
import { mockApiResponse, mockCourses, mockPaginatedResponse } from './mock';

// Import shared config
import { request, USE_MOCK } from '../config';

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
  DELETE: (id: string) => `/lesson/api/courses/delete/${id}`,
};

// 课程相关接口
export const course = {
  // 获取课程列表
  getList: async (params?: PaginationParams & Partial<CourseSearchParams>): Promise<PaginatedResponse<Course>> => {
    if (USE_MOCK) {
      // 模拟获取课程列表
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredCourses = [...mockCourses];

      // 应用搜索条件
      if (params?.searchText) {
        const searchText = params.searchText.toLowerCase();
        filteredCourses = filteredCourses.filter(course =>
          course.name.toLowerCase().includes(searchText) ||
          course.description?.toLowerCase().includes(searchText)
        );
      }

      if (params?.selectedType) {
        filteredCourses = filteredCourses.filter(course =>
          course.type === params.selectedType
        );
      }

      if (params?.selectedStatus) {
        filteredCourses = filteredCourses.filter(course =>
          course.status === params.selectedStatus
        );
      }

      // 按校区ID筛选
      if (params?.campusId) {
        filteredCourses = filteredCourses.filter(course =>
          course.campusId === params.campusId
        );
      }

      // 应用排序
      if (params?.sortOrder) {
        switch (params.sortOrder) {
          case 'priceAsc':
            filteredCourses.sort((a, b) => a.price - b.price);
            break;
          case 'priceDesc':
            filteredCourses.sort((a, b) => b.price - a.price);
            break;
          case 'nameAsc':
            filteredCourses.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'nameDesc':
            filteredCourses.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default:
            break;
        }
      }

      // 应用分页
      const { page = 1, pageSize = 10 } = params || {};
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredCourses.slice(start, end);

      const response = mockPaginatedResponse(list, page, pageSize, filteredCourses.length);
      return response.data;
    }

    // Use imported config and path constants
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.searchText) queryParams.append('keyword', params.searchText);
    if (params?.selectedType) queryParams.append('type', params.selectedType);
    if (params?.selectedStatus) queryParams.append('status', params.selectedStatus);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
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
    const response = await request(`${cacheKey}`) as PaginatedResponse<Course>;

    // 更新缓存
    courseListCache[cacheKey] = {
      data: response,
      timestamp: currentTime
    };

    return response;
  },

  // 获取课程详情
  getDetail: async (id: string): Promise<Course> => {
    if (USE_MOCK) {
      // 模拟获取课程详情
      await new Promise(resolve => setTimeout(resolve, 500));

      const course = mockCourses.find(c => c.id === id);

      if (!course) {
        throw new Error('课程不存在');
      }

      return course;
    }

    // Use imported config and path constants
    // 使用导入的 request 和 API 路径常量
    return request(`${COURSE_API_PATHS.DETAIL(id)}`);
  },

  // 添加课程
  add: async (data: CourseCreateRequest): Promise<string> => {
    // 添加课程时清除课程列表缓存
    clearCourseListCache();

    if (USE_MOCK) {
      // 模拟添加课程
      await new Promise(resolve => setTimeout(resolve, 1000));

      const now = new Date().toISOString();
      const newCourse: Course = {
        ...data,
        id: String(mockCourses.length + 1),
        coachNames: ['模拟教练'],
        type: CourseType.PRIVATE,
        campusName: '模拟校区',
        institutionId: 1,
        institutionName: '模拟机构',
        consumedHours: 0,
        createdTime: now,
        updateTime: now,
        coachIds: (data.coachIds || []).map(id => String(id))
      };

      mockCourses.push(newCourse);

      return newCourse.id;
    }

    // 确保 coachIds 是数字数组
    let coachIds = data.coachIds || [];
    if (!Array.isArray(coachIds)) {
      coachIds = [coachIds].filter(Boolean);
    }
    // 确保所有元素都是数字
    coachIds = coachIds.map(id => Number(id));

    // 确保课程描述为空字符串而不是undefined
    const description = data.description || '';

    // 确保 typeId 是数字类型
    const typeId = data.typeId ? Number(data.typeId) : undefined;

    const requestData = {
      ...data,
      coachIds: coachIds,
      description: description,
      typeId: typeId // 显式设置 typeId
    };

    console.log('发送课程创建请求数据:', requestData);
    console.log('课程类型 ID (typeId):', requestData.typeId);

    // Use imported config and path constants
    // 使用导入的 request 和 API 路径常量
    const response = await request(`${COURSE_API_PATHS.ADD}`, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    return response.data;
  },

  // 更新课程
  update: async (data: CourseUpdateRequest): Promise<void> => {
    // 更新课程时清除课程列表缓存
    clearCourseListCache();

    if (USE_MOCK) {
      // 模拟更新课程
      await new Promise(resolve => setTimeout(resolve, 800));

      const index = mockCourses.findIndex(c => c.id === data.id);

      if (index === -1) {
        throw new Error('课程不存在');
      }

      const updatedCourse = {
        ...mockCourses[index],
        ...data,
        updateTime: new Date().toISOString()
      };

      mockCourses[index] = {
        ...updatedCourse,
        coachIds: updatedCourse.coachIds.map(id => String(id))
      } as Course;

      return;
    }

    // 确保 coachIds 是数字数组
    let coachIds = data.coachIds || [];
    if (!Array.isArray(coachIds)) {
      coachIds = [coachIds].filter(Boolean);
    }
    // 确保所有元素都是数字
    coachIds = coachIds.map(id => Number(id));

    // 确保课程描述为空字符串而不是undefined
    const description = data.description || '';

    // 确保 typeId 是数字类型
    const typeId = data.typeId ? Number(data.typeId) : undefined;

    const requestData = {
      ...data,
      coachIds: coachIds,
      description: description,
      typeId: typeId // 显式设置 typeId
    };

    console.log('更新课程时的 typeId:', requestData.typeId);

    console.log('发送课程更新请求数据:', requestData);

    // Use imported config and path constants
    // 使用导入的 request 和 API 路径常量
    await request(`${COURSE_API_PATHS.UPDATE}`, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    return;
  },

  // 删除课程
  delete: async (id: string): Promise<void> => {
    // 删除课程时清除课程列表缓存
    clearCourseListCache();

    if (USE_MOCK) {
      // 模拟删除课程
      await new Promise(resolve => setTimeout(resolve, 600));

      const index = mockCourses.findIndex(c => c.id === id);

      if (index === -1) {
        throw new Error('课程不存在');
      }

      mockCourses.splice(index, 1);

      return;
    }

    // Use imported config and path constants
    // 使用导入的 request 和 API 路径常量
    await request(`${COURSE_API_PATHS.DELETE(id)}`, {
      method: 'POST'
    });

    return;
  }
};
