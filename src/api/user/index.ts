import {
  User,
  Role,
  UserQueryParams,
  UserCreateParams,
  UserUpdateParams,
  UserStatusUpdateParams,
  ResetPasswordParams,
  UserListResponse,
  UserCreateResponse,
  UserUpdateResponse,
  UserDeleteResponse,
  UserStatusUpdateResponse,
  ResetPasswordResponse,
  RoleListResponse,
  UserStatus
} from './types';
import { PaginatedResponse } from '../types';
import { request } from '../config';

// API Path Constants
const USER_API_PATHS = {
  LIST: '/lesson/api/user/list',
  CREATE: '/lesson/api/user/create',
  UPDATE: '/lesson/api/user/update',
  DELETE: (id: string | number) => `/lesson/api/user/delete?id=${id}`,
  UPDATE_STATUS: '/lesson/api/user/updateStatus',
  RESET_PASSWORD: '/lesson/api/user/resetPassword',
  ROLES: '/lesson/api/user/roles'
};

// 用户管理相关接口
export const user = {
  // 获取用户列表
  getList: async (params?: UserQueryParams): Promise<PaginatedResponse<User>> => {
    // 构建查询参数
    const queryParams = new URLSearchParams();

    // 分页参数
    queryParams.append('pageNum', String(params?.page || 1));
    queryParams.append('pageSize', String(params?.pageSize || 10));

    // 搜索参数
    if (params?.phone) queryParams.append('phone', params.phone);
    if (params?.realName) queryParams.append('realName', params.realName);
    if (params?.keyword) queryParams.append('keyword', params.keyword);

    // 角色筛选 - 支持多选
    if (params?.role && params.role.length > 0) {
      // 对于多选参数，需要多次添加同名参数
      params.role.forEach(roleId => {
        queryParams.append('roles', String(roleId));
      });
    } else if (params?.roleIds && params.roleIds.length > 0) {
      // 兼容旧字段 roleIds
      params.roleIds.forEach(roleId => {
        queryParams.append('roles', String(roleId));
      });
    } else if (params?.roleId) {
      // 兼容单个 roleId
      queryParams.append('roles', String(params.roleId));
    }

    // 校区筛选 - 支持多选
    if (params?.campusIds && params.campusIds.length > 0) {
      // 对于多选参数，需要多次添加同名参数
      params.campusIds.forEach(campusId => {
        queryParams.append('campusIds', String(campusId));
      });
    } else if (params?.campusId) {
      queryParams.append('campusIds', String(params.campusId));
    }

    // 状态筛选 - 单选
    if (params?.status) {
      queryParams.append('status', params.status);
    }

    console.log('用户列表请求参数:', queryParams.toString());

    // 使用GET方法发送请求
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response: UserListResponse = await request(`${USER_API_PATHS.LIST}${queryString}`);
    return response.data;
  },

  // 创建用户
  create: async (data: UserCreateParams): Promise<string | number> => {
    const response: UserCreateResponse = await request(USER_API_PATHS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 更新用户
  update: async (data: UserUpdateParams): Promise<null> => {
    console.log('发送用户更新请求:', data);

    const response: UserUpdateResponse = await request(USER_API_PATHS.UPDATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 删除用户
  delete: async (id: string | number): Promise<null> => {
    const response: UserDeleteResponse = await request(USER_API_PATHS.DELETE(id), {
      method: 'POST'
    });

    return response.data;
  },

  // 更新用户状态
  updateStatus: async (data: UserStatusUpdateParams): Promise<null> => {
    const response: UserStatusUpdateResponse = await request(USER_API_PATHS.UPDATE_STATUS, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 重置密码
  resetPassword: async (data: ResetPasswordParams): Promise<null> => {
    const response: ResetPasswordResponse = await request(USER_API_PATHS.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 获取角色列表
  getRoles: async (): Promise<Role[]> => {
    const response: RoleListResponse = await request(USER_API_PATHS.ROLES);
    return response.data;
  }
};
