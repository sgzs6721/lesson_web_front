import { Dayjs } from 'dayjs';
import { ApiResponse, PaginatedResponse } from '../types';

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
  courseId?: number;
  coachId?: number;
  institutionId?: number;
  institutionName?: string;
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

// 学员查询参数
export interface StudentSearchParams {
  keyword?: string;
  status?: 'normal' | 'expired' | 'graduated' | 'STUDYING';
  courseId?: string;
  coachId?: string;
  campusId?: number;
  enrollDateStart?: string;
  enrollDateEnd?: string;
  page?: number;
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
