export interface StatCard {
  id: string;
  title: string;
  value: number;
  subtitle: string;
  period: 'day' | 'week' | 'month';
  growthPercent?: number;
  growthPositive?: boolean;
  icon: string;
}

export interface CoachStats {
  id: string;
  name: string;
  completedLessons: number;
  completedAmount: number;
  pendingLessons: number;
  pendingAmount: number;
  hourlyRate: number;
  estimatedSalary: number;
  type: '全职' | '兼职';
  colorClass: string;
}

export interface PaymentRecord {
  id: string;
  studentName: string;
  amount: number;
  lessons: number;
  date: string;
  type: string;
  coach: string;
}

export interface StatsItem {
  number: number;
  unit: string;
  label: string;
}

export interface ClassCardInfo {
  id: string;
  coachName: string;
  title: string;
  borderColor: string;
  backgroundColor: string;
  lessonCount: number;
  coachSalary: number;
  salesAmount: number;
  students: {
    name: string;
    time: string;
    status: '已完成' | '请假' | '未打卡' | 'empty';
    // 可选课时进度，用于展示 12/30
    remainingHours?: number;
    totalHours?: number;
  }[];
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  time: string;
  coach: string;
  remainingLessons: string;
  courseType: string;
  salesAmount: string;
  remainingAmount: string;
  status: '已打卡' | '未打卡' | '已请假';
  isChecked?: boolean;
  isDisabled?: boolean;
}

export type PeriodType = 'day' | 'week' | 'month';
export type CoachStatsViewType = 'week' | 'month'; 