// 角色枚举 - 使用字符串值
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COLLABORATOR = 'COLLABORATOR',
  CAMPUS_ADMIN = 'CAMPUS_ADMIN'
}

// 用户角色结构
export interface UserRoleItem {
  name: UserRole;
  campusId: number | null;
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  realName?: string; // API返回的字段名是realName
  role: UserRole | number | {
    id: number | string;
    name: string;
  };
  roles?: UserRoleItem[]; // 新增：多角色支持
  roleName?: string; // 角色名称，用于显示
  campus?: string | {
    id: number | string;
    name: string | null;
  };
  status: 'ENABLED' | 'DISABLED';
  statusText?: string; // 状态文本，用于显示
  createdAt: string;
  lastLogin?: string;
  createdTime?: string; // API返回的字段名是createdTime
  lastLoginTime?: string; // API返回的字段名是lastLoginTime
}

export interface CampusOption {
  value: string;
  label: string;
}

export interface RoleOption {
  value: UserRole;
  label: string;
  description?: string;
}

export type UserSearchParams = {
  searchText: string;
  selectedRole: UserRole[];
  selectedCampus: string[];
  selectedStatus: 'ENABLED' | 'DISABLED' | undefined;
};