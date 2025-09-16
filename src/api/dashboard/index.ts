import { request } from '../config';

// 学员打卡记录对象
export interface StudentAttendanceVO {
  studentName: string;    // 学员姓名
  timeSlot: string;       // 时间段
  status: '已完成' | '请假' | '未打卡';  // 状态
}

// 课程详情对象
export interface CourseDetailVO {
  courseName: string;     // 课程名称
  coachName: string;      // 教练姓名
  hours: number;          // 课时数
  remuneration: number;   // 课酬
  salesAmount: number;    // 销课金额
  studentAttendances: StudentAttendanceVO[];  // 学员打卡记录列表
}

// 数据总览对象
export interface DashboardOverviewVO {
  // 今日数据
  teacherCount: number;           // 今日上课老师数量
  classCount: number;             // 今日上课班级数量
  studentCount: number;           // 今日上课学员数量
  checkinCount: number;           // 今日打卡次数
  consumedHours: number;          // 今日消耗课时
  leaveCount: number;             // 今日请假人数
  teacherRemuneration: number;    // 今日老师课酬总额
  consumedFees: number;           // 今日消耗费用总额
  
  // 总体数据
  totalRevenue: number;           // 总流水
  totalRevenueChangePercent: number;  // 总流水较上周变化百分比
  totalProfit: number;            // 总利润
  totalProfitChangePercent: number;   // 总利润较上周变化百分比
  totalStudents: number;          // 总学员数
  totalStudentsChangePercent: number; // 总学员数较上周变化百分比
  totalCoaches: number;           // 教练总数量
  partTimeCoaches: number;        // 兼职教练数量
  fullTimeCoaches: number;        // 全职教练数量
  
  // 本周数据
  currentWeekClassHoursRatio: string;  // 本周课时比例（已销/总课时）
  currentWeekSalesAmount: number;      // 本周销课金额
  currentWeekPayingStudents: number;   // 本周缴费学员总数
  currentWeekNewPayingStudents: number; // 本周新学员缴费数
  currentWeekRenewalPayingStudents: number; // 本周续费学员缴费数
  currentWeekPaymentAmount: number;    // 本周缴费总金额
  currentWeekNewStudentPaymentAmount: number; // 本周新学员缴费金额
  currentWeekRenewalPaymentAmount: number;    // 本周续费学员缴费金额
  currentWeekAttendanceRate: number;   // 本周出勤率（百分比）
  currentWeekAttendanceRateChangePercent: number; // 本周出勤率较上周变化百分比
}

// 首页今日数据响应类型
export interface TodayDataResponse {
  code: number;
  message: string;
  data: {
    overview: DashboardOverviewVO;  // 数据总览对象
    courseDetails: CourseDetailVO[];  // 课程详情数组
  };
}

// 首页数据总览响应类型
export interface OverviewDataResponse {
  code: number;
  message: string;
  data: DashboardOverviewVO;
}

// 今日课程详情响应类型
export interface CoursesDataResponse {
  code: number;
  message: string;
  data: CourseDetailVO[];
}

// 首页数据API
export const dashboardApi = {
  // 获取今日首页数据
  getTodayData: (): Promise<TodayDataResponse> =>
    request('/lesson/api/dashboard/today', {
      method: 'GET'
    }),

  // 获取今日数据总览
  getOverviewData: (): Promise<OverviewDataResponse> =>
    request('/lesson/api/dashboard/overview', {
      method: 'GET'
    }),

  // 获取今日课程详情
  getCoursesData: (): Promise<CoursesDataResponse> =>
    request('/lesson/api/dashboard/courses', {
      method: 'GET'
    }),

  // 刷新今日数据缓存
  refreshTodayData: (): Promise<{ code: number; message: string; data: any }> =>
    request('/lesson/api/dashboard/refresh', {
      method: 'POST'
    })
};
