import { LoginParams, RegisterParams, LoginResponse, RegisterResponse } from './types';
import { ApiResponse } from '../types';
import { mockApiResponse, mockUsers } from './mock';

// Import shared config: API_HOST, request function, and USE_MOCK flag
import { API_HOST, request, USE_MOCK } from '../config'; // Added request and USE_MOCK

// API Path Constants
const AUTH_API_PATHS = {
  LOGIN: '/lesson/api/auth/login',
  LOGOUT: '/lesson/api/auth/logout',
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
      const mockUser = { id: '1', username: data.phone, role: 'admin', name: '模拟用户', phone: data.phone };
      const mockLoginResponse: LoginResponse = { 
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock-token-' + Date.now(),
          userId: 1,
          phone: data.phone,
          realName: '模拟用户',
          roleName: 'admin'
        }
      };
      return mockLoginResponse;
    }

    console.log('开始调用登录接口:', `${AUTH_API_PATHS.LOGIN}`);
    console.log('登录请求数据:', data);
    return request(`${AUTH_API_PATHS.LOGIN}`, {
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
    return request(`${AUTH_API_PATHS.LOGOUT}`, {
      method: 'POST'
    });
  },

  // 注册
  register: async (data: RegisterParams): Promise<RegisterResponse> => {
    if (!data.password || !data.institutionName || !data.managerName || !data.managerPhone) {
      throw new Error('请填写所有必填字段');
    }

    // 验证手机号格式
    if (data.managerPhone) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(data.managerPhone)) {
        throw new Error('请输入正确的手机号');
      }
    }

    if (data.password.length < 6) {
      throw new Error('密码长度不能少于6位');
    }

    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (data.managerPhone && mockUsers.some(u => u.phone === data.managerPhone)) {
        throw new Error('该手机号已注册');
      }

      const newUser = {
        id: String(mockUsers.length + 1),
        username: data.managerPhone,
        role: 'institution',
        name: data.managerName,
        phone: data.managerPhone
      };

      mockUsers.push(newUser);

      const mockRegisterResponse: RegisterResponse = { 
        code: 200,
        message: "注册成功",
        data: {
          userId: Number(newUser.id), 
          phone: newUser.phone || ''
        }
      };
      return mockRegisterResponse;
    }

    console.log('正在调用注册接口:', `${AUTH_API_PATHS.REGISTER}`);
    console.log('请求数据:', data);
    return request(`${AUTH_API_PATHS.REGISTER}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
