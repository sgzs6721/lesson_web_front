import { Dayjs } from 'dayjs';

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

// 学员接口 (UI 层使用)
export interface Student {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE'; // 与 API 保持一致
  age: number;
  phone: string;
  sourceId?: number; // 学员来源ID
  email?: string;         // 与 API 保持一致
  address?: string;        // 与 API 保持一致
  parentName?: string;     // 与 API 保持一致
  parentPhone?: string;    // 与 API 保持一致
  // --- 以下字段 UI 可能需要，但 API DTO 中可能没有或名称不同，需要确认 ---
  courseType?: string;     // 课程类型名称 (改为可选?)
  course: string | string[]; // 课程 ID 列表 (可能来自 CourseGroup)
  courseId?: number | string; // 课程 ID (与 API 保持一致)
  coach: string;           // 教练名称 (可能来自 CourseGroup)
  lastClassDate?: string;  // API 中有 lastClassDate (改为可选?)
  enrollDate: string;      // API 中有 enrollDate
  expireDate?: string;     // API 中有 expireDate (改为可选?)
  remainingClasses: string; // 改为必需的 string
  status: 'normal' | 'expired' | 'graduated' | 'STUDYING'; // 使用更新后的状态
  // --- 以下字段 API DTO 中有，UI 层也需要 ---
  campusId: number;        // 与 API 保持一致
  campusName?: string;     // 与 API 保持一致
  createdTime?: string;    // 与 API 保持一致
  updatedTime?: string;    // 与 API 保持一致
  // --- 以下为 UI 层特有或关联数据 ---
  scheduleTimes?: ScheduleTime[];
  payments?: PaymentRecord[];
  courseGroups?: CourseGroup[];
  courses?: CourseInfo[]; // 新增 courses 数组

  // 新增字段，确保与 convertDtoToStudent 中映射的字段一致
  studentId?: number;         // 对应 dto.studentId
  studentDisplayId?: string;  // 对应 dto.studentDisplayId (如果API返回)
  totalHours?: number;        // 对应 dto.totalHours
  consumedHours?: number;     // 对应 dto.consumedHours
  // courseId?: number | string; // 已存在
  coachId?: number;           // 对应 dto.coachId
  institutionId?: number;     // 对应 dto.institutionId
  institutionName?: string;   // 对应 dto.institutionName
}

// 课程组接口 (UI 层使用，确认字段来源)
export interface CourseGroup {
  key: string;
  courses: string[]; // 课程 ID 列表
  courseType: string; // 课程类型名称 (来自 SimpleCourse.typeName)
  coach: string;      // 教练名称 (来自 SimpleCourse.coaches[0].name)
  status?: 'normal' | 'expired' | 'graduated' | 'STUDYING' | ''; // <--- 恢复允许空字符串
  enrollDate: string;
  expireDate: string;
  scheduleTimes: ScheduleTime[];
  // 新增字段
  originalCourseName?: string; // 原始课程名称，用于API调用
  originalCoachName?: string;  // 原始教练名称，用于API调用
  studentCourseId?: number;    // 学员课程关系ID，用于编辑时更新现有记录
}

// 新增课程信息接口 (基于API响应 - 根据截图更新)
export interface CourseInfo {
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
  remainingHours?: number;
}

// 学员查询参数
export interface StudentSearchParams {
  searchText: string;
  selectedStatus?: string;
  selectedCourse?: string;
  enrollMonth: Dayjs | null;
  sortOrder?: 'enrollDateAsc' | 'enrollDateDesc' | 'ageAsc' | 'ageDesc' | 'remainingClassesAsc' | 'remainingClassesDesc' | 'lastClassDateAsc' | 'lastClassDateDesc';
}

// --- UI Attendance Record Type ---
// 导入 API 的 DTO 类型
import { AttendanceRecordDTO } from '@/api/student/types';

// 定义 UI 层使用的打卡记录类型
export interface UIAttendanceRecord extends AttendanceRecordDTO {
  key: string | number; // 添加 key 用于表格
}