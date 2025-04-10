import { Institution } from './types';
import { ApiResponse, PaginatedResponse } from '../types';

// 模拟机构数据
export const mockInstitutions: Institution[] = [
  {
    id: '1',
    name: '示例机构',
    type: '教育机构',
    description: '这是一个示例教育机构',
    managerName: '张三',
    managerPhone: '13800138002',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    address: '北京市海淀区中关村大街1号',
    logo: '/images/institutions/sample.png',
    status: 'active',
    contactEmail: 'info@sample.com',
    website: 'www.sample.com',
    foundedYear: 2010
  },
  {
    id: '2',
    name: '测试机构',
    type: '培训机构',
    description: '这是一个测试培训机构',
    managerName: '李四',
    managerPhone: '13800138003',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    address: '上海市浦东新区张江高科技园区',
    logo: '/images/institutions/test.png',
    status: 'active',
    contactEmail: 'info@test.com',
    website: 'www.test.com',
    foundedYear: 2015
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
