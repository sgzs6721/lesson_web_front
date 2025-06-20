import React, { useState, useEffect } from 'react';
import { Typography, Card, Radio, DatePicker, Row, Col, Button, Space } from 'antd';
import {
  CampusComparisonChart,
  CampusGrowthChart,
  CoachPerformanceChart,
  OrganizationStats
} from './components';
import { useCampusData } from './hooks';
import {
  BarChartOutlined,
  LineChartOutlined,
  TeamOutlined,
  ExportOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './compare.css';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import './CampusAnalysis.css';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const CampusAnalysis: React.FC = () => {
  // 使用数据管理钩子
  const {
    campusData,
    comparisonMetric,
    trendMetric,
    coachMetric,
    dateRange,
    setCampus,
    setComparisonMetric,
    setTrendMetric,
    setCoachMetric,
    filterDataByDate
  } = useCampusData();

  // 处理日期变化
  const handleDateChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      filterDataByDate(dates[0], dates[1]);
    }
  };

  // 初始化时设置日期范围
  useEffect(() => {
    // 设置默认的日期范围（当月）
    const startDate = dayjs().startOf('month');
    const endDate = dayjs();
    filterDataByDate(startDate, endDate);
  }, []);

  // 刷新数据
  const handleRefresh = () => {
    // 重新获取数据的逻辑
    console.log('刷新校区数据');
  };

  // 导出数据
  const handleExport = () => {
    console.log('导出校区数据');
  };

  return (
    <div className="campus-analysis">
      <Card className="campus-analysis-card">
        <div className="campus-analysis-header">
          <Title level={4} className="campus-analysis-title">校区分析</Title>
          <div className="campus-analysis-actions">
            <Space>
              <RangePicker
                value={dateRange}
                onChange={handleDateChange}
                placeholder={['开始日期', '结束日期']}
                locale={locale}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
              <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </div>
        </div>

        {/* 校区数据概览 */}
        <div className="campus-overview-section">
          <div className="section-header">
            <div className="section-title">
              <BarChartOutlined className="section-icon" />
              校区数据概览
            </div>
          </div>
          <div className="overview-content">
            <OrganizationStats campusData={campusData} />
          </div>
        </div>

        {/* 分析图表区域 */}
        <div className="campus-charts-layout">
          <div className="campus-charts-row">
            <div className="chart-container-card">
              <div className="chart-header">
                <div className="chart-title">
                  <BarChartOutlined className="chart-icon" />
                  校区对比分析
                </div>
                <div className="chart-controls">
                  <Radio.Group
                    value={comparisonMetric}
                    onChange={(e) => setComparisonMetric(e.target.value)}
                    size="small"
                  >
                    <Radio.Button value="revenue">收入</Radio.Button>
                    <Radio.Button value="profit">利润</Radio.Button>
                    <Radio.Button value="students">学员数</Radio.Button>
                    <Radio.Button value="coaches">教练数</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <div className="chart-content">
                <CampusComparisonChart
                  data={campusData}
                  metric={comparisonMetric}
                />
              </div>
            </div>

            <div className="chart-container-card">
              <div className="chart-header">
                <div className="chart-title">
                  <LineChartOutlined className="chart-icon" />
                  校区发展趋势
                </div>
                <div className="chart-controls">
                  <Radio.Group
                    value={trendMetric}
                    onChange={(e) => setTrendMetric(e.target.value)}
                    size="small"
                  >
                    <Radio.Button value="revenue">收入</Radio.Button>
                    <Radio.Button value="profit">利润</Radio.Button>
                    <Radio.Button value="students">学员数</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <div className="chart-content">
                <CampusGrowthChart
                  data={campusData}
                  metric={trendMetric}
                />
              </div>
            </div>
          </div>

          <div className="campus-charts-row">
            <div className="chart-container-card full-width">
              <div className="chart-header">
                <div className="chart-title">
                  <TeamOutlined className="chart-icon" />
                  教练绩效分析
                </div>
                <div className="chart-controls">
                  <Radio.Group
                    value={coachMetric}
                    onChange={(e) => setCoachMetric(e.target.value)}
                    size="small"
                  >
                    <Radio.Button value="lessons">课时数</Radio.Button>
                    <Radio.Button value="students">学员数</Radio.Button>
                    <Radio.Button value="revenue">收入</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <div className="chart-content">
                <CoachPerformanceChart
                  data={campusData}
                  metric={coachMetric}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CampusAnalysis;