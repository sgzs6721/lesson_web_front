import React from 'react';
import { Statistic, Row, Col, Card } from 'antd';
import { AllCampusData } from '../types/campus';

interface OrganizationStatsProps {
  campusData: AllCampusData;
}

const OrganizationStats: React.FC<OrganizationStatsProps> = ({ campusData }) => {
  // 计算校区数量
  const campusCount = Object.keys(campusData).length;
  
  // 计算总学员数
  const totalStudents = Object.values(campusData).reduce((sum, campus) => sum + campus.students, 0);
  
  // 计算总教练数
  const totalCoaches = Object.values(campusData).reduce((sum, campus) => sum + campus.coaches, 0);
  
  // 计算总收入
  const totalRevenue = Object.values(campusData).reduce((sum, campus) => sum + campus.revenue, 0);
  
  // 假设支出 = 收入 - 利润
  const totalExpense = Object.values(campusData).reduce((sum, campus) => sum + (campus.revenue - campus.profit), 0);
  
  // 计算总利润
  const totalProfit = Object.values(campusData).reduce((sum, campus) => sum + campus.profit, 0);
  
  // 自定义样式
  const centerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 10px'
  };
  
  return (
    <div className="organization-stats" style={{ marginBottom: '24px' }}>
      <Card>
        <Row gutter={[24, 16]} justify="space-around" align="middle">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={centerStyle as React.CSSProperties}>
              <Statistic
                title="校区总数量"
                value={campusCount}
                valueStyle={{ color: '#fa8c16', fontSize: '18px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={centerStyle as React.CSSProperties}>
              <Statistic
                title="机构总学员数"
                value={totalStudents}
                valueStyle={{ color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={centerStyle as React.CSSProperties}>
              <Statistic
                title="机构总教练数"
                value={totalCoaches}
                valueStyle={{ color: '#722ed1', fontSize: '18px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={centerStyle as React.CSSProperties}>
              <Statistic
                title="机构总收入(万元)"
                value={totalRevenue.toFixed(2)}
                precision={2}
                valueStyle={{ color: '#3f8600', fontSize: '18px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={centerStyle as React.CSSProperties}>
              <Statistic
                title="机构总支出(万元)"
                value={totalExpense.toFixed(2)}
                precision={2}
                valueStyle={{ color: '#cf1322', fontSize: '18px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div style={centerStyle as React.CSSProperties}>
              <Statistic
                title="机构总利润(万元)"
                value={totalProfit.toFixed(2)}
                precision={2}
                valueStyle={{ color: '#3f8600', fontSize: '18px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OrganizationStats; 