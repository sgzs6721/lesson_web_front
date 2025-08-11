import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

// 课程状态枚举
export enum CourseStatus {
  DRAFT = '0',
  PUBLISHED = '1',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED'
}

// 课程类型枚举
export enum CourseType {
  PRIVATE = '2',
  GROUP = '1',
  PACKAGE = '3'
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
  coachFee?: number;
  campusId: number;
  institutionId: number;
  description?: string;
  createdTime?: string;
  updateTime?: string;
  coaches?: {
    id: number;
    name: string;
  }[];
  isMultiTeacher?: boolean;
  consume?: number;
  coachFees?: Record<number, number>;
}

// 课程创建请求
export interface CourseCreateRequest {
  name: string;
  typeId: number; // 修改为 typeId
  status: CourseStatus;
  unitHours: number;
  price: number;
  coachFee: number; // 单教师或平均课时费
  // 不再强制要求 coachIds，由后端根据 coachFees 内的 coachId 解析
  coachIds?: number[];
  // 多教师时的明细费用（可选）
  coachFees?: { coachId: number; coachFee: number }[];
  campusId: number;
  description?: string;
}

// 课程更新请求
export interface CourseUpdateRequest {
  id: any;
  name: string;
  typeId: number; // 修改为 typeId
  status: CourseStatus;
  unitHours: number;
  price: number;
  coachIds: number[]; // 教练ID列表
  campusId: number;
  description?: string;
  coachFees?: Record<number, number>; // 允许前端在编辑时携带，用于派生教练显示
}

// 课程搜索参数
export type CourseSearchParams = {
  searchText: string;
  selectedType: CourseType[] | undefined;
  selectedStatus: CourseStatus | undefined;
  selectedCoach?: number[] | undefined;
  sortOrder: string | undefined;
  sortField?: string | undefined;
  campusId?: number | undefined;
};

// 扩展的分页参数类型，包含 API 所需的所有可能参数
export type CourseListParams = PaginationParams & Partial<CourseSearchParams> & {
  typeIds?: CourseType[] | undefined;
  coachIds?: number[] | undefined;
  sortField?: string | undefined;
};

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

/**
 * 简化的课程信息接口，用于下拉列表
 */
export interface SimpleCourse {
  id: string | number; // ID 可能是数字或字符串，使用联合类型
  name: string;      // 课程名称
  typeName: string;  // 课程类型名称 (e.g., "一对一", "大课")
  status: string;    // 课程状态 (e.g., "PUBLISHED")
  coaches: {         // 教练列表
    id: number;
    name: string;
  }[];
}
