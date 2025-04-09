import { User } from './types';
import { ApiResponse } from '../types';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    name: '管理员',
    phone: '13800138000'
  },
  {
    id: '2',
    username: 'institution1',
    role: 'institution',
    name: '机构管理员',
    phone: '13800138001'
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
