import { Dayjs } from 'dayjs';
import { CoachGender, CoachStatus } from '../../../api/coach/types';

// 性别类型定义
export type Gender = CoachGender;

// 薪资对象接口
export interface CoachSalary {
  baseSalary: number;
  socialInsurance: number;
  classFee: number;
  performanceBonus: number;
  commission: number;
  dividend: number;
}

// 教练接口
export interface Coach {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  phone: string;
  avatar?: string;
  jobTitle: string;
  certifications: string[] | string;
  experience: number;
  status: CoachStatus;
  hireDate: string;
  // 可以直接访问的薪资字段
  baseSalary?: number;
  socialInsurance?: number;
  classFee?: number;
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
  sortField?: 'experience' | 'hireDate' | 'status' | 'age' | 'jobTitle' | 'gender';
};

// 视图模式
export type ViewMode = 'table' | 'card';