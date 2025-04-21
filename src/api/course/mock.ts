import { Course } from './types';
import { ApiResponse, PaginatedResponse } from '../types';

import { CourseStatus, CourseType } from './types';

// 模拟课程数据
export const mockCourses: Course[] = [
  {
    id: '1',
    name: '数学基础',
    description: '数学基础知识课程',
    price: 199,
    unitHours: 1.5,
    totalHours: 30,
    consumedHours: 5,
    institutionId: 1,
    institutionName: '示例机构',
    createdTime: '2023-01-03T00:00:00Z',
    updateTime: '2023-01-03T00:00:00Z',
    type: CourseType.PRIVATE,
    status: CourseStatus.PUBLISHED,
    campusId: 1,
    campusName: '总校区',
    coachIds: ['1', '2'],
    coachNames: ['王老师', '张老师']
  },
  {
    id: '2',
    name: '英语口语',
    description: '英语口语训练课程',
    price: 299,
    unitHours: 2,
    totalHours: 45,
    consumedHours: 10,
    institutionId: 2,
    institutionName: '测试机构',
    createdTime: '2023-01-04T00:00:00Z',
    updateTime: '2023-01-04T00:00:00Z',
    type: CourseType.GROUP,
    status: CourseStatus.PUBLISHED,
    campusId: 1,
    campusName: '总校区',
    coachIds: ['3'],
    coachNames: ['李老师']
  },
  {
    id: '3',
    name: '物理入门',
    description: '物理基础知识课程',
    price: 249,
    unitHours: 1.5,
    totalHours: 36,
    consumedHours: 0,
    institutionId: 1,
    institutionName: '示例机构',
    createdTime: '2023-01-05T00:00:00Z',
    updateTime: '2023-01-05T00:00:00Z',
    type: CourseType.PRIVATE,
    status: CourseStatus.PUBLISHED,
    campusId: 2,
    campusName: '西区分校',
    coachIds: ['2', '4'],
    coachNames: ['张老师', '赵老师']
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
