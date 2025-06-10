import React from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { CheckCircleOutlined, TeamOutlined, UserOutlined, StopOutlined } from '@ant-design/icons';
import type { AttendanceStatistics } from '../types';

interface StatisticsCardProps {
  statistics: AttendanceStatistics;
  loading?: boolean;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics, loading = false }) => {
  const cardStyle = {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    textAlign: 'center' as const,
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center' as const,
    border: '1px solid #f0f0f0'
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col flex={1}>
            <Card style={cardStyle} bordered={false}>
              <Statistic
                title={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>打卡学员</span>}
                value={statistics.total}
                valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col flex={1}>
            <Card style={cardStyle} bordered={false}>
              <Statistic
                title={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>总打卡数</span>}
                value={statistics.present}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col flex={1}>
            <Card style={cardStyle} bordered={false}>
              <Statistic
                title={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#722ed1' }}>总请假数</span>}
                value={statistics.leave}
                valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          <Col flex={1}>
            <Card style={cardStyle} bordered={false}>
              <Statistic
                title={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f5222d' }}>总缺勤数</span>}
                value={statistics.absent}
                valueStyle={{ color: '#f5222d', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<StopOutlined style={{ color: '#f5222d' }} />}
              />
            </Card>
          </Col>
          <Col flex={1}>
            <Card style={cardStyle} bordered={false}>
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
      </Spin>
    </div>
  );
};

export default StatisticsCard; 