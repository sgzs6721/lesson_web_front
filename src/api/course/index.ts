import { Course, CourseSearchParams } from './types';
// Import shared types from the new central file
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types';
import { mockApiResponse, mockCourses, mockPaginatedResponse } from './mock';

// Import shared config
import { API_HOST, request, USE_MOCK } from '../config';

// API Path Constants
const COURSE_API_PATHS = {
  LIST: '/api/courses',
  DETAIL: (id: string) => `/api/courses/${id}`,
  ADD: '/api/courses',
  UPDATE: (id: string) => `/api/courses/${id}`,
  DELETE: (id: string) => `/api/courses/${id}`,
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
      
      if (params?.selectedCategory) {
        filteredCourses = filteredCourses.filter(course => 
          course.category === params.selectedCategory
        );
      }
      
      if (params?.selectedStatus) {
        filteredCourses = filteredCourses.filter(course => 
          course.status === params.selectedStatus
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
      
      return mockPaginatedResponse(list, page, pageSize, filteredCourses.length);
    }
    
    // Use imported config and path constants
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.searchText) queryParams.append('searchText', params.searchText);
    if (params?.selectedCategory) queryParams.append('category', params.selectedCategory);
    if (params?.selectedStatus) queryParams.append('status', params.selectedStatus);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    // 使用导入的 request 和 API 路径常量
    return request(`${API_HOST}${COURSE_API_PATHS.LIST}${queryString}`);
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
    return request(`${API_HOST}${COURSE_API_PATHS.DETAIL(id)}`);
  },
  
  // 添加课程
  add: async (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
    if (USE_MOCK) {
      // 模拟添加课程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date().toISOString();
      const newCourse: Course = {
        ...data,
        id: String(mockCourses.length + 1),
        createdAt: now,
        updatedAt: now
      };
      
      mockCourses.push(newCourse);
      
      return newCourse;
    }
    
    // Use imported config and path constants
    // 使用导入的 request 和 API 路径常量
    return request(`${API_HOST}${COURSE_API_PATHS.ADD}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 更新课程
  update: async (id: string, data: Partial<Course>): Promise<Course> => {
    if (USE_MOCK) {
      // 模拟更新课程
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = mockCourses.findIndex(c => c.id === id);
      
      if (index === -1) {
        throw new Error('课程不存在');
      }
      
      const updatedCourse = {
        ...mockCourses[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      mockCourses[index] = updatedCourse;
      
      return updatedCourse;
    }
    
    // Use imported config and path constants
    // 使用导入的 request 和 API 路径常量
    return request(`${API_HOST}${COURSE_API_PATHS.UPDATE(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  // 删除课程
  delete: async (id: string): Promise<null> => {
    if (USE_MOCK) {
      // 模拟删除课程
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const index = mockCourses.findIndex(c => c.id === id);
      
      if (index === -1) {
        throw new Error('课程不存在');
      }
      
      mockCourses.splice(index, 1);
      
      return null;
    }
    
    // Use imported config and path constants
    // 使用导入的 request 和 API 路径常量
    return request(`${API_HOST}${COURSE_API_PATHS.DELETE(id)}`, {
      method: 'DELETE'
    });
  }
};
