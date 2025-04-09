import { Dayjs } from 'dayjs';

// 单个校区的数据类型
export interface CampusData {
  id: string;
  name: string;
  revenue: number;
  profit: number;
  students: number;
  coaches: number;
  // 月度增长数据
  growthData: {
    students: number[];
    revenue: number[];
    profit: number[];
  };
  // 教练绩效数据
  coachPerformance: {
    lessons: number;
    students: number;
    salary: number;
  };
}

// 全部校区数据
export interface AllCampusData {
  headquarters: CampusData;
  east: CampusData;
  west: CampusData;
  south: CampusData;
  north: CampusData;
  [key: string]: CampusData;
}

// 过滤和筛选参数
export interface CampusFilterParams {
  timeframe: 'month' | 'quarter' | 'year';
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

// 图表指标类型
export type ComparisonMetric = 'revenue' | 'profit' | 'students' | 'coaches';
export type TrendMetric = 'students' | 'revenue' | 'profit';
export type CoachMetric = 'lessons' | 'students' | 'salary'; 