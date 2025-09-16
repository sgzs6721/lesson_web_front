import React, { useState, useEffect } from 'react';
import TodayStats from './components/TodayStats';
import CoachStatistics from './components/CoachStatistics';
import DataOverview from './components/DataOverview';
import { useDashboardData } from './hooks/useDashboardData';
import '@/assets/styles/index.css';
import './dashboard.css';

const Dashboard: React.FC = () => {
  const {
    loading,
    activePeriod,
    coachStats,
    coachStatsView,
    classCards,
    getStatCards,
    getStatsBarItems,
    togglePeriodView,
    toggleDataOverviewPeriod,
    calculateTotals,
    fetchTodayData,
    separateOverviewData,
    fetchOverviewData
  } = useDashboardData();

  // 计算教练统计总数
  const totals = calculateTotals(coachStatsView);

  // 调试信息
  console.log('Dashboard - separateOverviewData:', separateOverviewData);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <span>加载中...</span>
      </div>
    );
  }

  return (
    <>
      {/* 今日数据 */}
      <TodayStats 
        statsBarItems={getStatsBarItems()} 
        classCards={classCards}
        onRefresh={() => fetchTodayData(true)}
        loading={loading}
      />

      {/* 数据总览 */}
      <DataOverview 
        activePeriod={activePeriod}
        onTogglePeriod={toggleDataOverviewPeriod}
        overviewData={separateOverviewData}
        loading={loading}
        onRefresh={fetchOverviewData}
      />

      {/* 教练员课时统计 */}
      <CoachStatistics 
        coachStats={coachStats}
        coachStatsView={coachStatsView}
        totals={totals}
        onToggleView={togglePeriodView}
      />
    </>
  );
};

export default Dashboard; 