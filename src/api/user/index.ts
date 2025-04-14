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
  RoleListResponse
} from './types';
import { PaginatedResponse } from '../types';
import { mockApiResponse, mockUsers, mockRoles, mockPaginatedResponse } from './mock';

// Import shared config
import { request, USE_MOCK } from '../config';

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
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // 过滤数据
      let filteredUsers = [...mockUsers];

      if (params?.phone) {
        filteredUsers = filteredUsers.filter(user =>
          user.phone.includes(params.phone || '')
        );
      }

      if (params?.realName) {
        filteredUsers = filteredUsers.filter(user =>
          user.realName.includes(params.realName || '')
        );
      }

      if (params?.roleId) {
        filteredUsers = filteredUsers.filter(user =>
          user.roleId === params.roleId
        );
      }

      if (params?.campusId) {
        filteredUsers = filteredUsers.filter(user =>
          user.campusId === params.campusId
        );
      }

      if (params?.status !== undefined) {
        filteredUsers = filteredUsers.filter(user =>
          user.status === params.status
        );
      }

      // 分页
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedUsers = filteredUsers.slice(start, end);

      return mockPaginatedResponse(paginatedUsers, page, pageSize, filteredUsers.length);
    }

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
    if (params?.roleIds && params.roleIds.length > 0) {
      // 对于多选参数，需要多次添加同名参数
      params.roleIds.forEach(roleId => {
        queryParams.append('roleIds', String(roleId));
      });
    } else if (params?.roleId) {
      queryParams.append('roleIds', String(params.roleId));
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
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 检查手机号是否已存在
      const existingUser = mockUsers.find(user => user.phone === data.phone);
      if (existingUser) {
        throw new Error('该手机号已被注册');
      }

      // 获取角色名称
      const role = mockRoles.find(role => role.id === data.roleId);
      if (!role) {
        throw new Error('角色不存在');
      }

      // 创建新用户
      const newId = mockUsers.length + 1;
      const newUser: User = {
        id: newId,
        phone: data.phone,
        realName: data.realName,
        roleId: data.roleId,
        roleName: role.name,
        institutionId: data.institutionId,
        campusId: data.campusId,
        status: 1, // 默认激活
        createdTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      mockUsers.push(newUser);
      return newId;
    }

    const response: UserCreateResponse = await request(USER_API_PATHS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 更新用户
  update: async (data: UserUpdateParams): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // 查找用户
      const userIndex = mockUsers.findIndex(user => user.id === data.id);
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }

      // 如果更新手机号，检查是否已存在
      if (data.phone && data.phone !== mockUsers[userIndex].phone) {
        const existingUser = mockUsers.find(user => user.phone === data.phone && user.id !== data.id);
        if (existingUser) {
          throw new Error('该手机号已被其他用户使用');
        }
      }

      // 获取角色名称
      let roleName = mockUsers[userIndex].roleName;
      if (data.roleId && data.roleId !== mockUsers[userIndex].roleId) {
        const role = mockRoles.find(role => role.id === data.roleId);
        if (!role) {
          throw new Error('角色不存在');
        }
        roleName = role.name;
      }

      // 更新用户
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        phone: data.phone || mockUsers[userIndex].phone,
        realName: data.realName || mockUsers[userIndex].realName,
        roleId: data.roleId || mockUsers[userIndex].roleId,
        roleName,
        campusId: data.campusId !== undefined ? data.campusId : mockUsers[userIndex].campusId
      };

      return null;
    }

    const response: UserUpdateResponse = await request(USER_API_PATHS.UPDATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 删除用户
  delete: async (id: string | number): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // 查找用户
      const userIndex = mockUsers.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }

      // 删除用户
      mockUsers.splice(userIndex, 1);

      return null;
    }

    const response: UserDeleteResponse = await request(USER_API_PATHS.DELETE(id), {
      method: 'POST'
    });

    return response.data;
  },

  // 更新用户状态
  updateStatus: async (data: UserStatusUpdateParams): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // 查找用户
      const userIndex = mockUsers.findIndex(user => user.id === data.id);
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }

      // 更新状态
      mockUsers[userIndex].status = data.status;

      return null;
    }

    const response: UserStatusUpdateResponse = await request(USER_API_PATHS.UPDATE_STATUS, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 重置密码
  resetPassword: async (data: ResetPasswordParams): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // 查找用户
      const userIndex = mockUsers.findIndex(user => user.id === data.id);
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }

      // 模拟重置密码（实际不做任何操作）

      return null;
    }

    const response: ResetPasswordResponse = await request(USER_API_PATHS.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.data;
  },

  // 获取角色列表
  getRoles: async (): Promise<Role[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockRoles;
    }

    const response: RoleListResponse = await request(USER_API_PATHS.ROLES);
    return response.data;
  }
};
