import { Dayjs } from 'dayjs';
import { CoachGender, CoachStatus, CoachEmploymentType } from '../../../api/coach/types';

// 性别类型定义
export type Gender = CoachGender;

// 薪资对象接口
export interface CoachSalary {
  baseSalary: number;
  guaranteedHours: number;
  classFee: number;
  socialInsurance: number;
  performanceBonus: number;
  commission: number;
  dividend: number;
}

// 教练接口
export interface Coach {
  id: string;
  name: string;
  gender: Gender;
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
  // 可以直接访问的薪资字段
  baseSalary?: number;
  guaranteedHours?: number;
  classFee?: number;
  socialInsurance?: number;
  performanceBonus?: number;
  commission?: number;
  dividend?: number;
  // 也支持通过salary对象访问
  salary?: CoachSalary;
  campusId?: number | string;
  campusName?: string;
  institutionId?: number | string;
  institutionName?: string;
  // 薪资生效日期
  salaryEffectiveDate?: string;
}

// 教练搜索参数
export type CoachSearchParams = {
  searchText: string;
  selectedStatus?: string;
  selectedJobTitle?: string;
  sortField?: 'coachingDate' | 'hireDate' | 'status' | 'idNumber' | 'jobTitle' | 'gender' | 'age' | 'experience';
};

// 视图模式
export type ViewMode = 'table' | 'card';