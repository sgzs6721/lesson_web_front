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
}

export type PaymentSearchParams = {
  searchText: string;
  searchStatus: string;
  searchPaymentType: string;
  searchPaymentMethod: string;
  selectedCourse: string;
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
  lessonType?: string;
  paymentType?: string;
  payType?: string;
  campusId: number;
  startDate?: string;
  endDate?: string;
  pageNum: number;
  pageSize: number;
} 