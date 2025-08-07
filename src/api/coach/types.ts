import { ApiResponse, PaginatedResponse } from '../types';

// 教练状态枚举
export enum CoachStatus {
  ACTIVE = 'ACTIVE',
  VACATION = 'VACATION',
  RESIGNED = 'RESIGNED'
}

// 教练性别枚举
export enum CoachGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

// 教练工作类型枚举
export enum CoachEmploymentType {
  FULLTIME = 'FULLTIME',
  PARTTIME = 'PARTTIME'
}

// 教练简单信息类型
export interface CoachSimple {
  id: number; // 修改为数字类型
  name: string;
  classFee?: number; // 教练课时费
  baseSalary?: number; // 基本工资
  performanceBonus?: number; // 绩效奖金
}

// 教练类型
export interface Coach {
  id: number | string;
  name: string;
  gender: CoachGender;
  workType: CoachEmploymentType; // 修改字段名
  idNumber: string; // 修改字段名
  phone: string;
  avatar?: string;
  jobTitle: string;
  certifications: string[] | string;
  coachingDate: string; // 修改字段名
  status: CoachStatus;
  hireDate: string;
  age?: number; // 年龄字段
  experience?: number; // 教龄字段
  baseSalary?: number;
  guaranteedHours?: number;
  classFee?: number;
  socialInsurance?: number;
  performanceBonus?: number;
  commission?: number;
  dividend?: number;
  campusId: number | string;
  campusName?: string;
}

// 教练查询参数
export interface CoachQueryParams {
  pageNum?: number;
  pageSize?: number;
  name?: string;
  phone?: string;
  keyword?: string; // 关键字搜索
  status?: CoachStatus;
  jobTitle?: string;
  campusId?: number | string;
  campusIds?: (number | string)[]; // 多选校区ID
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

// 教练创建参数
export interface CoachCreateParams {
  name: string;
  gender: CoachGender;
  workType: CoachEmploymentType; // 修改字段名
  idNumber: string; // 修改字段名
  phone: string;
  avatar?: string;
  jobTitle: string;
  certifications: string[] | string;
  coachingDate: string; // 修改字段名
  status: CoachStatus;
  hireDate: string;
  baseSalary?: number;
  guaranteedHours?: number;
  classFee?: number;
  socialInsurance?: number;
  performanceBonus?: number;
  commission?: number;
  dividend?: number;
  campusId: number | string;
}

// 教练更新参数
export interface CoachUpdateParams {
  id: number | string;
  name: string;
  gender: CoachGender;
  workType: CoachEmploymentType; // 修改字段名
  idNumber: string; // 修改字段名
  phone: string;
  avatar?: string;
  jobTitle: string;
  certifications: string[] | string;
  coachingDate: string; // 修改字段名
  status: CoachStatus;
  hireDate: string;
  baseSalary?: number;
  guaranteedHours?: number;
  classFee?: number;
  socialInsurance?: number;
  performanceBonus?: number;
  commission?: number;
  dividend?: number;
  campusId: number | string;
}

// 教练状态更新参数
export interface CoachStatusUpdateParams {
  id: number | string;
  status: CoachStatus;
}

// 教练列表响应
export interface CoachListResponse extends ApiResponse<PaginatedResponse<Coach>> {}

// 教练详情响应
export interface CoachDetailResponse extends ApiResponse<Coach> {}

// 教练创建响应
export interface CoachCreateResponse extends ApiResponse<number | string> {}

// 教练更新响应
export interface CoachUpdateResponse extends ApiResponse<null> {}

// 教练删除响应
export interface CoachDeleteResponse extends ApiResponse<null> {}

// 教练状态更新响应
export interface CoachStatusUpdateResponse extends ApiResponse<null> {}

// 教练简单列表响应
export interface CoachSimpleListResponse extends ApiResponse<CoachSimple[]> {}
