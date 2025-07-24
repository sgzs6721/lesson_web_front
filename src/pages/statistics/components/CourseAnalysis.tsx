import React, { useState } from 'react';
import { Spin, Row, Col, Card, Select, DatePicker, Space, Button } from 'antd';
import { 
  BookOutlined, 
  TrophyOutlined, 
  StarOutlined, 
  DollarOutlined,
  RiseOutlined,
  UserOutlined
} from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import CoursePerformanceChart from './CoursePerformanceChart';
import CourseEngagementChart from './CourseEngagementChart';
import CourseComparisonChart from './CourseComparisonChart';
import CourseRatingChart from './CourseRatingChart';
import { useCourseAnalysisData } from '../hooks/useCourseAnalysisData';
import './CourseAnalysis.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface CourseAnalysisProps {
  data?: any;
  loading: boolean;
}

export interface CourseAnalysisData {
  totalCourses: number;           // 课程总数
  soldCourses: number;            // 已销课程数
  newCourses: number;             // 新报课程数
  consumedLessons: number;        // 已消耗课时
  remainingLessons: number;       // 剩余课时
  averagePrice: number;           // 课程平均单价
  totalSalesAmount: number;       // 总销售额
  courseGrowth: number;           // 课程总数增长率
  soldGrowth: number;             // 销课增长率
  newGrowth: number;              // 新报课程增长率
  consumedGrowth: number;         // 消耗课时增长率
  salesGrowth: number;            // 销售额增长率
  priceGrowth: number;            // 单价增长率
}

export interface CourseMetrics {
  courseId: string;
  courseName: string;
  courseType: string;
  enrollmentCount: number;
  completionRate: number;
  averageRating: number;
  revenue: number;
  engagementScore: number;
  lastUpdated: string;
}

export interface CourseSalesData {
  months: string[];
  soldCourses: number[];          // 每月销课数量
  consumedLessons: number[];      // 每月消耗课时
  salesAmount: number[];          // 每月销售额
  newCourses: number[];           // 每月新报课程数
}

export interface CourseComparisonData {
  courseId: string;
  courseName: string;
  courseType: string;             // 课程类型
  totalSold: number;              // 总销售数量
  consumedLessons: number;        // 已消耗课时
  remainingLessons: number;       // 剩余课时
  unitPrice: number;              // 单价
  totalRevenue: number;           // 总收入
}

