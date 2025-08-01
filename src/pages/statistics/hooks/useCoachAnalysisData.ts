import { useState, useEffect } from 'react';
import { coachAnalysisApi, StatisticsRequestParams } from '@/api/statistics';
import { CoachAnalysisData } from '@/api/statistics/types';

export const useCoachAnalysisData = () => {
  const [coachData, setCoachData] = useState<CoachAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');

  // 获取教练分析详细数据
  const fetchCoachDetailData = async (currentTimeframe?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    const targetTimeframe = currentTimeframe || timeframe;
    setLoading(true);
    
    try {
      const params: StatisticsRequestParams = {
        timeType: targetTimeframe,
        campusId: 1
      };

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
    } catch (error) {
      console.error('获取教练详细分析数据失败:', error);
      setCoachData(null);
    } finally {
      setLoading(false);
    }
  };

  // 时间段变更处理
  const handleTimeframeChange = (newTimeframe: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    setTimeframe(newTimeframe);
    fetchCoachDetailData(newTimeframe);
  };

  // 初始化数据获取
  useEffect(() => {
    fetchCoachDetailData();
  }, []);

  return {
    coachData,
    loading,
    timeframe,
    handleTimeframeChange,
    refetch: () => fetchCoachDetailData()
  };
}; 