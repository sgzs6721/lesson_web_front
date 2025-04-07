import { Dayjs } from 'dayjs';

// 定义课表接口
export interface ClassSchedule {
  date: string;
  weekday: string;
  startTime: string;
  endTime: string;
  courseName: string;
  coach: string;
  status: 'completed' | 'upcoming' | 'canceled';
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

// 学员接口
export interface Student {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  phone: string;
  courseType: string;
  course: string | string[];
  coach: string;
  lastClassDate: string;
  enrollDate: string;
  expireDate: string;
  remainingClasses: string; // 剩余课时
  status: 'active' | 'inactive' | 'pending';
  scheduleTimes?: ScheduleTime[]; // 排课时间
  payments?: PaymentRecord[]; // 缴费记录
  courseGroups?: CourseGroup[]; // 课程组信息
}

// 课程组接口
export interface CourseGroup {
  key: string;
  courses: string[];
  courseType: string;
  coach: string;
  status: 'active' | 'inactive' | 'pending';
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