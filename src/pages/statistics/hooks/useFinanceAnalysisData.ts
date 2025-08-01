import { useState, useEffect } from 'react';
import { financeAnalysisApi, StatisticsRequestParams } from '@/api/statistics';
import { FinanceAnalysisData } from '@/api/statistics/types';

export const useFinanceAnalysisData = () => {
  const [financeData, setFinanceData] = useState<FinanceAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');

  // 获取财务分析详细数据
  const fetchFinanceDetailData = async (currentTimeframe?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    const targetTimeframe = currentTimeframe || timeframe;
    setLoading(true);
    
    try {
      const params: StatisticsRequestParams = {
        timeType: targetTimeframe,
        campusId: 1
      };

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
    } catch (error) {
      console.error('获取财务详细分析数据失败:', error);
      setFinanceData(null);
    } finally {
      setLoading(false);
    }
  };

  // 时间段变更处理
  const handleTimeframeChange = (newTimeframe: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    setTimeframe(newTimeframe);
    fetchFinanceDetailData(newTimeframe);
  };

  // 初始化数据获取
  useEffect(() => {
    fetchFinanceDetailData();
  }, []);

  return {
    financeData,
    loading,
    timeframe,
    handleTimeframeChange,
    refetch: () => fetchFinanceDetailData()
  };
}; 