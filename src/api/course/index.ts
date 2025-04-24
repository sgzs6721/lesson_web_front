import { Course, CourseSearchParams, CourseCreateRequest, CourseUpdateRequest, CourseType, CourseStatus, CourseListParams } from './types';
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
  DELETE: (id: string) => `/lesson/api/courses/delete?id=${id}`,
};

// 课程相关接口
export const course = {
  // 获取课程列表
  getList: async (params?: CourseListParams): Promise<PaginatedResponse<Course>> => {
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

      // 处理课程类型过滤（支持多选）
      if (params?.typeIds && params.typeIds.length > 0) {
        filteredCourses = filteredCourses.filter(course =>
          params.typeIds?.includes(course.type as CourseType)
        );
      } else if (params?.selectedType && params.selectedType.length > 0) {
        filteredCourses = filteredCourses.filter(course =>
          params.selectedType?.includes(course.type as CourseType)
        );
      }

      if (params?.selectedStatus !== undefined) {
        filteredCourses = filteredCourses.filter(course =>
          course.status === params.selectedStatus
        );
      }

      // 按教练ID筛选（支持多选）
      if (params?.coachIds && params.coachIds.length > 0) {
        filteredCourses = filteredCourses.filter(course => 
          course.coaches?.some(coach => params.coachIds?.includes(coach.id))
        );
      } else if (params?.selectedCoach && params.selectedCoach.length > 0) {
        filteredCourses = filteredCourses.filter(course => 
          course.coaches?.some(coach => params.selectedCoach?.includes(coach.id))
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
            // 默认按创建时间降序排列（最新的在前面）
            filteredCourses.sort((a, b) => new Date(b.createdTime || 0).getTime() - new Date(a.createdTime || 0).getTime());
            break;
        }
      } else {
        // 如果没有指定排序，默认按创建时间降序排列
        filteredCourses.sort((a, b) => new Date(b.createdTime || 0).getTime() - new Date(a.createdTime || 0).getTime());
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
    
    // 处理课程类型多选
    if (params?.typeIds && Array.isArray(params.typeIds) && params.typeIds.length > 0) {
      params.typeIds.forEach(typeId => {
        queryParams.append('typeIds', typeId.toString());
      });
    } else if (params?.selectedType && Array.isArray(params.selectedType) && params.selectedType.length > 0) {
      params.selectedType.forEach(typeId => {
        queryParams.append('typeIds', typeId.toString());
      });
    }
    
    // 修复状态过滤参数，确保传递字符串枚举名称而不是值
    if (params?.selectedStatus) {
      // 找出枚举名称（PUBLISHED, SUSPENDED, TERMINATED）而不是枚举值
      // CourseStatus是字符串枚举，我们需要获取枚举名称
      const statusKey = Object.keys(CourseStatus).find(
        key => CourseStatus[key as keyof typeof CourseStatus] === params.selectedStatus
      );
      if (statusKey) {
        queryParams.append('status', statusKey); // 传递枚举名称如"PUBLISHED"
        console.log('使用状态枚举名称作为查询参数:', statusKey);
      } else {
        queryParams.append('status', params.selectedStatus);
        console.log('未找到匹配的枚举名称，使用原始状态值:', params.selectedStatus);
      }
    }
    
    // 处理教练多选
    if (params?.coachIds && Array.isArray(params.coachIds) && params.coachIds.length > 0) {
      params.coachIds.forEach(coachId => {
        queryParams.append('coachIds', coachId.toString());
      });
    } else if (params?.selectedCoach && Array.isArray(params.selectedCoach) && params.selectedCoach.length > 0) {
      params.selectedCoach.forEach(coachId => {
        queryParams.append('coachIds', coachId.toString());
      });
    }

    // 添加排序参数，默认按创建时间降序排列（最新的在前面）
    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
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
        pageNum: params?.page || 1
      };

      // 更新缓存
      courseListCache[cacheKey] = {
        data: formattedResponse,
        timestamp: currentTime
      };

      return formattedResponse;
    } else {
      console.error('课程列表响应格式错误:', response);
      return { list: [], total: 0, pageSize: params?.pageSize || 10, pageNum: params?.page || 1 };
    }
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
  add: async (data: CourseCreateRequest): Promise<any> => {
    // 添加课程时清除课程列表缓存
    clearCourseListCache();

    if (USE_MOCK) {
      // 模拟添加课程
      await new Promise(resolve => setTimeout(resolve, 1000));

      const now = new Date().toISOString();
      const newCourse: Course = {
        ...data,
        id: String(mockCourses.length + 1),
        type: CourseType.PRIVATE.toString(),
        institutionId: 1,
        consumedHours: 0,
        createdTime: now,
        updateTime: now,
        coaches: data.coachIds ? data.coachIds.map(id => ({ id: Number(id), name: `教练${id}` })) : []
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

    // 处理 typeId，可能是字符串或数字
    let typeId = data.typeId;

    // 如果 typeId 是字符串但可以转换为数字，则转换
    if (typeof typeId === 'string' && !isNaN(Number(typeId))) {
      typeId = Number(typeId);
    }

    const requestData = {
      ...data,
      coachIds: coachIds,
      description: description,
      typeId: typeId // 使用处理后的 typeId
    };

    console.log('发送课程创建请求数据:', requestData);
    console.log('课程类型 ID (typeId):', requestData.typeId);

    // Use imported config and path constants
    // 使用导入的 request 和 API 路径常量
    const response = await request(`${COURSE_API_PATHS.ADD}`, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    // 直接返回响应中的数据（课程ID）
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

    // 处理 typeId，可能是字符串或数字
    let typeId = data.typeId;

    // 如果 typeId 是字符串但可以转换为数字，则转换
    if (typeof typeId === 'string' && !isNaN(Number(typeId))) {
      typeId = Number(typeId);
    }

    const requestData = {
      ...data,
      coachIds: coachIds,
      description: description,
      typeId: typeId // 使用处理后的 typeId
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
