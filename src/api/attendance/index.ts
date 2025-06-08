import { request } from '../config';
import type { 
  AttendanceStatRequest, 
  AttendanceStatResponse 
} from '@/pages/attendance/types';

// 打卡统计API路径
const API_PATHS = {
  STATISTICS: '/lesson/api/attendance/record/stat',
  LIST: '/lesson/api/attendance/record/list',
};

// 打卡记录列表请求参数
export interface AttendanceListRequest {
  studentId?: number;
  keyword?: string;
  courseId?: number;
  campusId: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  pageNum: number;
  pageSize: number;
}

// 打卡记录项 - 根据实际API返回的数据结构
export interface AttendanceRecordItem {
  date: string;
  studentName: string;
  courseName: string;
  coachName: string;
  classTime: string;
  checkTime: string;
  status: string;
  // 以下字段可能在API中以不同名称返回，需要根据实际情况调整
  [key: string]: any; // 添加索引签名以支持任意字段
}

// 打卡记录列表响应
export interface AttendanceListResponse {
  list: AttendanceRecordItem[];
  total: number;
}

// 打卡记录列表API响应
export interface AttendanceListApiResponse {
  code: number;
  message: string;
  data: AttendanceListResponse;
}

/**
 * 获取打卡消课统计数据
 * @param params 请求参数
 * @returns 统计数据
 */
export async function getAttendanceStatistics(params: AttendanceStatRequest): Promise<AttendanceStatResponse> {
  try {
    console.log('获取出勤统计参数:', params);
    
    const response = await request(API_PATHS.STATISTICS, {
      method: 'POST',
      body: JSON.stringify(params)
    });
    
    if (response.code !== 200) {
      throw new Error(response.message || '获取出勤统计失败');
    }
    
    console.log('出勤统计响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取出勤统计失败:', error);
    throw error;
  }
}

/**
 * 获取打卡消课记录列表
 * @param params 请求参数
 * @returns 记录列表数据
 */
export async function getAttendanceList(params: AttendanceListRequest): Promise<AttendanceListResponse> {
  try {
    console.log('获取打卡记录列表参数:', params);
    
    const response = await request(API_PATHS.LIST, {
      method: 'POST',
      body: JSON.stringify(params)
    });
    
    if (response.code !== 200) {
      throw new Error(response.message || '获取打卡记录列表失败');
    }
    
    console.log('打卡记录列表响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取打卡记录列表失败:', error);
    throw error;
  }
}

export const attendance = {
  getStatistics: getAttendanceStatistics,
  getList: getAttendanceList,
}; 