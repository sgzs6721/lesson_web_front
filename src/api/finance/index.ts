import { request } from '../config';

// 添加收支记录的请求参数类型
export interface CreateFinanceRecordRequest {
  type: 'EXPEND' | 'INCOME';
  date: string;
  item: string;
  amount: number;
  category: string;
  notes?: string;
  campusId: number;
}

// 查询财务记录列表的请求参数类型
export interface FinanceListRequest {
  transactionType?: 'INCOME' | 'EXPEND';
  keyword?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  campusId: number;
  pageNum: number;
  pageSize: number;
}

// 财务记录响应类型
export interface FinanceRecord {
  id: string;
  type: 'EXPEND' | 'INCOME';
  date: string;
  item: string;
  amount: number;
  category: string;
  notes: string;
  operator: string;
  campusId: number;
  createdAt: string;
  updatedAt: string;
}

// 分页响应类型
export interface FinanceListResponse {
  list: FinanceRecord[];
  total: number;
  pageNum: number;
  pageSize: number;
}

// 添加收支记录
export async function createFinanceRecord(data: CreateFinanceRecordRequest) {
  return request('/lesson/api/finance/record', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 查询财务记录列表
export async function getFinanceList(data: FinanceListRequest): Promise<{
  code: number;
  message: string;
  data: FinanceListResponse;
}> {
  return request('/lesson/api/finance/list', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 导出所有API
export const financeAPI = {
  createRecord: createFinanceRecord,
  getList: getFinanceList
}; 