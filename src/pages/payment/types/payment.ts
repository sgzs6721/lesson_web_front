import { Dayjs } from 'dayjs';

export interface Payment {
  id: string;
  date: string;
  studentName: string;
  studentId: string;
  course: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: '微信支付' | '现金支付' | '支付宝支付' | '银行卡转账';
  remark: string;
  operator: string;
  lessonType?: string;
  lessonChange?: string;
  payType?: string;
  giftHours?: number; // 赠课课时
}

export type PaymentSearchParams = {
  searchText: string;
  searchStatus: string;
  searchPaymentType: string;
  searchPaymentMethod: string | string[]; // 兼容单选和多选
  selectedCourse: string | string[]; // 兼容单选和多选
  dateRange: [Dayjs | null, Dayjs | null] | null;
};

// API相关类型
export interface PaymentStatistics {
  paymentCount: number;
  paymentTotal: number;
  refundCount: number;
  refundTotal: number;
}

export interface PaymentFilterParams {
  keyword?: string;
  courseId?: number;
  courseIds?: number[]; // 新增多选课程ID数组
  lessonType?: string;
  paymentType?: string;
  paymentTypes?: string[]; // 新增多选支付类型数组
  payType?: string;
  campusId: number;
  startDate?: string;
  endDate?: string;
  pageNum: number;
  pageSize: number;
  sortField?: string; // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方向
} 