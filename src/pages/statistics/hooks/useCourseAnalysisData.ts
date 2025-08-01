import { useState, useEffect } from 'react';
import { courseAnalysisApi, StatisticsRequestParams } from '@/api/statistics';
import { CourseAnalysisData } from '@/api/statistics/types';

export const useCourseAnalysisData = () => {
  const [courseData, setCourseData] = useState<CourseAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');

  // 获取课程分析详细数据
  const fetchCourseDetailData = async (currentTimeframe?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    const targetTimeframe = currentTimeframe || timeframe;
    setLoading(true);
    
    try {
      const params: StatisticsRequestParams = {
        timeType: targetTimeframe,
        campusId: 1
      };

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
    } catch (error) {
      console.error('获取课程详细分析数据失败:', error);
      setCourseData(null);
    } finally {
      setLoading(false);
    }
  };

  // 时间段变更处理
  const handleTimeframeChange = (newTimeframe: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    setTimeframe(newTimeframe);
    fetchCourseDetailData(newTimeframe);
  };

  // 初始化数据获取
  useEffect(() => {
    fetchCourseDetailData();
  }, []);

  return {
    courseData,
    loading,
    timeframe,
    handleTimeframeChange,
    refetch: () => fetchCourseDetailData()
  };
};


