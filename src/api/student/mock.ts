import { Student, ClassRecord, PaymentRecord } from './types';
import { ApiResponse, PaginatedResponse } from '../types';

// 模拟学生数据
export const mockStudents: Student[] = [
  {
    id: '1',
    name: '张小明',
    gender: 'male',
    age: 10,
    phone: '13800138001',
    courseType: '数学',
    course: '数学基础',
    coach: '王老师',
    lastClassDate: '2023-05-15',
    enrollDate: '2023-01-10',
    expireDate: '2023-12-31',
    remainingClasses: '15',
    status: 'active'
  },
  {
    id: '2',
    name: '李小红',
    gender: 'female',
    age: 9,
    phone: '13800138002',
    courseType: '英语',
    course: '英语口语',
    coach: '李老师',
    lastClassDate: '2023-05-16',
    enrollDate: '2023-02-15',
    expireDate: '2023-11-30',
    remainingClasses: '10',
    status: 'active'
  },
  {
    id: '3',
    name: '王小刚',
    gender: 'male',
    age: 11,
    phone: '13800138003',
    courseType: '物理',
    course: '物理入门',
    coach: '张老师',
    lastClassDate: '2023-05-10',
    enrollDate: '2023-03-01',
    expireDate: '2023-10-31',
    remainingClasses: '5',
    status: 'inactive'
  }
];

// 模拟课程记录
export const mockClassRecords: Record<string, ClassRecord[]> = {
  '1': [
    {
      id: '101',
      date: '2023-05-15',
      startTime: '14:00',
      endTime: '15:30',
      courseName: '数学基础',
      coach: '王老师',
      content: '加减乘除基础练习',
      feedback: '掌握良好，需要加强乘法练习'
    },
    {
      id: '102',
      date: '2023-05-08',
      startTime: '14:00',
      endTime: '15:30',
      courseName: '数学基础',
      coach: '王老师',
      content: '分数基础概念',
      feedback: '理解较好，需要多做练习'
    }
  ],
  '2': [
    {
      id: '201',
      date: '2023-05-16',
      startTime: '16:00',
      endTime: '17:30',
      courseName: '英语口语',
      coach: '李老师',
      content: '日常对话练习',
      feedback: '发音有进步，需要增加词汇量'
    }
  ]
};

// 模拟缴费记录
export const mockPaymentRecords: Record<string, PaymentRecord[]> = {
  '1': [
    {
      id: '1001',
      studentId: '1',
      paymentType: '学费',
      amount: 3000,
      paymentMethod: '微信支付',
      transactionDate: '2023-01-10',
      regularClasses: 20,
      bonusClasses: 2,
      validUntil: '2023-12-31',
      gift: '教材一套',
      remarks: '开学优惠活动',
      courseId: '101',
      courseName: '数学基础'
    }
  ],
  '2': [
    {
      id: '2001',
      studentId: '2',
      paymentType: '学费',
      amount: 2500,
      paymentMethod: '支付宝',
      transactionDate: '2023-02-15',
      regularClasses: 15,
      bonusClasses: 1,
      validUntil: '2023-11-30',
      gift: '练习册一本',
      remarks: '',
      courseId: '201',
      courseName: '英语口语'
    }
  ]
};

// 模拟 API 响应
export const mockApiResponse = <T>(data: T, message = '操作成功'): ApiResponse<T> => {
  return {
    code: 0,
    data,
    message
  };
};

// 模拟分页响应
export const mockPaginatedResponse = <T>(
  list: T[],
  page: number,
  pageSize: number,
  total = list.length
): ApiResponse<PaginatedResponse<T>> => {
  return {
    code: 0,
    data: {
      list,
      total,
      page,
      pageSize
    },
    message: '获取成功'
  };
};
