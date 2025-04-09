import React, { useState } from 'react';
import { Typography, Card, Button, Radio, DatePicker } from 'antd';
import { 
  CampusComparisonChart, 
  CampusGrowthChart, 
  CoachPerformanceChart, 
  CampusStatistics, 
  CampusFilterBar 
} from './components';
import { useCampusData, useCampusFilter } from './hooks';
import './compare.css';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const CampusAnalysis: React.FC = () => {
  // 使用数据管理钩子
  const {
    campusData,
    comparisonMetric,
    trendMetric,
    coachMetric,
    setCampus,
    setComparisonMetric,
    setTrendMetric,
    setCoachMetric,
    exportData,
    printReport
  } = useCampusData();
  
  // 使用过滤器钩子
  const {
    timeframe,
    dateRange,
    setTimeframe,
    setDateRange,
    applyFilters,
    resetFilters
  } = useCampusFilter();
  
  return (
    <div className="campus-analysis-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>校区对比分析</Title>
        <div>
          <Button onClick={exportData} type="primary" style={{ marginRight: 8 }}>
            导出数据
          </Button>
          <Button onClick={printReport}>
            打印报表
          </Button>
        </div>
      </div>

      {/* 过滤条件区域 */}
      <CampusFilterBar 
        timeframe={timeframe}
        dateRange={dateRange}
        onTimeframeChange={setTimeframe}
        onDateRangeChange={setDateRange}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
      />
      
      {/* 校区统计概览 */}
      <CampusStatistics campusData={campusData} />
      
      {/* 校区核心指标对比 */}
      <Card title="校区核心指标对比" className="chart-card">
        <div className="chart-actions">
          <Radio.Group value={comparisonMetric} onChange={e => setComparisonMetric(e.target.value)}>
            <Radio.Button value="revenue">收入</Radio.Button>
            <Radio.Button value="profit">利润</Radio.Button>
            <Radio.Button value="students">学员数</Radio.Button>
            <Radio.Button value="coaches">教练数</Radio.Button>
          </Radio.Group>
        </div>
        <div className="chart-container">
          <CampusComparisonChart 
            data={campusData} 
            metric={comparisonMetric} 
          />
        </div>
      </Card>
      
      {/* 增长趋势对比 */}
      <Card title="校区增长趋势对比" className="chart-card">
        <div className="chart-actions">
          <Radio.Group value={trendMetric} onChange={e => setTrendMetric(e.target.value)}>
            <Radio.Button value="students">学员数</Radio.Button>
            <Radio.Button value="revenue">收入</Radio.Button>
            <Radio.Button value="profit">利润</Radio.Button>
          </Radio.Group>
        </div>
        <div className="chart-container">
          <CampusGrowthChart 
            data={campusData} 
            metric={trendMetric} 
          />
        </div>
      </Card>
      
      {/* 教练绩效对比 */}
      <Card title="各校区教练绩效对比" className="chart-card">
        <div className="chart-actions">
          <Radio.Group value={coachMetric} onChange={e => setCoachMetric(e.target.value)}>
            <Radio.Button value="lessons">平均课时量</Radio.Button>
            <Radio.Button value="students">平均学员数</Radio.Button>
            <Radio.Button value="salary">平均工资</Radio.Button>
          </Radio.Group>
        </div>
        <div className="chart-container">
          <CoachPerformanceChart 
            data={campusData} 
            metric={coachMetric} 
          />
        </div>
      </Card>
    </div>
  );
};

export default CampusAnalysis; 