// 基础筛选条件类型
export interface StatisticsFilter {
  timeframe: string;
  startDate: Date | null;
  endDate: Date | null;
  [key: string]: any;
}

// 总览数据类型
export interface OverviewData {
  totalStudents: number;
  activeStudents: number;
  newStudents: number;
  lostStudents: number;
  totalCoaches: number;
  totalLessons: number;
  totalIncome: number;
  totalProfit: number;
  studentGrowth: number;
  activeGrowth: number;
  newGrowth: number;
  lostGrowth: number;
  coachGrowth: number;
  lessonGrowth: number;
  incomeGrowth: number;
  profitGrowth: number;
}

// 学员数据类型
export interface StudentData {
  totalStudents: number;
  newStudents: number;
  lostStudents: number;
  studentGrowth: number;
  newGrowth: number;
  lostGrowth: number;
}

// 教练数据类型
export interface CoachData {
  totalCoaches: number;
  averageLessons: number;
  retentionRate: number;
  coachGrowth: number;
  lessonGrowth: number;
  retentionGrowth: number;
}

// 财务数据类型
export interface FinanceData {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitRate: number;
  revenueGrowth: number;
  costGrowth: number;
  profitGrowth: number;
  profitRateGrowth: number;
}

// 校区数据类型
export interface CampusData {
  id: string;
  name: string;
  totalStudents: number;
  newStudents: number;
  retentionRate: string;
  totalCoaches: number;
  totalLessons: number;
  totalRevenue: number;
  totalProfit: number;
  profitRate: string;
}

// 课程类型数据
export interface CourseTypeData {
  key: string;
  type: string;
  students: number;
  percentage: string;
  price: number;
  totalIncome: number;
} 