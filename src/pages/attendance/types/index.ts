export interface AttendanceRecord {
  id: string;
  date: string;
  studentName: string;
  studentId?: string;
  courseName: string;
  checkTime: string;
  classTime: string;
  coachName: string;
  status: string;
  remarks?: string; // 包含金额、课程类型、课时变化、缴费类型、支付方式等信息
}

export interface AttendanceStatistics {
  total: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  presentRate: number;
  absentRate: number;
  lateRate: number;
  leaveRate: number;
}

export interface FilterParams {
  searchText: string;
  selectedCourse: string;
  selectedCampus: string;
  selectedStatus: string;
  dateRange: [string, string] | null;
  currentPage: number;
  pageSize: number;
}

// API请求类型
export interface AttendanceStatRequest {
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

// API响应类型
export interface AttendanceStatResponse {
  studentCount: number;
  totalAttendance: number;
  totalLeave: number;
  attendanceRate: number;
}

export interface AttendanceStatApiResponse {
  code: number;
  message: string;
  data: AttendanceStatResponse;
} 