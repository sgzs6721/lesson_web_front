import React, { useState, useEffect } from 'react';
import { Typography, Card, Radio, DatePicker, Row, Col } from 'antd';
import { 
  CampusComparisonChart, 
  CampusGrowthChart, 
  CoachPerformanceChart, 
  OrganizationStats
} from './components';
import { useCampusData } from './hooks';
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
  
  // 自定义Radio.Button样式，移除字体加粗
  const radioButtonStyle = { fontWeight: 'normal' };
  
  return (
    <div className="campus-management">
      <Card className="campus-management-card">
        <div className="campus-header">
          <h1 className="campus-title">校区分析</h1>
          <div className="campus-actions">
            <DatePicker.RangePicker
              value={dateRange}
              onChange={handleDateChange}
              placeholder={['开始日期', '结束日期']}
            />
          </div>
        </div>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="校区数据概览">
              <OrganizationStats campusData={campusData} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="校区对比分析">
              <CampusComparisonChart 
                data={campusData} 
                metric={comparisonMetric} 
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="校区发展趋势">
              <CampusGrowthChart 
                data={campusData} 
                metric={trendMetric} 
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="教练绩效分析">
              <CoachPerformanceChart 
                data={campusData} 
                metric={coachMetric} 
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CampusAnalysis; 