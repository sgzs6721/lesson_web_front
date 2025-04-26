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
}

// 课程组接口 (UI 层使用，确认字段来源)
export interface CourseGroup {
  key: string;
  courses: string[]; // 课程 ID 列表
  courseType: string; // 课程类型名称 (来自 SimpleCourse.typeName)
  coach: string;      // 教练名称 (来自 SimpleCourse.coaches[0].name)
  status: 'normal' | 'expired' | 'graduated' | 'STUDYING'; // 课程组状态 (需要确认是否需要，还是使用学生主状态)
  enrollDate: string;
  expireDate: string;
  scheduleTimes: ScheduleTime[];
}

// 学员查询参数
export interface StudentSearchParams {
  searchText: string;
  selectedStatus?: string;
  selectedCourse?: string;
  enrollMonth: Dayjs | null;
  sortOrder?: 'enrollDateAsc' | 'enrollDateDesc' | 'ageAsc' | 'ageDesc' | 'remainingClassesAsc' | 'remainingClassesDesc' | 'lastClassDateAsc' | 'lastClassDateDesc';
}