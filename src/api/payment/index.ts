import { request } from '../config';

// API路径
const API_PATHS = {
  STATISTICS: '/lesson/api/payment/record/stat',
  LIST: '/lesson/api/payment/record/list',
  UPDATE: '/lesson/api/payment/record/update',
};

// 缴费记录统计请求参数
export interface PaymentStatRequest {
  studentId?: number;
  keyword?: string;
  courseId?: number;
  courseIds?: number[];
  lessonType?: string;
  paymentType?: string;
  paymentTypes?: string[];
  payType?: string;
  campusId: number;
  startDate?: string;
  endDate?: string;
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
  studentId?: number;
  keyword?: string;
  courseId?: number;
  courseIds?: number[]; // 支持多选课程
  lessonType?: string;
  paymentType?: string;
  paymentTypes?: string[]; // 支持多选缴费类型
  payType?: string;
  campusId: number;
  startDate?: string;
  endDate?: string;
  pageNum: number;
  pageSize: number;
  sortField?: string; // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方向
}

// 缴费记录项
export interface PaymentRecordItem {
  id: number; // 记录ID，用于update操作
  date: string;
  student: string;
  studentId: string; // 学员ID
  course: string;
  amount: string;
  hours?: number; // 课时数
  lessonType: string;
  lessonChange: string;
  paymentType: string;
  payType: string;
  giftedHours?: number; // 赠课课时
  [key: string]: any;
}

// 缴费记录列表响应
export interface PaymentListResponse {
  list: PaymentRecordItem[];
  total: number;
}

// 更新缴费记录请求参数
export interface UpdatePaymentRecordRequest {
  id: number;
  paymentType: string;
  amount: number;
  courseHours: number;
  validityPeriodId: number;
  paymentMethod: string;
  transactionDate: string;
  giftedHours: number;
  giftIds: number[];
  remarks: string;
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

    // 组装查询字符串
    const queryParams = new URLSearchParams();
    if (typeof params.studentId === 'number') queryParams.set('studentId', String(params.studentId));
    if (params.keyword) queryParams.set('keyword', params.keyword);
    if (typeof params.courseId === 'number') queryParams.set('courseId', String(params.courseId));
    if (Array.isArray(params.courseIds)) {
      params.courseIds.forEach(id => queryParams.append('courseIds', String(id)));
    }
    if (params.lessonType) queryParams.set('lessonType', params.lessonType);
    if (params.paymentType) queryParams.set('paymentType', params.paymentType);
    if (Array.isArray(params.paymentTypes)) {
      params.paymentTypes.forEach(t => t && queryParams.append('paymentTypes', String(t)));
    }
    if (params.payType) queryParams.set('payType', params.payType);
    if (typeof params.campusId === 'number') queryParams.set('campusId', String(params.campusId));
    if (params.startDate) queryParams.set('startDate', params.startDate);
    if (params.endDate) queryParams.set('endDate', params.endDate);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await request(`${API_PATHS.STATISTICS}${queryString}`);
    
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
 * 获取缴费记录列表（改为GET）
 * @param params 请求参数
 * @returns 记录列表数据
 */
export async function getPaymentList(params: PaymentListRequest): Promise<PaymentListResponse> {
  try {
    console.log('获取缴费记录列表参数:', params);

    // 组装查询字符串
    const queryParams = new URLSearchParams();
    if (typeof params.studentId === 'number') queryParams.set('studentId', String(params.studentId));
    if (params.keyword) queryParams.set('keyword', params.keyword);
    if (typeof params.courseId === 'number') queryParams.set('courseId', String(params.courseId));
    if (Array.isArray(params.courseIds)) {
      params.courseIds.forEach(id => queryParams.append('courseIds', String(id)));
    }
    if (params.lessonType) queryParams.set('lessonType', params.lessonType);
    if (params.paymentType) queryParams.set('paymentType', params.paymentType);
    if (Array.isArray(params.paymentTypes)) {
      params.paymentTypes.forEach(t => t && queryParams.append('paymentTypes', String(t)));
    }
    if (params.payType) queryParams.set('payType', params.payType);
    if (typeof params.campusId === 'number') queryParams.set('campusId', String(params.campusId));
    if (params.startDate) queryParams.set('startDate', params.startDate);
    if (params.endDate) queryParams.set('endDate', params.endDate);
    if (typeof params.pageNum === 'number') queryParams.set('pageNum', String(params.pageNum));
    if (typeof params.pageSize === 'number') queryParams.set('pageSize', String(params.pageSize));
    if (params.sortField) queryParams.set('sortField', params.sortField);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await request(`${API_PATHS.LIST}${queryString}`);
    
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

/**
 * 更新缴费记录
 * @param params 更新参数
 * @returns 更新结果
 */
export async function updatePaymentRecord(params: UpdatePaymentRecordRequest): Promise<void> {
  try {
    console.log('更新缴费记录参数:', params);
    
    const response = await request(API_PATHS.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(params)
    });
    
    if (response.code !== 200) {
      throw new Error(response.message || '更新缴费记录失败');
    }
    
    console.log('更新缴费记录成功');
  } catch (error) {
    console.error('更新缴费记录失败:', error);
    throw error;
  }
}

export const payment = {
  getStatistics: getPaymentStatistics,
  getList: getPaymentList,
  updateRecord: updatePaymentRecord,
}; 