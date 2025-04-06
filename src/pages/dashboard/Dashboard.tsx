import React, { useState, useEffect } from 'react';
import TodayStats from './components/TodayStats';
import AttendanceRecordTable from './components/AttendanceRecordTable';
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
    attendanceRecords,
    getStatCards,
    getStatsBarItems,
    togglePeriodView,
    toggleDataOverviewPeriod,
    calculateTotals,
    handleBatchPunch,
    toggleAttendanceSelection,
    toggleSelectAll
  } = useDashboardData();

  // 跟踪批量打卡后的记录更新
  const [records, setRecords] = useState(attendanceRecords);

  // 当attendanceRecords变化时更新本地状态
  useEffect(() => {
    setRecords(attendanceRecords);
  }, [attendanceRecords]);

  // 处理单条记录选择状态变更
  const handleRecordSelection = (id: string, isChecked: boolean) => {
    // 先更新全局状态
    toggleAttendanceSelection(id, isChecked);
    
    // 再更新本地状态
    setRecords(prev => prev.map(record => 
      record.id === id ? { ...record, isChecked } : record
    ));
  };

  // 处理全选状态变更
  const handleSelectAll = (isChecked: boolean) => {
    // 先更新全局状态
    toggleSelectAll(isChecked);
    
    // 再更新本地状态
    setRecords(prev => prev.map(record => 
      !record.isDisabled ? { ...record, isChecked } : record
    ));
  };

  // 执行批量打卡并处理结果
  const handleBatchPunchWithUI = () => {
    // 检查是否有选中的未打卡学员
    const hasSelectedUncheckedStudents = records.some(
      record => record.isChecked && !record.isDisabled && record.status === '未打卡'
    );

    if (!hasSelectedUncheckedStudents) {
      alert('请先选择要打卡的学员');
      return;
    }
    
    // 执行打卡操作
    const punchedCount = handleBatchPunch();
    
    if (punchedCount > 0) {
      alert(`批量打卡成功！共为 ${punchedCount} 名学员完成打卡。`);
      // 更新本地记录以反映打卡变化
      setRecords([...attendanceRecords]);
    }
  };

  // 计算教练统计总数
  const totals = calculateTotals(coachStatsView);

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
      />

      {/* 今日上课学员 */}
      <AttendanceRecordTable 
        records={records} 
        onSelectAll={handleSelectAll}
        onSelectRecord={handleRecordSelection}
        onBatchPunch={handleBatchPunchWithUI}
      />

      {/* 教练员课时统计 */}
      <CoachStatistics 
        coachStats={coachStats}
        coachStatsView={coachStatsView}
        totals={totals}
        onToggleView={togglePeriodView}
      />
      
      {/* 数据总览 */}
      <DataOverview 
        activePeriod={activePeriod}
        onTogglePeriod={toggleDataOverviewPeriod}
      />
    </>
  );
};

export default Dashboard; 