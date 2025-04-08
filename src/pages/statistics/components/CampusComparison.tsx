import React, { useState } from 'react';
import { Button, Spin, Table } from 'antd';
import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons';

interface CampusComparisonProps {
  data: any;
  loading: boolean;
}

const CampusComparison: React.FC<CampusComparisonProps> = ({ data, loading }) => {
  const [comparisonMetric, setComparisonMetric] = useState<string>('revenue');
  const [growthMetric, setGrowthMetric] = useState<string>('students');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  // 示例校区对比数据
  const campusComparisonData = [
    {
      key: '1',
      campus: '总部校区',
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
      key: '2',
      campus: '东城校区',
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
      key: '3',
      campus: '西城校区',
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
      key: '4',
      campus: '南城校区',
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
      key: '5',
      campus: '北城校区',
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

  // 校区对比表格列定义
  const campusComparisonColumns = [
    {
      title: '校区名称',
      dataIndex: 'campus',
      key: 'campus',
    },
    {
      title: '总学员数',
      dataIndex: 'totalStudents',
      key: 'totalStudents',
      sorter: (a: any, b: any) => a.totalStudents - b.totalStudents,
    },
    {
      title: '新增学员',
      dataIndex: 'newStudents',
      key: 'newStudents',
      sorter: (a: any, b: any) => a.newStudents - b.newStudents,
    },
    {
      title: '学员留存率',
      dataIndex: 'retentionRate',
      key: 'retentionRate',
    },
    {
      title: '总教练数',
      dataIndex: 'totalCoaches',
      key: 'totalCoaches',
      sorter: (a: any, b: any) => a.totalCoaches - b.totalCoaches,
    },
    {
      title: '课消总数',
      dataIndex: 'totalLessons',
      key: 'totalLessons',
      sorter: (a: any, b: any) => a.totalLessons - b.totalLessons,
    },
    {
      title: '总收入(元)',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (text: number) => text.toLocaleString(),
      sorter: (a: any, b: any) => a.totalRevenue - b.totalRevenue,
    },
    {
      title: '总利润(元)',
      dataIndex: 'totalProfit',
      key: 'totalProfit',
      render: (text: number) => text.toLocaleString(),
      sorter: (a: any, b: any) => a.totalProfit - b.totalProfit,
    },
    {
      title: '利润率',
      dataIndex: 'profitRate',
      key: 'profitRate',
    }
  ];

  // 处理校区对比指标变更
  const handleComparisonMetricChange = (value: string) => {
    setComparisonMetric(value);
  };

  // 处理校区增长指标变更
  const handleGrowthMetricChange = (value: string) => {
    setGrowthMetric(value);
  };

  return (
    <div>
      {/* 校区对比分析 */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">校区经营数据对比</div>
          <div className="chart-actions">
            <div className="btn-group">
              <Button 
                type={comparisonMetric === 'revenue' ? 'primary' : 'default'} 
                size="small"
                onClick={() => handleComparisonMetricChange('revenue')}
              >
                收入
              </Button>
              <Button 
                type={comparisonMetric === 'profit' ? 'primary' : 'default'} 
                size="small"
                onClick={() => handleComparisonMetricChange('profit')}
              >
                利润
              </Button>
              <Button 
                type={comparisonMetric === 'students' ? 'primary' : 'default'} 
                size="small"
                onClick={() => handleComparisonMetricChange('students')}
              >
                学员数
              </Button>
              <Button 
                type={comparisonMetric === 'coaches' ? 'primary' : 'default'} 
                size="small"
                onClick={() => handleComparisonMetricChange('coaches')}
              >
                教练数
              </Button>
              <Button 
                type={comparisonMetric === 'attendance' ? 'primary' : 'default'} 
                size="small"
                onClick={() => handleComparisonMetricChange('attendance')}
              >
                出勤率
              </Button>
              <Button 
                type={comparisonMetric === 'satisfaction' ? 'primary' : 'default'} 
                size="small"
                onClick={() => handleComparisonMetricChange('satisfaction')}
              >
                满意度
              </Button>
            </div>
          </div>
        </div>
        <div className="chart-wrapper">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#999',
            flexDirection: 'column'
          }}>
            <BarChartOutlined style={{ fontSize: 40, marginBottom: 16 }} />
            <div>此处将显示校区对比图表</div>
            <div>当前指标: {comparisonMetric === 'revenue' ? '收入' : 
                         comparisonMetric === 'profit' ? '利润' : 
                         comparisonMetric === 'students' ? '学员数' : 
                         comparisonMetric === 'coaches' ? '教练数' : 
                         comparisonMetric === 'attendance' ? '出勤率' : '满意度'}</div>
          </div>
        </div>
      </div>

      {/* 校区对比表格 */}
      <div className="stats-section">
        <div className="section-header">
          <div className="section-title">校区经营对比详情</div>
        </div>
        <Table 
          dataSource={campusComparisonData} 
          columns={campusComparisonColumns} 
          pagination={false}
          size="small"
          className="data-table"
        />
      </div>

      {/* 校区增长趋势对比 */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">校区增长趋势对比</div>
          <div className="chart-actions">
            <div className="btn-group">
              <Button 
                type={growthMetric === 'students' ? 'primary' : 'default'} 
                size="small"
                onClick={() => handleGrowthMetricChange('students')}
              >
                学员数
              </Button>
              <Button 
                type={growthMetric === 'revenue' ? 'primary' : 'default'} 
                size="small"
                onClick={() => handleGrowthMetricChange('revenue')}
              >
                收入
              </Button>
              <Button 
                type={growthMetric === 'profit' ? 'primary' : 'default'} 
                size="small"
                onClick={() => handleGrowthMetricChange('profit')}
              >
                利润
              </Button>
            </div>
          </div>
        </div>
        <div className="chart-wrapper">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#999',
            flexDirection: 'column'
          }}>
            <LineChartOutlined style={{ fontSize: 40, marginBottom: 16 }} />
            <div>此处将显示校区增长趋势对比图表</div>
            <div>当前指标: {growthMetric === 'students' ? '学员数' : 
                         growthMetric === 'revenue' ? '收入' : '利润'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusComparison; 