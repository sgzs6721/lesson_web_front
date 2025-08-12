import { Course, CourseSearchParams, CourseCreateRequest, CourseUpdateRequest, CourseType, CourseStatus, CourseListParams } from './types';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types';
import { mockApiResponse, mockCourses, mockPaginatedResponse } from './mock';

// Import shared config
import { request, USE_MOCK, API_HOST } from '../config';
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
  SIMPLE_LIST: '/lesson/api/courses/simple'
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
      const { pageNum = 1, pageSize = 10 } = params || {};
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredCourses.slice(start, end);

      const response = mockPaginatedResponse(list, pageNum, pageSize, filteredCourses.length);
      return response.data;
    }

    // Use imported config and path constants
    const queryParams = new URLSearchParams();

    if (params?.pageNum) queryParams.append('pageNum', params.pageNum.toString());
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
    // 不再清除课程列表缓存
    // clearCourseListCache();

    if (USE_MOCK) {
      // 模拟添加课程
      await new Promise(resolve => setTimeout(resolve, 1000));

      const now = new Date().toISOString();
      const newCourse: any = {
        ...data,
        id: String(mockCourses.length + 1),
        type: CourseType.PRIVATE.toString(),
        institutionId: 1,
        consumedHours: 0,
        coachFee: Number((data as any).coachFee ?? 0),
        totalHours: data.unitHours, // 设置 totalHours 与 unitHours 相同
        createdTime: now,
        updateTime: now,
        coaches: Array.isArray((data as any).coachIds)
          ? (data as any).coachIds.map((id: any) => ({ id: Number(id), name: `教练${id}` }))
          : []
      };

      mockCourses.push(newCourse);

      return newCourse.id;
    }

    // 确保课程描述为空字符串而不是undefined
    const description = (data as any).description || '';

    // 处理 typeId，可能是字符串或数字
    let typeId = (data as any).typeId as any;

    // 如果 typeId 是字符串但可以转换为数字，则转换
    if (typeof typeId === 'string' && !isNaN(Number(typeId))) {
      typeId = Number(typeId);
    }

    const requestData = {
      ...data,
      description: description,
      typeId: typeId // 使用处理后的 typeId
    } as any;

    console.log('发送课程创建请求数据:', requestData);
    console.log('课程类型 ID (typeId):', requestData.typeId);

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
    // 不再清除课程列表缓存
    // clearCourseListCache();

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
    // 不再清除课程列表缓存
    // clearCourseListCache();

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

// 更新 Mock 数据以匹配新的 SimpleCourse 接口
const mockSimpleCourses: SimpleCourse[] = [
  { id: 'basketball', name: '篮球训练', typeName: '体育大类', status: 'PUBLISHED', coaches: [{ id: 1001, name: '王教练' }, { id: 1002, name: '李教练' }] },
  { id: 'swimming', name: '游泳课程', typeName: '体育小班', status: 'PUBLISHED', coaches: [{ id: 1003, name: '张教练' }] },
  { id: 'tennis', name: '网球培训', typeName: '体育一对一', status: 'PUBLISHED', coaches: [{ id: 1004, name: '赵教练' }] },
  { id: 'painting', name: '绘画班', typeName: '艺术启蒙', status: 'PUBLISHED', coaches: [{ id: 1005, name: '孙教练' }] },
  { id: 'piano', name: '钢琴培训', typeName: '艺术一对一', status: 'PUBLISHED', coaches: [{ id: 1006, name: '吴教练' }] },
  { id: 'dance', name: '舞蹈课程', typeName: '艺术形体', status: 'PUBLISHED', coaches: [{ id: 1007, name: '冯教练' }] },
  { id: 'math', name: '数学辅导', typeName: '学科培优', status: 'PUBLISHED', coaches: [{ id: 1008, name: '杨教练' }] },
  { id: 'english', name: '英语班', typeName: '语言提升', status: 'PUBLISHED', coaches: [{ id: 1009, name: '秦教练' }] },
];

/**
 * 获取简化的课程列表 (用于下拉框)
 * @param campusId 可选的校区 ID
 * @param filterPublished 是否只返回已发布的课程，默认为false
 */
export const getCourseSimpleList = async (campusId?: string | number, filterPublished: boolean = false): Promise<SimpleCourse[]> => {
  if (USE_MOCK) {
    console.log("Using mock course simple list for campus:", campusId, "filterPublished:", filterPublished);
    await new Promise(resolve => setTimeout(resolve, 300));
    // 按需过滤状态为PUBLISHED的模拟课程
    return filterPublished 
      ? mockSimpleCourses.filter((course: SimpleCourse) => 
          course.status === 'PUBLISHED' || course.status === '1'
        )
      : mockSimpleCourses;
  }

  try {
    // 参照 coach.getSimpleList 处理 campusId
    const currentCampusId = localStorage.getItem('currentCampusId');
    let finalCampusId = campusId;

    if (finalCampusId === undefined && currentCampusId) {
      finalCampusId = currentCampusId;
    }

    // 如果仍然没有 campusId，使用默认值 1
    if (finalCampusId === undefined) {
      console.warn('获取课程简单列表时 campusId 未定义，使用默认值 1');
      finalCampusId = '1'; // 设置默认值为 1
    }

    let apiUrl = COURSE_API_PATHS.SIMPLE_LIST;
    // 始终添加 campusId 参数
    apiUrl += `?campusId=${finalCampusId}`;
    // 只有在需要过滤时才添加状态参数
    if (filterPublished) {
      apiUrl += `&status=PUBLISHED`;
    }

    console.log(`Fetching simple course list from: ${apiUrl}`);
    const response = await request(apiUrl);

    // 添加更详细的日志
    console.log('Course simple list response:', response);

    if (response.code === 200 && response.data) {
      // 检查响应数据是否为空数组
      if (Array.isArray(response.data) && response.data.length === 0) {
        console.warn('课程列表为空，返回默认模拟数据');
        // 按需返回过滤后的模拟数据
        return filterPublished
          ? mockSimpleCourses.filter((course: SimpleCourse) => 
              course.status === 'PUBLISHED' || course.status === '1'
            )
          : mockSimpleCourses;
      }
      // 按需在前端过滤，确保只返回已发布的课程
      return filterPublished
        ? response.data.filter((course: SimpleCourse) => 
            course.status === 'PUBLISHED' || course.status === '1'
          )
        : response.data;
    } else {
      console.error("Failed to fetch course simple list or unexpected code:", response.code, response.message);
      // 如果响应不成功，返回按需过滤的模拟数据
      console.warn('返回默认模拟数据');
      return filterPublished
        ? mockSimpleCourses.filter((course: SimpleCourse) => 
            course.status === 'PUBLISHED' || course.status === '1'
          )
        : mockSimpleCourses;
    }
  } catch (error) {
    console.error("Error fetching course simple list:", error);
    // 异常情况下返回按需过滤的模拟数据
    console.warn('发生异常，返回默认模拟数据');
    return filterPublished
      ? mockSimpleCourses.filter((course: SimpleCourse) => 
          course.status === 'PUBLISHED' || course.status === '1'
        )
      : mockSimpleCourses;
  }
};
