import { Campus } from './types';
import { ApiResponse, PaginatedResponse } from '../types';

// 模拟校区数据
export const mockCampuses: Campus[] = [
  {
    id: '1',
    name: '北京中关村校区',
    address: '北京市海淀区中关村大街1号',
    phone: '010-12345678',
    contactPerson: '张经理',
    capacity: 300,
    area: 1500,
    facilities: ['basketball', 'swimming', 'gym'],
    status: 'OPERATING',
    openDate: '2022-01-01',
    studentCount: 250,
    coachCount: 15,
    courseCount: 45,
    monthlyRent: 50000,
    propertyFee: 5000,
    utilityFee: 3000,
    manager: {
      id: 1,
      name: '张经理',
      phone: '010-12345678'
    }
  },
  {
    id: '2',
    name: '北京望京校区',
    address: '北京市朝阳区望京西路1号',
    phone: '010-87654321',
    contactPerson: '李经理',
    capacity: 200,
    area: 1200,
    facilities: ['basketball', 'tennis', 'yoga'],
    status: 'OPERATING',
    openDate: '2022-03-15',
    studentCount: 180,
    coachCount: 12,
    courseCount: 35,
    monthlyRent: 45000,
    propertyFee: 4500,
    utilityFee: 2800,
    manager: {
      id: 2,
      name: '李经理',
      phone: '010-87654321'
    }
  }
];

// 模拟API响应
export const mockApiResponse = <T>(data: T): ApiResponse<T> => ({
  code: 200,
  message: '操作成功',
  data
});

// 模拟分页响应
export const mockPaginatedResponse = <T>(
  list: T[],
  page: number,
  pageSize: number,
  total: number
): ApiResponse<PaginatedResponse<T>> => ({
  code: 200,
  message: '操作成功',
  data: {
    list,
    page,
    pageSize,
    total
  }
});
