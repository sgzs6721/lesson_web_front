import { Course } from './types';
import { ApiResponse, PaginatedResponse } from '../types';

// 模拟课程数据
export const mockCourses: Course[] = [
  {
    id: '1',
    name: '数学基础',
    description: '数学基础知识课程',
    price: 199,
    duration: 10,
    institutionId: '1',
    institutionName: '示例机构',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
    category: '学科类',
    level: 'beginner',
    capacity: 20,
    totalHours: 30,
    hoursPerClass: 1.5,
    unitPrice: 100,
    status: 'active',
    cover: '/images/courses/math.jpg',
    campuses: ['总校区', '东区分校'],
    coaches: ['王老师', '张老师']
  },
  {
    id: '2',
    name: '英语口语',
    description: '英语口语训练课程',
    price: 299,
    duration: 15,
    institutionId: '2',
    institutionName: '测试机构',
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z',
    category: '语言类',
    level: 'intermediate',
    capacity: 15,
    totalHours: 45,
    hoursPerClass: 2,
    unitPrice: 120,
    status: 'active',
    cover: '/images/courses/english.jpg',
    campuses: ['总校区'],
    coaches: ['李老师']
  },
  {
    id: '3',
    name: '物理入门',
    description: '物理基础知识课程',
    price: 249,
    duration: 12,
    institutionId: '1',
    institutionName: '示例机构',
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z',
    category: '学科类',
    level: 'beginner',
    capacity: 18,
    totalHours: 36,
    hoursPerClass: 1.5,
    unitPrice: 110,
    status: 'active',
    cover: '/images/courses/physics.jpg',
    campuses: ['总校区', '西区分校'],
    coaches: ['张老师', '赵老师']
  }
];

// 模拟 API 响应
export const mockApiResponse = <T>(data: T, message = '操作成功'): ApiResponse<T> => {
  return {
    code: 0,
    data,
    message
  };
};

// 模拟分页响应
export const mockPaginatedResponse = <T>(
  list: T[],
  page: number,
  pageSize: number,
  total = list.length
): ApiResponse<PaginatedResponse<T>> => {
  return {
    code: 0,
    data: {
      list,
      total,
      page,
      pageSize
    },
    message: '获取成功'
  };
};
