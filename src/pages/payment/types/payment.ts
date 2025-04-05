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
}

export type PaymentSearchParams = {
  searchText: string;
  searchStatus: string;
  searchPaymentType: string;
  searchPaymentMethod: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
}; 