import { useState, useEffect } from 'react';
import {
  StatisticsFilter,
  OverviewData,
  StudentData,
  CoachData,
  FinanceData,
  CampusData
} from '../types/statistics';
import {
  studentAnalysisApi,
  courseAnalysisApi,
  coachAnalysisApi,
  financeAnalysisApi,
  StatisticsRequestParams
} from '@/api/statistics';
import {
  StudentAnalysisData,
  CourseAnalysisData,
  CoachAnalysisData,
  FinanceAnalysisData
} from '@/api/statistics/types';

export const useStatisticsData = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [studentData, setStudentData] = useState<StudentAnalysisData | null>(null);
  const [courseData, setCourseData] = useState<CourseAnalysisData | null>(null);
  const [coachData, setCoachData] = useState<CoachAnalysisData | null>(null);
  const [financeData, setFinanceData] = useState<FinanceAnalysisData | null>(null);
  const [campusData, setCampusData] = useState<CampusData | null>(null);
  
  // 分别管理每个tab的loading状态 - 初始状态设为true，确保首次加载时显示loading
  const [studentLoading, setStudentLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);
  const [financeLoading, setFinanceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 分别管理各个组件的loading状态 - 初始状态设为true
  const [studentMetricsLoading, setStudentMetricsLoading] = useState(true);
  const [studentTrendLoading, setStudentTrendLoading] = useState(true);
  const [studentRenewalLoading, setStudentRenewalLoading] = useState(true);
  
  const [filters, setFilters] = useState<StatisticsFilter>({
    timeframe: 'WEEKLY',
    startDate: null,
    endDate: null
  });

  // 获取学员指标数据（独立接口）
  const fetchStudentMetrics = async (params: StatisticsRequestParams) => {
    setStudentMetricsLoading(true);
    try {
      const response = await studentAnalysisApi.getStudentMetrics(params);
      
      // 更新学员数据中的指标部分
      setStudentData(prev => prev ? {
        ...prev,
        studentMetrics: response.data
      } : {
        studentMetrics: response.data,
        growthTrend: [],
        renewalAmountTrend: [],
        sourceDistribution: [],
        newStudentSourceDistribution: []
      });
      
      return response.data;
    } catch (error) {
      console.error('获取学员指标数据失败:', error);
      throw error;
    } finally {
      setStudentMetricsLoading(false);
    }
  };

  // 获取学员趋势数据（独立接口，支持不同时间范围）
  const fetchStudentTrend = async (params: StatisticsRequestParams) => {
    setStudentTrendLoading(true);
    try {
      const response = await studentAnalysisApi.getStudentGrowthTrend(params);
      
      // 更新学员数据中的趋势部分
      setStudentData(prev => prev ? {
        ...prev,
        growthTrend: response.data
      } : {
        studentMetrics: {
          totalStudents: 0,
          newStudents: 0,
          lostStudents: 0,
          renewingStudents: 0,
          totalStudentsChangeRate: 0,
          newStudentsChangeRate: 0,
          lostStudentsChangeRate: 0,
          renewingStudentsChangeRate: 0
        },
        growthTrend: response.data,
        renewalAmountTrend: [],
        sourceDistribution: [],
        newStudentSourceDistribution: []
      });
      
      return response.data;
    } catch (error) {
      console.error('获取学员趋势数据失败:', error);
      throw error;
    } finally {
      setStudentTrendLoading(false);
    }
  };

  // 获取学员续费金额趋势（独立接口，支持不同时间范围）
  const fetchStudentRenewalTrend = async (params: StatisticsRequestParams) => {
    setStudentRenewalLoading(true);
    try {
      const response = await studentAnalysisApi.getStudentRenewalTrend(params);
      
      // 更新学员数据中的续费趋势部分
      setStudentData(prev => prev ? {
        ...prev,
        renewalAmountTrend: response.data
      } : {
        studentMetrics: {
          totalStudents: 0,
          newStudents: 0,
          lostStudents: 0,
          renewingStudents: 0,
          totalStudentsChangeRate: 0,
          newStudentsChangeRate: 0,
          lostStudentsChangeRate: 0,
          renewingStudentsChangeRate: 0
        },
        growthTrend: [],
        renewalAmountTrend: response.data,
        sourceDistribution: [],
        newStudentSourceDistribution: []
      });
      
      return response.data;
    } catch (error) {
      console.error('获取学员续费趋势数据失败:', error);
      throw error;
    } finally {
      setStudentRenewalLoading(false);
    }
  };

  // 获取学员分析详细数据（初始加载时使用）
  const fetchStudentDetailData = async (params: StatisticsRequestParams) => {
    setStudentLoading(true);
    setStudentMetricsLoading(true);
    setStudentTrendLoading(true);
    setStudentRenewalLoading(true);
    try {
      // 并行调用所有学员分析子接口
      const [
        metricsResponse,
        growthTrendResponse,
        renewalTrendResponse,
        sourceDistributionResponse,
        newStudentSourceResponse
      ] = await Promise.all([
        studentAnalysisApi.getStudentMetrics(params),
        studentAnalysisApi.getStudentGrowthTrend(params),
        studentAnalysisApi.getStudentRenewalTrend(params),
        studentAnalysisApi.getStudentSourceDistribution(params),
        studentAnalysisApi.getNewStudentSource(params)
      ]);

      // 组合所有数据
      const combinedStudentData: StudentAnalysisData = {
        studentMetrics: metricsResponse.data,
        growthTrend: growthTrendResponse.data,
        renewalAmountTrend: renewalTrendResponse.data,
        sourceDistribution: sourceDistributionResponse.data,
        newStudentSourceDistribution: newStudentSourceResponse.data
      };

      setStudentData(combinedStudentData);
      return combinedStudentData;
    } catch (error) {
      console.error('获取学员详细分析数据失败:', error);
      setStudentData(null);
      throw error;
    } finally {
      setStudentLoading(false);
      setStudentMetricsLoading(false);
      setStudentTrendLoading(false);
      setStudentRenewalLoading(false);
    }
  };

  // 获取课程分析详细数据
  const fetchCourseDetailData = async (params: StatisticsRequestParams) => {
    setCourseLoading(true);
    try {
      // 并行调用所有课程分析子接口
      const [
        metricsResponse,
        typeAnalysisResponse,
        salesTrendResponse,
        salesPerformanceResponse,
        salesRankingResponse,
        revenueAnalysisResponse,
        revenueDistributionResponse
      ] = await Promise.all([
        courseAnalysisApi.getCourseMetrics(params),
        courseAnalysisApi.getCourseTypeAnalysis(params),
        courseAnalysisApi.getCourseSalesTrend(params),
        courseAnalysisApi.getCourseSalesPerformance(params),
        courseAnalysisApi.getCourseSalesRanking(params),
        courseAnalysisApi.getCourseRevenueAnalysis(params),
        courseAnalysisApi.getCourseRevenueDistribution(params)
      ]);

      // 组合所有数据
      const combinedCourseData: CourseAnalysisData = {
        courseMetrics: metricsResponse.data,
        courseTypeAnalysis: typeAnalysisResponse.data,
        salesTrend: salesTrendResponse.data,
        salesPerformance: salesPerformanceResponse.data,
        salesRanking: salesRankingResponse.data,
        revenueAnalysis: revenueAnalysisResponse.data,
        revenueDistribution: revenueDistributionResponse.data
      };

      setCourseData(combinedCourseData);
      return combinedCourseData;
    } catch (error) {
      console.error('获取课程详细分析数据失败:', error);
      setCourseData(null);
      throw error;
    } finally {
      setCourseLoading(false);
    }
  };

  // 获取教练分析详细数据
  const fetchCoachDetailData = async (params: StatisticsRequestParams) => {
    setCoachLoading(true);
    try {
      // 并行调用所有教练分析子接口
      const [
        metricsResponse,
        classHourTrendResponse,
        top5ComparisonResponse,
        typeDistributionResponse,
        salaryAnalysisResponse,
        performanceRankingResponse
      ] = await Promise.all([
        coachAnalysisApi.getCoachMetrics(params),
        coachAnalysisApi.getCoachClassHourTrend(params),
        coachAnalysisApi.getCoachTop5Comparison(params),
        coachAnalysisApi.getCoachTypeDistribution(params),
        coachAnalysisApi.getCoachSalaryAnalysis(params),
        coachAnalysisApi.getCoachPerformanceRanking(params)
      ]);

      // 组合所有数据
      const combinedCoachData: CoachAnalysisData = {
        coachMetrics: metricsResponse.data,
        classHourTrend: classHourTrendResponse.data,
        coachTop5Comparison: top5ComparisonResponse.data,
        coachTypeDistribution: typeDistributionResponse.data,
        salaryAnalysis: salaryAnalysisResponse.data,
        performanceRanking: performanceRankingResponse.data
      };

      setCoachData(combinedCoachData);
      return combinedCoachData;
    } catch (error) {
      console.error('获取教练详细分析数据失败:', error);
      setCoachData(null);
      throw error;
    } finally {
      setCoachLoading(false);
    }
  };

  // 获取财务分析详细数据
  const fetchFinanceDetailData = async (params: StatisticsRequestParams) => {
    setFinanceLoading(true);
    try {
      // 并行调用所有财务分析子接口
      const [
        metricsResponse,
        revenueCostTrendResponse,
        costStructureResponse,
        financeTrendResponse,
        revenueAnalysisResponse,
        costAnalysisResponse,
        profitAnalysisResponse
      ] = await Promise.all([
        financeAnalysisApi.getFinanceMetrics(params),
        financeAnalysisApi.getRevenueCostTrend(params),
        financeAnalysisApi.getCostStructure(params),
        financeAnalysisApi.getFinanceTrend(params),
        financeAnalysisApi.getRevenueAnalysis(params),
        financeAnalysisApi.getCostAnalysis(params),
        financeAnalysisApi.getProfitAnalysis(params)
      ]);

      // 组合所有数据
      const combinedFinanceData: FinanceAnalysisData = {
        financeMetrics: metricsResponse.data,
        revenueCostTrend: revenueCostTrendResponse.data,
        costStructure: costStructureResponse.data,
        financeTrend: financeTrendResponse.data,
        revenueAnalysis: revenueAnalysisResponse.data,
        costAnalysis: costAnalysisResponse.data,
        profitAnalysis: profitAnalysisResponse.data
      };

      setFinanceData(combinedFinanceData);
      return combinedFinanceData;
    } catch (error) {
      console.error('获取财务详细分析数据失败:', error);
      setFinanceData(null);
      throw error;
    } finally {
      setFinanceLoading(false);
    }
  };

  // 按需获取数据的方法
  const fetchDataByTab = async (tab: 'student' | 'course' | 'coach' | 'finance') => {
    const params: StatisticsRequestParams = {
      timeType: filters.timeframe as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
      campusId: 1 // 默认校区ID，可以从用户配置中获取
    };

    switch (tab) {
      case 'student':
        return await fetchStudentDetailData(params);
      case 'course':
        return await fetchCourseDetailData(params);
      case 'coach':
        return await fetchCoachDetailData(params);
      case 'finance':
        return await fetchFinanceDetailData(params);
      default:
        throw new Error(`Unknown tab: ${tab}`);
    }
  };

  // 应用筛选 - 只对当前激活的tab重新获取数据
  const applyFilters = (newFilters: Partial<StatisticsFilter>, activeTab?: string) => {
    // 更新筛选条件
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // 如果指定了activeTab，只重新获取该tab的数据
    if (activeTab) {
      const params: StatisticsRequestParams = {
        timeType: (newFilters.timeframe || filters.timeframe) as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
        campusId: 1
      };
      
      // 对于学员分析，只更新指标数据
      if (activeTab === 'student') {
        setStudentMetricsLoading(true);
        fetchStudentMetrics(params);
      } else {
        fetchDataByTab(activeTab as 'student' | 'course' | 'coach' | 'finance');
      }
    }
  };

  // 学员分析图表时间范围切换（独立接口调用）
  const updateStudentTrendTimeframe = (timeframe: 'MONTHLY' | 'YEARLY') => {
    const params: StatisticsRequestParams = {
      timeType: timeframe,
      campusId: 1
    };
    fetchStudentTrend(params);
  };

  // 学员续费金额图表时间范围切换（独立接口调用）
  const updateStudentRenewalTimeframe = (timeframe: 'MONTHLY' | 'YEARLY') => {
    const params: StatisticsRequestParams = {
      timeType: timeframe,
      campusId: 1
    };
    fetchStudentRenewalTrend(params);
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      timeframe: 'WEEKLY',
      startDate: null,
      endDate: null
    });
  };

  // 导出数据
  const exportData = (section: string) => {
    console.log(`导出${section}数据`);
    // 这里应该是导出数据的逻辑
    alert(`已开始导出${section}数据，请稍候...`);
  };

  // 获取对应tab的loading状态
  const getLoadingState = (tab: string) => {
    switch (tab) {
      case 'student':
        return studentLoading;
      case 'course':
        return courseLoading;
      case 'coach':
        return coachLoading;
      case 'finance':
        return financeLoading;
      default:
        return false;
    }
  };

  // 获取学员分析各部分的loading状态
  const getStudentLoadingStates = () => ({
    metrics: studentMetricsLoading,
    trend: studentTrendLoading,
    renewal: studentRenewalLoading
  });

  return {
    data,
    studentData,
    courseData,
    coachData,
    financeData,
    campusData,
    loading,
    studentLoading,
    courseLoading,
    coachLoading,
    financeLoading,
    filters,
    applyFilters,
    resetFilters,
    fetchDataByTab,
    getLoadingState,
    getStudentLoadingStates,
    updateStudentTrendTimeframe,
    updateStudentRenewalTimeframe,
    fetchStudentMetrics,
    fetchStudentTrend,
    fetchStudentRenewalTrend,
    refetch: () => {} // 不再需要全量刷新
  };
};