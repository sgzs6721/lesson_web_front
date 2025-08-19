import { Dayjs } from 'dayjs';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

// 定义课表接口
export interface ClassSchedule {
  date: string;
  weekday: string;
  startTime: string;
  endTime: string;
  courseName: string;
  coach: string;
  status: 'COMPLETED' | 'UPCOMING' | 'CANCELED';
}

// 定义上课记录接口
export interface ClassRecord {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  courseName: string;
  coach: string;
  content: string;
  feedback: string;
}

// 添加排课日期和时间选择接口
export interface ScheduleTime {
  weekday: string;
  time: string;
  endTime?: string;
}

// 缴费记录接口
export interface PaymentRecord {
  id: string;
  studentId: string;
  paymentType: string;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
  regularClasses: number;
  bonusClasses: number;
  validUntil: string;
  gift: string;
  remarks: string;
  courseId?: string;
  courseName?: string;
}

// 课程摘要接口
export interface CourseSummary {
  id?: string;
  name: string;
  type: string;
  coach: string;
  status: string;
  enrollDate: string;
  expireDate: string;
  remainingClasses?: string;
}

// API 学员接口
export interface StudentDTO {
  // 原有字段
  id?: string;
  name?: string;
  gender?: 'MALE' | 'FEMALE';
  age?: number;
  phone?: string;
  email?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  courseId?: string | number;
  courseName?: string;
  coachId?: string | number;
  coachName?: string;
  lastClassDate?: string;
  enrollDate?: string;
  expireDate?: string;
  remainingClasses?: number;
  status?: 'normal' | 'expired' | 'graduated' | 'STUDYING';
  campusId?: number;
  campusName?: string;
  createdTime?: string;
  updatedTime?: string;

  // 新API响应字段
  studentId?: number;
  studentDisplayId?: string;
  studentName?: string;
  studentGender?: 'MALE' | 'FEMALE';
  studentAge?: number;
  studentPhone?: string;
  courseTypeName?: string;
  totalHours?: number;
  consumedHours?: number;
  remainingHours?: number;
  lastClassTime?: string;
  enrollmentDate?: string;
  endDate?: string;
  studentCourseId?: number;
  courseType?: string;
  institutionId?: number;
  institutionName?: string;

  // 固定排课时间
  fixedSchedule?: string;

  // 新增课程列表 (对应API响应)
  courses?: CourseInfoDTO[];
}

// 新增课程信息DTO接口 (对应API响应中的课程结构 - 根据截图更新)
export interface CourseInfoDTO {
  studentCourseId: number;
  courseId: number;
  courseName: string;
  courseTypeId: number;
  courseTypeName: string;
  coachId: number;
  coachName: string;
  consumedHours: number;
  totalHours: number;
  status: string; // e.g., "STUDYING"
  endDate?: string;
  enrollmentDate?: string;
  fixedSchedule?: string | null;
  lastClassTime?: string | null;
  remainingHours?: number; // API似乎也提供了计算好的remainingHours
  // coaches?: { id: number; name: string; }[]; // 移除coaches数组，使用coachName
  // 移除之前错误定义的字段
  // id?: string;
  // name?: string;
  // type?: string;
  // unitHours?: number;
  // price?: number;
  // campusId?: number;
  // institutionId?: number;
  // description?: string;
  // createdTime?: string;
  // updateTime?: string;
}

// 前端使用的学员接口
export interface Student {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  phone: string;
  email?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  courseType?: string;
  course: string | string[];
  coach: string;
  lastClassDate?: string;
  enrollDate: string;
  expireDate?: string;
  remainingClasses: string; // 剩余课时
  status: 'normal' | 'expired' | 'graduated' | 'STUDYING';
  campusId: number;
  campusName?: string;
  scheduleTimes?: ScheduleTime[]; // 排课时间
  payments?: PaymentRecord[]; // 缴费记录
  courseGroups?: CourseGroup[]; // 课程组信息
  createdTime?: string;
  updatedTime?: string;

  // 新增字段
  studentId?: number;
  studentDisplayId?: string;
  totalHours?: number;
  consumedHours?: number;
  courseId?: string | number;
  coachId?: number;
  institutionId?: number;
  institutionName?: string;
  courses?: CourseInfoDTO[]; // 添加 courses 字段
}

// 学员创建请求
export interface CreateStudentRequest {
  name: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  phone: string;
  email?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  sourceId?: number; // 学员来源ID
  courseId?: string;
  coachId?: string;
  enrollDate: string;
  expireDate?: string;
  remainingClasses?: number;
  status: 'normal' | 'expired' | 'graduated' | 'STUDYING';
  campusId: number;
}

// 学员更新请求
export interface UpdateStudentRequest {
  name?: string;
  gender?: 'MALE' | 'FEMALE';
  age?: number;
  phone?: string;
  email?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  sourceId?: number; // 学员来源ID
  courseId?: string;
  coachId?: string;
  enrollDate?: string;
  expireDate?: string;
  remainingClasses?: number;
  status?: 'normal' | 'expired' | 'graduated' | 'STUDYING';
  campusId?: number;
}

// 课程组接口
export interface CourseGroup {
  key: string;
  courses: string[];
  courseType: string;
  coach: string;
  status: 'normal' | 'expired' | 'graduated' | 'STUDYING';
  enrollDate: string;
  expireDate: string;
  scheduleTimes: ScheduleTime[];
}

// 新增：与后端 StudentCourseStatus 对齐的状态字面量类型
export type StudentCourseStatusCode =
  | 'STUDYING'
  | 'EXPIRED'
  | 'GRADUATED'
  | 'WAITING_PAYMENT'
  | 'WAITING_RENEWAL'
  | 'REFUNDED';

// 学员查询参数
export interface StudentSearchParams {
  keyword?: string;
  status?: StudentCourseStatusCode;
  courseId?: string;
  coachId?: string;
  campusId?: number;
  enrollDateStart?: string;
  enrollDateEnd?: string;
  pageNum?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

// 前端使用的学员查询参数
export interface StudentUISearchParams {
  searchText: string;
  selectedStatus?: string;
  selectedCourse?: string;
  enrollMonth: Dayjs | null;
  sortOrder?: 'enrollDateAsc' | 'enrollDateDesc' | 'ageAsc' | 'ageDesc' | 'remainingClassesAsc' | 'remainingClassesDesc' | 'lastClassDateAsc' | 'lastClassDateDesc';
}

// --- Attendance Record Types ---

// 打卡记录列表请求参数
export interface AttendanceListParams extends PaginationParams {
  studentId: number;
  campusId: number;
}

// 单条打卡记录 (API 返回)
export interface AttendanceRecordDTO {
  courseDate: string;
  timeRange: string;
  coachName: string;
  courseName: string;
  notes: string;
  recordId: number;
}

// 打卡记录列表响应数据
export interface AttendanceListResponseData extends PaginatedResponse<AttendanceRecordDTO> {}

// 打卡记录列表完整 API 响应
export interface AttendanceListApiResponse extends ApiResponse<AttendanceListResponseData> {}

// 退费请求接口
export interface RefundRequest {
  studentId: number;
  courseId: number;
  refundAmount: number;
  refundReason: string;
  refundDate: string;
  notes?: string;
  refundMethod?: string; // 退费方式：WECHAT, ALIPAY, CASH, CARD, BANK_TRANSFER
}

// 退费响应接口
export interface RefundResponse {
  refundId: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  refundAmount: number;
  refundDate: string;
  refundReason: string;
  notes?: string;
  createdTime: string;
}
