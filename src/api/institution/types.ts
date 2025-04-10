// Remove self-import
// import { Institution } from './types';
// Remove imports for shared types
// import { ApiResponse } from '../auth/types';

// 导入共享类型
import { ApiResponse, PaginatedResponse } from '../types';

// 机构类型
export interface Institution {
  id: string;
  name: string;
  type: string;
  description?: string;
  managerName: string;
  managerPhone: string;
  createdAt: string;
  updatedAt: string;
  address?: string;
  logo?: string;
  status?: 'active' | 'inactive' | 'pending';
  contactEmail?: string;
  website?: string;
  foundedYear?: number;
}

// 删除分页请求参数定义
// export interface PaginationParams { ... }

// 删除分页响应类型定义
// export interface PaginatedResponse<T> { ... }
