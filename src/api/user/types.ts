import { ApiResponse, PaginatedResponse } from '../types';
import { UserRole, UserRoleItem } from '../../pages/settings/types/user';

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

// 用户角色类型
export interface Role {
  id: number | string;
  name: string;
  code: string;
  description?: string;
}

// 用户类型
export interface User {
  id: number | string;
  phone: string;
  realName: string;
  roleId: number | string;
  roleName: string;
  role?: {
    id: number | string;
    name: string;
  };
  roles?: UserRoleItem[]; // 新增：多角色支持
  institutionId?: number | string;
  campusId?: number | string;
  campusName?: string;
  campus?: {
    id: number | string;
    name: string | null;
  };
  status: UserStatus;
  statusText?: string; // 状态文本，用于显示
  createdTime?: string;
  lastLoginTime?: string;
}

// 用户查询参数
export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  phone?: string;
  realName?: string;
  keyword?: string; // 关键字搜索
  roleId?: number | string;
  roleIds?: (number | string)[]; // 多选角色ID（兼容旧版本）
  role?: (number | string)[]; // 多选角色ID（新版本）
  campusId?: number | string;
  campusIds?: (number | string)[]; // 多选校区ID
  status?: string; // 状态：ENABLED 或 DISABLED
}

// 用户创建参数
export interface UserCreateParams {
  phone: string;
  password: string;
  realName: string;
  role?: UserRole; // 使用角色枚举值（兼容旧版本）
  roles?: UserRoleItem[]; // 新增：多角色支持
  institutionId?: number | string;
  campusId?: number | string;
  status: UserStatus; // 添加状态参数
}

// 用户更新参数
export interface UserUpdateParams {
  id: number | string;
  phone: string;
  realName: string;
  password?: string;
  role?: UserRole; // 使用角色枚举值（兼容旧版本）
  roles?: UserRoleItem[]; // 新增：多角色支持
  institutionId?: number | string;
  campusId?: number | string;
  status: UserStatus; // UserStatus.ENABLED 或 UserStatus.DISABLED
}

// 用户状态更新参数
export interface UserStatusUpdateParams {
  id: number | string;
  status: UserStatus;
}

// 重置密码参数
export interface ResetPasswordParams {
  id: number | string;
  password?: string;
}

// 用户列表响应
export interface UserListResponse extends ApiResponse<PaginatedResponse<User>> {}

// 用户创建响应
export interface UserCreateResponse extends ApiResponse<number | string> {}

// 用户更新响应
export interface UserUpdateResponse extends ApiResponse<null> {}

// 用户删除响应
export interface UserDeleteResponse extends ApiResponse<null> {}

// 用户状态更新响应
export interface UserStatusUpdateResponse extends ApiResponse<null> {}

// 重置密码响应
export interface ResetPasswordResponse extends ApiResponse<null> {}

// 角色列表响应
export interface RoleListResponse extends ApiResponse<Role[]> {}
