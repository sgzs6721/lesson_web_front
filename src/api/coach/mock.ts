import { Coach, CoachGender, CoachStatus } from './types';
import { PaginatedResponse } from '../types';

// 模拟教练数据
export const mockCoaches: Coach[] = [
  {
    id: 1,
    name: '张教练',
    gender: CoachGender.MALE,
    age: 32,
    phone: '13800138001',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    jobTitle: '高级健身教练',
    certifications: '国家健身教练认证,CPR急救认证',
    experience: 8,
    status: CoachStatus.ACTIVE,
    hireDate: '2020-01-15',
    baseSalary: 8000,
    socialInsurance: 2000,
    classFee: 200,
    performanceBonus: 3000,
    commission: 0.1,
    campusId: 1,
    campusName: '总部校区'
  },
  {
    id: 2,
    name: '李教练',
    gender: CoachGender.FEMALE,
    age: 28,
    phone: '13900139001',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    jobTitle: '瑜伽教练',
    certifications: '国际瑜伽联盟认证教练,普拉提初级认证',
    experience: 5,
    status: CoachStatus.ACTIVE,
    hireDate: '2021-03-20',
    baseSalary: 7500,
    socialInsurance: 1800,
    classFee: 180,
    performanceBonus: 2500,
    commission: 0.08,
    campusId: 2,
    campusName: '东区校区'
  },
  {
    id: 3,
    name: '王教练',
    gender: CoachGender.MALE,
    age: 35,
    phone: '13700137001',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    jobTitle: '私人教练',
    certifications: 'NSCA-CPT认证,功能性训练专家',
    experience: 10,
    status: CoachStatus.VACATION,
    hireDate: '2019-05-10',
    baseSalary: 9000,
    socialInsurance: 2200,
    classFee: 250,
    performanceBonus: 4000,
    commission: 0.12,
    campusId: 1,
    campusName: '总部校区'
  },
  {
    id: 4,
    name: '赵教练',
    gender: CoachGender.FEMALE,
    age: 30,
    phone: '13600136001',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    jobTitle: '舞蹈教练',
    certifications: '现代舞高级教师,爵士舞专业认证',
    experience: 7,
    status: CoachStatus.ACTIVE,
    hireDate: '2020-08-15',
    baseSalary: 7800,
    socialInsurance: 1900,
    classFee: 190,
    performanceBonus: 2800,
    commission: 0.09,
    campusId: 3,
    campusName: '西区校区'
  },
  {
    id: 5,
    name: '陈教练',
    gender: CoachGender.MALE,
    age: 40,
    phone: '13500135001',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    jobTitle: '搏击教练',
    certifications: '国家级拳击教练,泰拳专业认证',
    experience: 15,
    status: CoachStatus.RESIGNED,
    hireDate: '2018-02-01',
    baseSalary: 9500,
    socialInsurance: 2300,
    classFee: 280,
    performanceBonus: 4500,
    commission: 0.15,
    campusId: 2,
    campusName: '东区校区'
  }
];

// 模拟API响应
export const mockApiResponse = <T>(data: T, code = 200, message = 'success') => {
  return {
    code,
    data,
    message
  };
};

// 模拟分页响应
export const mockPaginatedResponse = <T>(
  list: T[],
  pageNum: number,
  pageSize: number,
  total: number
): PaginatedResponse<T> => {
  return {
    list,
    pageNum,
    pageSize,
    total,
    pages: Math.ceil(total / pageSize)
  };
};
