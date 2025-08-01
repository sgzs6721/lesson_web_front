import { useState, useEffect } from 'react';
import { studentAnalysisApi, StatisticsRequestParams } from '@/api/statistics';
import { StudentAnalysisData } from '@/api/statistics/types';

export const useStudentAnalysisData = () => {
  const [studentData, setStudentData] = useState<StudentAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');

  // 获取学员分析详细数据
  const fetchStudentDetailData = async (currentTimeframe?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    const targetTimeframe = currentTimeframe || timeframe;
    setLoading(true);
    
    try {
      const params: StatisticsRequestParams = {
        timeType: targetTimeframe,
        campusId: 1 // 默认校区ID，可以从用户配置中获取
      };

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
    } catch (error) {
      console.error('获取学员详细分析数据失败:', error);
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  // 时间段变更处理
  const handleTimeframeChange = (newTimeframe: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    setTimeframe(newTimeframe);
    fetchStudentDetailData(newTimeframe);
  };

  // 初始化数据获取
  useEffect(() => {
    fetchStudentDetailData();
  }, []);

  return {
    studentData,
    loading,
    timeframe,
    handleTimeframeChange,
    refetch: () => fetchStudentDetailData()
  };
}; 