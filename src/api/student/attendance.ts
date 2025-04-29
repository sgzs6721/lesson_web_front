import { request } from '../config';

// 打卡API路径
const STUDENT_ATTENDANCE_API_PATHS = {
  CHECK_IN: '/lesson/api/student/check-in',
};

/**
 * 学员打卡
 * @param data 打卡数据
 * @returns 打卡结果
 */
export const checkInStudent = async (data: {
  studentId: number;
  courseId: number;
  courseDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  duration?: number | string;
}) => {
  return request(STUDENT_ATTENDANCE_API_PATHS.CHECK_IN, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