const CourseAnalysis: React.FC<CourseAnalysisProps> = ({ data, loading }) => {
  const [timeframe, setTimeframe] = useState<string>('month');
  const [chartType, setChartType] = useState<'totalLessons' | 'newLessons' | 'renewalLessons' | 'salesAmount'>('totalLessons');

  const {
    courseData,
    salesData,
    comparisonData,
    loading: hookLoading
  } = useCourseAnalysisData(timeframe);

  const isLoading = loading || hookLoading;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Mock data for demonstration
  const courseAnalysisData: CourseAnalysisData = {
    totalCourses: 156,              // 课程总数
    soldCourses: 1284,              // 已销课程数
    newCourses: 68,                 // 新报课程数
    consumedLessons: 3420,          // 已消耗课时
    remainingLessons: 8760,         // 剩余课时
    averagePrice: 180,              // 课程平均单价(元/课时)
    totalSalesAmount: 2456800,      // 总销售额(元)
    courseGrowth: 8.3,              // 课程总数增长率
    soldGrowth: 12.5,               // 销课增长率
    newGrowth: 15.3,                // 新报课程增长率
    consumedGrowth: 9.7,            // 消耗课时增长率
    salesGrowth: 11.8,              // 销售额增长率
    priceGrowth: 2.1,               // 单价增长率
    ...(courseData || {}),
  };

  // KPI Cards configuration
  const courseKPIs = [
    {
      title: '课程总数',
      value: courseAnalysisData.totalCourses,
      unit: '门',
      icon: <BookOutlined />,
      trend: courseAnalysisData.courseGrowth,
      color: '#1890ff'
    },
    {
      title: '新报课程数',
      value: courseAnalysisData.newCourses,
      unit: '门',
      icon: <RiseOutlined />,
      trend: courseAnalysisData.newGrowth,
      color: '#faad14'
    },
    {
      title: '续费课程数',
      value: 892, // 续费课程数
      unit: '门',
      icon: <TrophyOutlined />,
      trend: 8.5,
      color: '#52c41a'
    },
    {
      title: '已销课程数',
      value: courseAnalysisData.soldCourses,
      unit: '门',
      icon: <UserOutlined />,
      trend: courseAnalysisData.soldGrowth,
      color: '#f5222d'
    },
    {
      title: '剩余课程数',
      value: courseAnalysisData.remainingLessons,
      unit: '门',
      icon: <StarOutlined />,
      trend: 0, // 剩余课程数不显示增长率
      color: '#722ed1'
    },
    {
      title: '课程单价',
      value: courseAnalysisData.averagePrice,
      unit: '元/课时',
      icon: <DollarOutlined />,
      trend: courseAnalysisData.priceGrowth,
      color: '#13c2c2'
    }
  ];

  return (
    <div className="course-analysis-container">
      {/* Filter Controls */}
      <Card className="filter-controls-card" size="small">
        <Space wrap size="middle">
          <Select
            value={timeframe}
            onChange={setTimeframe}
            style={{ width: 120 }}
            size="middle"
            dropdownStyle={{ minWidth: 120 }}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          >
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
            <Option value="quarter">本季度</Option>
            <Option value="year">本年</Option>
          </Select>

          <RangePicker
            style={{ width: 260 }}
            size="middle"
            placeholder={['开始日期', '结束日期']}
          />

          <Button type="primary" size="middle">应用筛选</Button>
          <Button size="middle">重置</Button>
        </Space>
      </Card>

      {/* KPI Cards */}
      <Card className="kpi-cards-section" title="课程关键指标" size="small">
        <Row gutter={[16, 16]}>
          {courseKPIs.map((kpi, index) => (
            <Col xs={24} sm={12} md={8} lg={4} key={index}>
              <StatisticCard {...kpi} />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Course Type Analysis */}
      <Card className="course-type-analysis" title="课程类型分析" size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div className="course-type-item">
              <div className="course-type-header">
                <span className="course-type-name">一对一</span>
                <span className="course-type-count">456课时</span>
              </div>
              <div className="course-type-stats">
                <div className="stat-item">
                  <span className="stat-label">报名总课时:</span>
                  <span className="stat-value">1,280课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">已销课时:</span>
                  <span className="stat-value">960课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">剩余课时:</span>
                  <span className="stat-value">320课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">销售额:</span>
                  <span className="stat-value">¥1,234,567</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">平均课单价:</span>
                  <span className="stat-value">¥280/课时</span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="course-type-item">
              <div className="course-type-header">
                <span className="course-type-name">一对二</span>
                <span className="course-type-count">324课时</span>
              </div>
              <div className="course-type-stats">
                <div className="stat-item">
                  <span className="stat-label">报名总课时:</span>
                  <span className="stat-value">980课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">已销课时:</span>
                  <span className="stat-value">720课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">剩余课时:</span>
                  <span className="stat-value">260课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">销售额:</span>
                  <span className="stat-value">¥856,432</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">平均课单价:</span>
                  <span className="stat-value">¥180/课时</span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="course-type-item">
              <div className="course-type-header">
                <span className="course-type-name">小班课</span>
                <span className="course-type-count">298课时</span>
              </div>
              <div className="course-type-stats">
                <div className="stat-item">
                  <span className="stat-label">报名总课时:</span>
                  <span className="stat-value">760课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">已销课时:</span>
                  <span className="stat-value">580课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">剩余课时:</span>
                  <span className="stat-value">180课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">销售额:</span>
                  <span className="stat-value">¥456,789</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">平均课单价:</span>
                  <span className="stat-value">¥120/课时</span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="course-type-item">
              <div className="course-type-header">
                <span className="course-type-name">大班课</span>
                <span className="course-type-count">206课时</span>
              </div>
              <div className="course-type-stats">
                <div className="stat-item">
                  <span className="stat-label">报名总课时:</span>
                  <span className="stat-value">400课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">已销课时:</span>
                  <span className="stat-value">320课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">剩余课时:</span>
                  <span className="stat-value">80课时</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">销售额:</span>
                  <span className="stat-value">¥234,567</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">平均课单价:</span>
                  <span className="stat-value">¥80/课时</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        {/* Course Sales Trends */}
        <Col xs={24} lg={12}>
          <Card
            title="课程销售趋势"
            size="small"
            extra={
              <Select
                value={chartType}
                onChange={setChartType}
                style={{ width: 120, minWidth: 120 }}
                size="small"
                dropdownStyle={{ minWidth: 140 }}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              >
                <Option value="totalLessons">总课时</Option>
                <Option value="newLessons">新报课时</Option>
                <Option value="renewalLessons">续费课时</Option>
                <Option value="salesAmount">销售额</Option>
              </Select>
            }
          >
            <CourseEngagementChart
              data={salesData}
              chartType={chartType}
              loading={isLoading}
            />
          </Card>
        </Col>

        {/* Course Sales Performance */}
        <Col xs={24} lg={12}>
          <Card title="课程销售表现" size="small">
            <CoursePerformanceChart
              data={comparisonData}
              loading={isLoading}
            />
          </Card>
        </Col>

        {/* Course Sales Rankings */}
        <Col xs={24} lg={12}>
          <Card title="课程销售排行" size="small">
            <CourseComparisonChart
              data={comparisonData}
              loading={isLoading}
            />
          </Card>
        </Col>

        {/* Course Revenue Analysis */}
        <Col xs={24} lg={12}>
          <Card title="课程收入分析" size="small">
            <CourseRatingChart
              data={comparisonData}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CourseAnalysis;
