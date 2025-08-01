// 学员分析相关类型
export interface StudentMetrics {
  totalStudents: number;
  newStudents: number;
  renewingStudents: number;
  lostStudents: number;
  totalStudentsChangeRate: number;
  newStudentsChangeRate: number;
  renewingStudentsChangeRate: number;
  lostStudentsChangeRate: number;
}

export interface StudentGrowthTrendItem {
  timePoint: string;
  totalStudents: number;
  newStudents: number;
  renewingStudents: number;
  lostStudents: number;
  retentionRate: number;
}

export interface StudentRenewalTrendItem {
  timePoint: string;
  renewalAmount: number;
  newStudentPaymentAmount: number;
}

export interface StudentSourceDistributionItem {
  sourceName: string;
  studentCount: number;
  percentage: number;
}

export interface StudentAnalysisData {
  studentMetrics: StudentMetrics;
  growthTrend: StudentGrowthTrendItem[];
  renewalAmountTrend: StudentRenewalTrendItem[];
  sourceDistribution: StudentSourceDistributionItem[];
  newStudentSourceDistribution: StudentSourceDistributionItem[];
}

// 课程分析相关类型
export interface CourseMetrics {
  totalCourses: number;
  newCoursesEnrolled: number;
  renewedCourses: number;
  soldCourses: number;
  remainingCourses: number;
  courseUnitPrice: number;
  totalCoursesChangeRate: number;
  newCoursesEnrolledChangeRate: number;
  renewedCoursesChangeRate: number;
  soldCoursesChangeRate: number;
  remainingCoursesChangeRate: number;
  courseUnitPriceChangeRate: number;
}

export interface CourseTypeAnalysisItem {
  courseType: string;
  courseCount: number;
  percentage: number;
  averagePrice: number;
  totalRevenue: number;
}

export interface CourseSalesTrendItem {
  timePoint: string;
  salesCount: number;
  salesAmount: number;
  enrollmentCount: number;
}

export interface CourseSalesPerformanceItem {
  timePoint: string;
  newEnrollments: number;
  renewals: number;
  completions: number;
  cancellations: number;
}

export interface CourseSalesRankingItem {
  courseId: string;
  courseName: string;
  salesCount: number;
  salesAmount: number;
  enrollmentCount: number;
  averageRating: number;
}

export interface CourseRevenueAnalysis {
  totalRevenue: number;
  averageRevenue: number;
  revenueGrowthRate: number;
  topRevenueSource: string;
}

export interface CourseRevenueDistributionItem {
  courseType: string;
  revenue: number;
  percentage: number;
}

export interface CourseAnalysisData {
  courseMetrics: CourseMetrics;
  courseTypeAnalysis: CourseTypeAnalysisItem[];
  salesTrend: CourseSalesTrendItem[];
  salesPerformance: CourseSalesPerformanceItem[];
  salesRanking: CourseSalesRankingItem[];
  revenueAnalysis: CourseRevenueAnalysis;
  revenueDistribution: CourseRevenueDistributionItem[];
}

// 教练分析相关类型
export interface CoachMetrics {
  totalCoaches: number;
  monthlyAverageClassHours: number;
  monthlyAverageSalary: number;
  studentRetentionContributionRate: number;
  totalCoachesChangeRate: number;
  monthlyAverageClassHoursChangeRate: number;
  monthlyAverageSalaryChangeRate: number;
  studentRetentionContributionRateChangeRate: number;
}

export interface CoachClassHourTrendItem {
  timePoint: string;
  totalClassHours: number;
  averageClassHours: number;
  activeCoaches: number;
}

export interface CoachTop5ComparisonItem {
  coachId: string;
  coachName: string;
  classHours: number;
  studentCount: number;
  retentionRate: number;
  averageRating: number;
}

export interface CoachTypeDistributionItem {
  coachType: string;
  coachCount: number;
  percentage: number;
  averageSalary: number;
}

export interface CoachSalaryAnalysis {
  totalSalaryCost: number;
  averageSalary: number;
  salaryGrowthRate: number;
  salaryDistribution: Array<{
    salaryRange: string;
    coachCount: number;
    percentage: number;
  }>;
}

export interface CoachPerformanceRankingItem {
  coachId: string;
  coachName: string;
  performanceScore: number;
  classHours: number;
  studentCount: number;
  retentionRate: number;
  studentSatisfaction: number;
}

export interface CoachAnalysisData {
  coachMetrics: CoachMetrics;
  classHourTrend: CoachClassHourTrendItem[];
  coachTop5Comparison: CoachTop5ComparisonItem[];
  coachTypeDistribution: CoachTypeDistributionItem[];
  salaryAnalysis: CoachSalaryAnalysis;
  performanceRanking: CoachPerformanceRankingItem[];
}

// 财务分析相关类型
export interface FinanceMetrics {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  revenueChangeRate: number;
  costChangeRate: number;
  profitChangeRate: number;
  marginChangeRate: number;
}

export interface RevenueCostTrendItem {
  timePoint: string;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
}

export interface CostStructureItem {
  costType: string;
  amount: number;
  percentage: number;
}

export interface FinanceTrendItem {
  timePoint: string;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
}

export interface RevenueAnalysis {
  totalRevenue: number;
  revenueGrowthRate: number;
  revenueBySource: Array<{
    source: string;
    amount: number;
    percentage: number;
  }>;
}

export interface CostAnalysis {
  totalCost: number;
  costGrowthRate: number;
  costByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface ProfitAnalysis {
  totalProfit: number;
  profitGrowthRate: number;
  profitMargin: number;
  profitMarginTrend: Array<{
    timePoint: string;
    profitMargin: number;
  }>;
}

export interface FinanceAnalysisData {
  financeMetrics: FinanceMetrics;
  revenueCostTrend: RevenueCostTrendItem[];
  costStructure: CostStructureItem[];
  financeTrend: FinanceTrendItem[];
  revenueAnalysis: RevenueAnalysis;
  costAnalysis: CostAnalysis;
  profitAnalysis: ProfitAnalysis;
}

// 其他统计类型
export interface StudentManagementSummary {
  totalStudents: number;
  totalCourses: number;
}

// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
} 