import { request } from '../config';
import { 
  FixedScheduleData, 
  FixedScheduleResponse, 
  CoachSimpleInfo, 
  CoachSimpleListResponse
} from './types';

// API路径常量
const SCHEDULE_API_PATHS = {
  FIXED_SCHEDULE: '/lesson/api/fixed-schedule/list',
  COACH_SIMPLE_LIST: '/lesson/api/coach/simple/list'
};

// 课表管理相关接口
export const schedule = {
  // 获取固定课表
  getFixedSchedule: async (campusId: number): Promise<FixedScheduleData> => {
    const url = `${SCHEDULE_API_PATHS.FIXED_SCHEDULE}?campusId=${campusId}`;
    const response: FixedScheduleResponse = await request(url);
    return response.data;
  },

  // 获取教练简单列表
  getCoachSimpleList: async (campusId: number): Promise<CoachSimpleInfo[]> => {
    const url = `${SCHEDULE_API_PATHS.COACH_SIMPLE_LIST}?campusId=${campusId}`;
    const response: CoachSimpleListResponse = await request(url);
    return response.data;
  }
}; 