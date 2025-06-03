import { ApiResponse } from '../types';

// 课表中的课程信息
export interface ScheduleCourseInfo {
  coachName: string;
  remainHours: string;
  totalHours: string;
  unitPrice: string;
  courseName: string;
  courseType: string;
  description: string;
}

// 固定课表响应数据结构
export interface FixedScheduleData {
  timeSlots: string[];
  days: string[];
  schedule: {
    [timeSlot: string]: {
      [day: string]: ScheduleCourseInfo[];
    };
  };
}

// 固定课表API响应
export interface FixedScheduleResponse extends ApiResponse<FixedScheduleData> {}

// 教练简单信息
export interface CoachSimpleInfo {
  id: number;
  name: string;
}

// 教练简单列表响应
export interface CoachSimpleListResponse extends ApiResponse<CoachSimpleInfo[]> {} 