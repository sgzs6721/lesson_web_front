import React, { useState } from 'react';
import { Card, Row, Col, Spin, Button, Space, Select } from 'antd';
import { BookOutlined, RiseOutlined, FallOutlined, DollarOutlined } from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import CourseEngagementChart from './CourseEngagementChart';
import CoursePerformanceChart from './CoursePerformanceChart';
import CourseComparisonChart from './CourseComparisonChart';
import CourseRatingChart from './CourseRatingChart';
import { CourseAnalysisData } from '@/api/statistics/types';
import './CourseAnalysis.css';

const { Option } = Select;

interface CourseAnalysisProps {
  data: CourseAnalysisData | null;
  loading: boolean;
}

const CourseAnalysis: React.FC<CourseAnalysisProps> = ({ data, loading }) => {
  const [chartType, setChartType] = useState<'soldCourses' | 'consumedLessons' | 'salesAmount' | 'newCourses'>('soldCourses');

  // 移除整页loading，改为局部loading

  // 使用真实API数据或默认值
  const courseAnalysisData = data ? {
    totalCourses: data.courseMetrics.totalCourses,
    soldCourses: data.courseMetrics.soldCourses,
    newCourses: data.courseMetrics.newCoursesEnrolled,
    consumedLessons: 0, // API中没有这个字段，可能需要计算
    remainingLessons: data.courseMetrics.remainingCourses,
    averagePrice: data.courseMetrics.courseUnitPrice,
    totalSalesAmount: 0, // 可能需要从revenue分析中获取
    courseGrowth: data.courseMetrics.totalCoursesChangeRate,
    soldGrowth: data.courseMetrics.soldCoursesChangeRate,
    newGrowth: data.courseMetrics.newCoursesEnrolledChangeRate,
    consumedGrowth: 0, // API中没有这个字段
    salesGrowth: 0, // 可能需要从revenue分析中获取
    priceGrowth: data.courseMetrics.courseUnitPriceChangeRate,
  } : {
    totalCourses: 0,
    soldCourses: 0,
    newCourses: 0,
    consumedLessons: 0,
    remainingLessons: 0,
    averagePrice: 0,
    totalSalesAmount: 0,
    courseGrowth: 0,
    soldGrowth: 0,
    newGrowth: 0,
    consumedGrowth: 0,
    salesGrowth: 0,
    priceGrowth: 0,
  };

  // KPI Cards configuration
  const courseKPIs = [
    {
      title: '课程总数',
      value: courseAnalysisData.totalCourses,
      unit: '门',
      icon: <BookOutlined />,
      growth: courseAnalysisData.courseGrowth,
      color: '#1890ff',
      loading: loading
    },
    {
      title: '新报课程数',
      value: courseAnalysisData.newCourses,
      unit: '门',
      icon: <RiseOutlined />,
      growth: courseAnalysisData.newGrowth,
      color: '#faad14',
      loading: loading
    },
    {
      title: '续费课程数',
      value: courseAnalysisData.soldCourses,
      unit: '门',
      icon: <BookOutlined />,
      growth: courseAnalysisData.soldGrowth,
      color: '#52c41a',
      loading: loading
    },
    {
      title: '已销课程数',
      value: courseAnalysisData.soldCourses,
      unit: '门',
      icon: <FallOutlined />,
      growth: courseAnalysisData.soldGrowth,
      color: '#f5222d',
      loading: loading
    },
    {
      title: '剩余课程数',
      value: courseAnalysisData.remainingLessons,
      unit: '课时',
      icon: <BookOutlined />,
      growth: 0,
      color: '#722ed1',
      loading: loading
    },
    {
      title: '课程单价',
      value: courseAnalysisData.averagePrice,
      unit: '元/课时',
      icon: <DollarOutlined />,
      growth: courseAnalysisData.priceGrowth,
      color: '#13c2c2',
      loading: loading
    }
  ];

  return (
    <div className="course-analysis">
      {/* Course KPI Cards */}
      <Card
        title="课程关键指标"
        size="small"
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          {courseKPIs.map((kpi, index) => (
            <Col xs={24} sm={12} md={8} lg={4} key={index}>
              <StatisticCard {...kpi} />
            </Col>
          ))}
        </Row>
      </Card>

      {/* 课程类型分析 */}
      <Card
        title="课程类型分析"
        size="small"
        style={{ marginBottom: '24px' }}
      >
        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            {data?.courseTypeAnalysis && data.courseTypeAnalysis.length > 0 ? (
              data.courseTypeAnalysis.map((item, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <div className="course-type-item">
                    <div className="course-type-header">
                      <div className="course-type-name">{item.courseType}</div>
                      <div className="course-type-count">{typeof item.courseCount === 'number' ? item.courseCount : '--'}门</div>
                    </div>
                    <div className="course-type-stats">
                      <div className="stat-item">
                        <span className="stat-label">占比</span>
                        <span className="stat-value">{typeof item.percentage === 'number' ? ((item.percentage * 100).toFixed(1) + '%') : '--'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">平均单价</span>
                        <span className="stat-value">¥{typeof item.averagePrice === 'number' && !isNaN(item.averagePrice) ? item.averagePrice.toFixed(0) : '--'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">总收入</span>
                        <span className="stat-value">¥{typeof item.totalRevenue === 'number' && !isNaN(item.totalRevenue) ? item.totalRevenue.toLocaleString() : '--'}</span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#999' }}>
                  暂无课程类型数据
                </div>
              </Col>
            )}
          </Row>
        </Spin>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Course Engagement Chart */}
        <Col xs={24} lg={12}>
          <Card
            title="课程参与度分析"
            size="small"
            extra={
              <Select
                value={chartType}
                onChange={setChartType}
                size="small"
                style={{ width: 120 }}
              >
                <Option value="soldCourses">已销课程</Option>
                <Option value="newCourses">新报课程</Option>
                <Option value="consumedLessons">消耗课时</Option>
                <Option value="salesAmount">销售额</Option>
              </Select>
            }
          >
            <Spin spinning={loading}>
              <CourseEngagementChart
                data={data?.salesTrend || []}
                chartType={chartType}
                loading={false}
              />
            </Spin>
          </Card>
        </Col>

        {/* Course Sales Performance */}
        <Col xs={24} lg={12}>
          <Card title="课程销售表现" size="small">
            <Spin spinning={loading}>
              <CoursePerformanceChart
                data={data?.salesPerformance || []}
                loading={false}
              />
            </Spin>
          </Card>
        </Col>

        {/* Course Sales Rankings */}
        <Col xs={24} lg={12}>
          <Card title="课程销售排行" size="small">
            <Spin spinning={loading}>
              <CourseComparisonChart
                data={data?.salesRanking || []}
                loading={false}
              />
            </Spin>
          </Card>
        </Col>

        {/* Course Revenue Analysis */}
        <Col xs={24} lg={12}>
          <Card title="课程收入分析" size="small">
            <Spin spinning={loading}>
              <CourseRatingChart
                data={data?.revenueDistribution || []}
                loading={false}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CourseAnalysis;
