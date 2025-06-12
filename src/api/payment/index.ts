import { request } from '../config';

// API路径
const API_PATHS = {
  STATISTICS: '/lesson/api/payment/record/stat',
  LIST: '/lesson/api/payment/record/list',
};

// 缴费记录统计请求参数
export interface PaymentStatRequest {
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

// 缴费记录统计响应
export interface PaymentStatResponse {
  paymentCount: number;
  paymentTotal: number;
  refundCount: number;
  refundTotal: number;
}

// 缴费记录列表请求参数
export interface PaymentListRequest {
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

// 缴费记录项
export interface PaymentRecordItem {
  date: string;
  student: string;
  course: string;
  amount: string;
  lessonType: string;
  lessonChange: string;
  paymentType: string;
  payType: string;
  [key: string]: any;
}

// 缴费记录列表响应
export interface PaymentListResponse {
  list: PaymentRecordItem[];
  total: number;
}

// API响应包装
export interface PaymentApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 获取缴费记录统计数据
 * @param params 请求参数
 * @returns 统计数据
 */
export async function getPaymentStatistics(params: PaymentStatRequest): Promise<PaymentStatResponse> {
  try {
    console.log('获取缴费统计参数:', params);
    
    const response = await request(API_PATHS.STATISTICS, {
      method: 'POST',
      body: JSON.stringify(params)
    });
    
    if (response.code !== 200) {
      throw new Error(response.message || '获取缴费统计失败');
    }
    
    console.log('缴费统计响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取缴费统计失败:', error);
    throw error;
  }
}

/**
 * 获取缴费记录列表
 * @param params 请求参数
 * @returns 记录列表数据
 */
export async function getPaymentList(params: PaymentListRequest): Promise<PaymentListResponse> {
  try {
    console.log('获取缴费记录列表参数:', params);
    
    const response = await request(API_PATHS.LIST, {
      method: 'POST',
      body: JSON.stringify(params)
    });
    
    if (response.code !== 200) {
      throw new Error(response.message || '获取缴费记录列表失败');
    }
    
    console.log('缴费记录列表响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取缴费记录列表失败:', error);
    throw error;
  }
}

export const payment = {
  getStatistics: getPaymentStatistics,
  getList: getPaymentList,
}; 