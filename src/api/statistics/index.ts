import { request } from '../config';

// 统计分析请求参数类型
export interface StatisticsRequestParams {
  timeType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  campusId?: number;
  startDate?: string;
  endDate?: string;
}

// 课程分析请求参数类型
export interface CourseAnalysisRequestParams extends StatisticsRequestParams {
  rankingType?: 'REVENUE' | 'ENROLLMENT' | 'RATING';
  limit?: number;
}

// 学员分析统计接口
export const studentAnalysisApi = {
  // 获取学员指标统计
  getStudentMetrics: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/student/metrics', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取学员增长趋势
  getStudentGrowthTrend: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/student/growth-trend', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取学员续费金额趋势
  getStudentRenewalTrend: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/student/renewal-trend', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取学员来源分布
  getStudentSourceDistribution: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/student/source-distribution', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取新增学员来源分布
  getNewStudentSource: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/student/new-student-source', {
      method: 'POST',
      body: JSON.stringify(params)
    })
};

// 课程分析统计接口
export const courseAnalysisApi = {
  // 获取课程指标统计
  getCourseMetrics: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/course/metrics', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取课程类型分析
  getCourseTypeAnalysis: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/course/type-analysis', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取课程销售趋势
  getCourseSalesTrend: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/course/sales-trend', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取课程销售业绩
  getCourseSalesPerformance: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/course/sales-performance', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取课程销售排行
  getCourseSalesRanking: (params: CourseAnalysisRequestParams) =>
    request('/lesson/api/statistics/course/sales-ranking', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取课程收入分析
  getCourseRevenueAnalysis: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/course/revenue-analysis', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取课程收入分布
  getCourseRevenueDistribution: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/course/revenue-distribution', {
      method: 'POST',
      body: JSON.stringify(params)
    })
};

// 教练分析统计接口
export const coachAnalysisApi = {
  // 获取教练指标统计
  getCoachMetrics: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/coach/metrics', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取教练课时趋势
  getCoachClassHourTrend: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/coach/class-hour-trend', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取教练Top5对比
  getCoachTop5Comparison: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/coach/top5-comparison', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取教练类型分布
  getCoachTypeDistribution: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/coach/type-distribution', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取教练薪资分析
  getCoachSalaryAnalysis: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/coach/salary-analysis', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取教练绩效排行
  getCoachPerformanceRanking: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/coach/performance-ranking', {
      method: 'POST',
      body: JSON.stringify(params)
    })
};

// 财务分析统计接口
export const financeAnalysisApi = {
  // 获取财务指标统计
  getFinanceMetrics: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/finance/metrics', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取收入成本趋势
  getRevenueCostTrend: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/finance/revenue-cost-trend', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取成本结构分析
  getCostStructure: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/finance/cost-structure', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取财务趋势
  getFinanceTrend: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/finance/finance-trend', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取收入分析
  getRevenueAnalysis: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/finance/revenue-analysis', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取成本分析
  getCostAnalysis: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/finance/cost-analysis', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  // 获取利润分析
  getProfitAnalysis: (params: StatisticsRequestParams) =>
    request('/lesson/api/statistics/finance/profit-analysis', {
      method: 'POST',
      body: JSON.stringify(params)
    })
};

// 其他统计接口
export const statisticsApi = {
  // 获取学员管理页面统计数据
  getStudentManagementSummary: () =>
    request('/lesson/api/statistics/student-management/summary', {
      method: 'GET'
    }),

  // 刷新统计数据
  refreshStats: () =>
    request('/lesson/api/statistics/refresh-stats', {
      method: 'POST'
    })
}; 