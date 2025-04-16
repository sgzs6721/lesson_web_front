import { ApiResponse, PaginatedResponse } from '../types';

// 校区类型
export interface Campus {
  id: number | string;
  name: string;
  address: string;
  phone?: string;
  contactPerson?: string;
  capacity?: number;
  area?: number;
  facilities?: string[];
  status: 'OPERATING' | 'CLOSED';
  openDate?: string;
  studentCount?: number;
  coachCount?: number;
  courseCount?: number;
  pendingLessonCount?: number;
  monthlyRent?: number;
  propertyFee?: number;
  utilityFee?: number;
  createdTime?: string;
  updateTime?: string;
  managerName?: string;
  managerPhone?: string;
  editable?: boolean;
  // 校区管理员信息
  manager?: {
    id: number | string;
    name: string;
    phone: string;
  };
}

// 校区创建参数
export interface CampusCreateParams {
  name: string;
  address: string;
  status?: 'OPERATING' | 'CLOSED';
  monthlyRent?: number;
  propertyFee?: number;
  utilityFee?: number;
}

// 校区查询参数
export interface CampusQueryParams {
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

// 校区列表响应
export type CampusListResponse = ApiResponse<PaginatedResponse<Campus>>;

// 校区详情响应
export type CampusDetailResponse = ApiResponse<Campus>;

// 校区创建响应
export type CampusCreateResponse = ApiResponse<string>;
