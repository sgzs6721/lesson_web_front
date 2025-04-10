import { useState, useEffect } from 'react';
import {
  StatisticsFilter,
  OverviewData,
  StudentData,
  CoachData,
  FinanceData,
  CampusData
} from '../types/statistics';

export const useStatisticsData = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [coachData, setCoachData] = useState<CoachData | null>(null);
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [campusData, setCampusData] = useState<CampusData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<StatisticsFilter>({
    timeframe: 'day',
    startDate: null,
    endDate: null
  });

  // 获取统计数据
  const fetchData = async () => {
    setLoading(true);
    try {
      // 这里应该是从API获取数据
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 800));

      // 模拟数据 - 总览数据
      const mockData: OverviewData = {
        totalStudents: 1284,
        activeStudents: 876,
        newStudents: 68,
        lostStudents: 24,
        totalCoaches: 42,
        totalLessons: 3425,
        totalIncome: 876500,
        totalProfit: 412680,
        studentGrowth: 12.5,
        activeGrowth: 8.2,
        newGrowth: 15.3,
        lostGrowth: -5.2,
        coachGrowth: 4.8,
        lessonGrowth: 9.7,
        incomeGrowth: 11.3,
        profitGrowth: 10.5
      };

      // 模拟数据 - 学员数据
      const mockStudentData: StudentData = {
        totalStudents: 1284,
        newStudents: 68,
        lostStudents: 24,
        studentGrowth: 12.5,
        newGrowth: 15.3,
        lostGrowth: -5.2
      };

      // 模拟数据 - 教练数据
      const mockCoachData: CoachData = {
        totalCoaches: 42,
        averageLessons: 82.5,
        retentionRate: 85.2,
        coachGrowth: 4.8,
        lessonGrowth: 5.3,
        retentionGrowth: 3.1
      };

      // 模拟数据 - 财务数据
      const mockFinanceData: FinanceData = {
        totalRevenue: 1007700,
        totalCost: 614780,
        totalProfit: 392920,
        profitRate: 39.0,
        revenueGrowth: 8.4,
        costGrowth: 5.2,
        profitGrowth: 13.7,
        profitRateGrowth: 1.8
      };

      // 更新状态
      setData(mockData);
      setStudentData(mockStudentData);
      setCoachData(mockCoachData);
      setFinanceData(mockFinanceData);
      setCampusData(null); // 校区数据需要单独获取
    } catch (error) {
      console.error('获取统计数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取校区对比数据
  const fetchCampusData = async () => {
    setLoading(true);
    try {
      // 这里应该是从API获取数据
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 800));

      // 校区列表数据
      const campusList: CampusData[] = [
        {
          id: 'headquarters',
          name: '总部校区',
          totalStudents: 425,
          newStudents: 35,
          retentionRate: '92%',
          totalCoaches: 15,
          totalLessons: 1280,
          totalRevenue: 320500,
          totalProfit: 128200,
          profitRate: '40.0%'
        },
        {
          id: 'east',
          name: '东城校区',
          totalStudents: 345,
          newStudents: 22,
          retentionRate: '88%',
          totalCoaches: 12,
          totalLessons: 1035,
          totalRevenue: 276000,
          totalProfit: 110400,
          profitRate: '40.0%'
        },
        {
          id: 'west',
          name: '西城校区',
          totalStudents: 260,
          newStudents: 18,
          retentionRate: '85%',
          totalCoaches: 8,
          totalLessons: 780,
          totalRevenue: 208000,
          totalProfit: 83200,
          profitRate: '40.0%'
        },
        {
          id: 'south',
          name: '南城校区',
          totalStudents: 165,
          newStudents: 10,
          retentionRate: '82%',
          totalCoaches: 5,
          totalLessons: 495,
          totalRevenue: 132000,
          totalProfit: 46200,
          profitRate: '35.0%'
        },
        {
          id: 'north',
          name: '北城校区',
          totalStudents: 89,
          newStudents: 5,
          retentionRate: '80%',
          totalCoaches: 2,
          totalLessons: 267,
          totalRevenue: 71200,
          totalProfit: 24920,
          profitRate: '35.0%'
        }
      ];

      setCampusData(campusList);
    } catch (error) {
      console.error('获取校区对比数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 应用筛选
  const applyFilters = (newFilters: Partial<StatisticsFilter>) => {
    // 更新筛选条件
    setFilters(prev => ({ ...prev, ...newFilters }));

    // 如果只有timeframe变化，只刷新核心指标数据
    if (newFilters.timeframe && Object.keys(newFilters).length === 1) {
      refreshCoreStats();
      // 阻止全局数据刷新
      return;
    }
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      timeframe: 'day',
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

  // 单独刷新核心指标数据
  const refreshCoreStats = () => {
    // 模拟刷新核心指标数据
    console.log('刷新核心指标数据', filters.timeframe);

    // 根据时间范围生成不同的数据
    let multiplier = 1;
    switch(filters.timeframe) {
      case 'day':
        multiplier = 1;
        break;
      case 'week':
        multiplier = 7;
        break;
      case 'month':
        multiplier = 30;
        break;
      case 'year':
        multiplier = 365;
        break;
      default:
        multiplier = 1;
    }

    // 更新核心指标数据
    const updatedData: OverviewData = {
      ...data!,
      totalStudents: 1284,
      activeStudents: Math.floor(876 * (1 + 0.1 * multiplier)),
      newStudents: Math.floor(68 * multiplier),
      lostStudents: Math.floor(24 * (multiplier / 2)),
      totalCoaches: data?.totalCoaches || 42,
      totalLessons: data?.totalLessons || 3425,
      totalIncome: Math.floor(876500 * multiplier),
      totalProfit: Math.floor(412680 * multiplier),
      studentGrowth: data?.studentGrowth || 12.5,
      activeGrowth: data?.activeGrowth || 8.2,
      newGrowth: data?.newGrowth || 15.3,
      lostGrowth: data?.lostGrowth || -5.2,
      coachGrowth: data?.coachGrowth || 4.8,
      lessonGrowth: data?.lessonGrowth || 9.7,
      incomeGrowth: data?.incomeGrowth || 11.3,
      profitGrowth: data?.profitGrowth || 10.5
    };

    // 更新数据
    setData(updatedData);
  };

  // 监听筛选条件变化，重新获取数据
  useEffect(() => {
    // 如果是初始加载或非 timeframe 变化，则刷新所有数据
    fetchData();
  }, [filters.startDate, filters.endDate]);

  // 组件挂载时获取校区对比数据
  useEffect(() => {
    fetchCampusData();
  }, []);

  // 监听 timeframe 变化，刷新核心指标数据
  useEffect(() => {
    // 如果不是初始加载，则刷新核心指标数据
    if (filters.timeframe) {
      refreshCoreStats();
    }
  }, [filters.timeframe]);

  return {
    data,
    studentData,
    coachData,
    financeData,
    campusData,
    loading,
    applyFilters,
    resetFilters,
    exportData
  };
};