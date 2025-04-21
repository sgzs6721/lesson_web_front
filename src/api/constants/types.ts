import { ApiResponse } from '../types';

// 常量类型
export interface Constant {
  id: number;
  constantKey: string;
  constantValue: string;
  description?: string;
  type: string;
  status: number;
}

// 常量列表响应
export interface ConstantListResponse extends ApiResponse<Constant[]> {}
