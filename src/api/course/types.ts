import { ApiResponse, PaginatedResponse } from '../types';

// 课程状态枚举
export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED'
}

// 课程类型枚举
export enum CourseType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
  ONLINE = 'ONLINE'
}

// 课程类型
export interface Course {
  id: string;
  name: string;
  type: string;
  status: CourseStatus;
  unitHours: number;
  totalHours: number;
  consumedHours: number;
  price: number;
  campusId: number;
  institutionId: number;
  description?: string;
  createdTime?: string;
  updateTime?: string;
  coaches?: {
    id: number;
    name: string;
  }[];
}

// 课程创建请求
export interface CourseCreateRequest {
  name: string;
  typeId: number; // 修改为 typeId
  status: CourseStatus;
  unitHours: number;
  totalHours: number;
  price: number;
  coachIds: number[]; // 教练ID列表
  campusId: number;
  description?: string;
}

// 课程更新请求
export interface CourseUpdateRequest {
  id: string;
  name: string;
  typeId: number; // 修改为 typeId
  status: CourseStatus;
  unitHours: number;
  totalHours: number;
  price: number;
  coachIds: number[]; // 教练ID列表
  campusId: number;
  description?: string;
}

// 课程搜索参数
export interface CourseSearchParams {
  searchText: string;
  selectedType?: CourseType;
  selectedStatus?: CourseStatus;
  sortOrder?: string;
  campusId?: number;
}

// 课程列表响应
export interface CourseListResponse extends ApiResponse<PaginatedResponse<Course>> {}

// 课程详情响应
export interface CourseDetailResponse extends ApiResponse<Course> {}

// 课程创建响应
export interface CourseCreateResponse extends ApiResponse<string> {}

// 课程更新响应
export interface CourseUpdateResponse extends ApiResponse<null> {}

// 课程删除响应
export interface CourseDeleteResponse extends ApiResponse<null> {}
