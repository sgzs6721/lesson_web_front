import { LoginParams, RegisterParams, LoginResponse, RegisterResponse } from './types';
import { ApiResponse } from '../types';
import { mockApiResponse, mockUsers } from './mock';

// Import shared config: API_HOST, request function, and USE_MOCK flag
import { API_HOST, request, USE_MOCK } from '../config'; // Added request and USE_MOCK

// API Path Constants
const AUTH_API_PATHS = {
  LOGIN: '/lesson/api/auth/login',
  LOGOUT: '/lessonapi/auth/logout',
  REGISTER: '/lesson/api/auth/register',
};

// 通用请求函数
// const request = async (url: string, options: RequestInit = {}): Promise<any> => { ... };

// 认证相关接口
export const auth = {
  // 登录
  login: async (data: LoginParams): Promise<LoginResponse> => {
    if (USE_MOCK) {
      console.warn('开发环境下使用模拟登录数据');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = { id: '1', username: data.username, role: 'admin', name: '模拟用户', phone: data.username };
      const mockLoginResponse: LoginResponse = { token: 'mock-token-' + Date.now(), user: mockUser };
      return mockLoginResponse;
    }

    console.log('开始调用登录接口:', `${API_HOST}${AUTH_API_PATHS.LOGIN}`);
    console.log('登录请求数据:', data);
    return request(`${API_HOST}${AUTH_API_PATHS.LOGIN}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 退出登录
  logout: async (): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return null;
    }
    return request(`${API_HOST}${AUTH_API_PATHS.LOGOUT}`, {
      method: 'POST'
    });
  },

  // 注册
  register: async (data: RegisterParams): Promise<RegisterResponse> => {
    if (!data.phone || !data.password || !data.realName || !data.institutionName || !data.institutionType) {
      throw new Error('请填写所有必填字段');
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
      throw new Error('请输入正确的手机号');
    }

    if (data.password.length < 6) {
      throw new Error('密码长度不能少于6位');
    }

    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (mockUsers.some(u => u.phone === data.phone)) {
        throw new Error('该手机号已注册');
      }

      const newUser = {
        id: String(mockUsers.length + 1),
        username: data.phone,
        role: 'institution',
        name: data.realName,
        phone: data.phone
      };

      mockUsers.push(newUser);

      const mockRegisterResponse: RegisterResponse = { userId: Number(newUser.id), phone: newUser.phone || '', realName: newUser.name || '', status: 1 };
      return mockRegisterResponse;
    }

    console.log('正在调用注册接口:', `${API_HOST}${AUTH_API_PATHS.REGISTER}`);
    console.log('请求数据:', data);
    return request(`${API_HOST}${AUTH_API_PATHS.REGISTER}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
