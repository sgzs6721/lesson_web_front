/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T = any> {
  code: number; // 业务状态码，通常 0 表示成功
  data: T; // 响应数据
  message: string; // 响应消息
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  pageNum: number; // 修正：页码字段为 pageNum (通常从 1 开始)
  pageSize: number; // 每页数量
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T> {
  list: T[]; // 当前页数据列表
  total: number; // 总记录数
  pageNum?: number; // 当前页码
  page?: number; // 当前页码（兼容字段）
  pageSize: number; // 每页数量
  pages?: number; // 总页数
}

/**
 * 自定义 API 错误类
 */
export class ApiError extends Error {
  code: number; // 业务状态码或 HTTP 状态码
  data?: any; // 可能包含的额外错误数据

  constructor(message: string, code: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
    // 保持正确的堆栈跟踪 (如果目标环境支持)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}