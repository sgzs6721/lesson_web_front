import { Dayjs } from 'dayjs';

// 性别类型定义
export type Gender = 'male' | 'female';

// 教练接口
export interface Coach {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  phone: string;
  avatar?: string;
  jobTitle: string;
  certifications: string;
  experience: number;
  status: 'active' | 'vacation' | 'resigned';
  hireDate: string;
  baseSalary?: number;
  socialSecurity?: number;
  hourlyRate?: number;
  performanceBonus?: number;
  commission?: number;
  dividend?: number;
}

// 教练搜索参数
export type CoachSearchParams = {
  searchText: string;
  selectedStatus?: string;
  selectedJobTitle?: string;
  sortField?: 'experience' | 'hireDate';
};

// 视图模式
export type ViewMode = 'table' | 'card'; 