export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  coachId: string;
  coachName: string;
  campusId: string;
  campusName: string;
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
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