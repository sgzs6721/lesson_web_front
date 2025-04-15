export type UserRole = '1' | '2' | '3';

export interface User {
  id: string;
  phone: string;
  name?: string;
  realName?: string; // API返回的字段名是realName
  role: UserRole | {
    id: number | string;
    name: string;
  };
  roleName?: string; // 角色名称，用于显示
  campus?: string | {
    id: number | string;
    name: string | null;
  };
  status: 'ENABLED' | 'DISABLED' | number;
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
}

export type UserSearchParams = {
  searchText: string;
  selectedRole: string[];
  selectedCampus: string[];
  selectedStatus: 'ENABLED' | 'DISABLED' | undefined;
};