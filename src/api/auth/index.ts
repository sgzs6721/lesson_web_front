import { LoginParams, RegisterParams, LoginResponseData, RegisterResponse } from './types';
import { ApiResponse } from '../types';
// Import shared config: API_HOST, request function
import { API_HOST, request } from '../config';

// API Path Constants
const AUTH_API_PATHS = {
  LOGIN: '/lesson/api/auth/login',
  REGISTER: '/lesson/api/auth/register',
  LOGOUT: '/lesson/api/auth/logout',
  REFRESH: '/lesson/api/auth/refresh'
};

// 认证相关接口
export const auth = {
  // 用户登录
  login: async (data: LoginParams): Promise<ApiResponse<LoginResponseData>> => {
    const response: ApiResponse<LoginResponseData> = await request(AUTH_API_PATHS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response;
  },

  // 用户注册
  register: async (data: RegisterParams): Promise<RegisterResponse> => {
    const response: ApiResponse<RegisterResponse> = await request(AUTH_API_PATHS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 用户登出
  logout: async (): Promise<void> => {
    await request(AUTH_API_PATHS.LOGOUT, {
      method: 'POST'
    });
  },

  // 刷新token
  refresh: async (): Promise<LoginResponseData> => {
    const response: ApiResponse<LoginResponseData> = await request(AUTH_API_PATHS.REFRESH, {
      method: 'POST'
    });

    return response.data;
  }
};
