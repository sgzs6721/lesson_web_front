import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { AttendanceStatistics } from '../types';

interface StatisticsCardProps {
  statistics: AttendanceStatistics;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics }) => {
  const cardStyle = {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    textAlign: 'center' as const,
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center' as const,
  };

  return (
    <div className="mb-8">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>打卡学员</span>}
              value={statistics.total}
              valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>总打卡数</span>}
              value={statistics.present}
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#722ed1' }}>总请假数</span>}
              value={statistics.leave}
              valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>出勤率</span>}
              value={statistics.presentRate}
              suffix="%"
              valueStyle={{ color: '#fa8c16', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCard; 