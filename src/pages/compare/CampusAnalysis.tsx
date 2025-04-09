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
    <div className="campus-analysis-container">
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Row gutter={24} align="middle">
              <Col>
                <Title level={3} style={{ margin: 0 }}>校区对比分析</Title>
              </Col>
              <Col style={{ marginLeft: 16 }}>
                <RangePicker 
                  locale={locale}
                  value={dateRange}
                  onChange={handleDateChange}
                  allowClear={false}
                  style={{ width: 270 }}
                  placeholder={['开始日期', '结束日期']}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* 机构总数据展示 */}
      <OrganizationStats campusData={campusData} />
      
      {/* 校区核心指标对比 */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>校区核心指标对比</span>
            <Radio.Group value={comparisonMetric} onChange={e => setComparisonMetric(e.target.value)}>
              <Radio.Button value="revenue" style={radioButtonStyle}>收入</Radio.Button>
              <Radio.Button value="profit" style={radioButtonStyle}>利润</Radio.Button>
              <Radio.Button value="students" style={radioButtonStyle}>学员数</Radio.Button>
              <Radio.Button value="coaches" style={radioButtonStyle}>教练数</Radio.Button>
            </Radio.Group>
          </div>
        } 
        className="chart-card"
      >
        <div className="chart-container">
          <CampusComparisonChart 
            data={campusData} 
            metric={comparisonMetric} 
          />
        </div>
      </Card>
      
      {/* 增长趋势对比 */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>校区增长趋势对比</span>
            <Radio.Group value={trendMetric} onChange={e => setTrendMetric(e.target.value)}>
              <Radio.Button value="students" style={radioButtonStyle}>学员数</Radio.Button>
              <Radio.Button value="revenue" style={radioButtonStyle}>收入</Radio.Button>
              <Radio.Button value="profit" style={radioButtonStyle}>利润</Radio.Button>
            </Radio.Group>
          </div>
        } 
        className="chart-card"
      >
        <div className="chart-container">
          <CampusGrowthChart 
            data={campusData} 
            metric={trendMetric} 
          />
        </div>
      </Card>
      
      {/* 教练绩效对比 */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>各校区教练绩效对比</span>
            <Radio.Group value={coachMetric} onChange={e => setCoachMetric(e.target.value)}>
              <Radio.Button value="lessons" style={radioButtonStyle}>平均课时量</Radio.Button>
              <Radio.Button value="students" style={radioButtonStyle}>平均学员数</Radio.Button>
              <Radio.Button value="salary" style={radioButtonStyle}>平均工资</Radio.Button>
            </Radio.Group>
          </div>
        } 
        className="chart-card"
      >
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