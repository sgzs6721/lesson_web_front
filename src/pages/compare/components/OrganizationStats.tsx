import React from 'react';
import { Row, Col } from 'antd';
import {
  BankOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  FallOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { AllCampusData } from '../types/campus';
import StatisticCard from '../../statistics/components/StatisticCard';
import './OrganizationStats.css';

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

  // 模拟增长率数据
  const campusGrowth = 8.5;
  const studentGrowth = 12.3;
  const coachGrowth = 6.7;
  const revenueGrowth = 15.2;
  const expenseGrowth = -3.8;
  const profitGrowth = 18.9;

  return (
    <div className="organization-stats">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatisticCard
            icon={<BankOutlined />}
            title="校区总数量"
            value={campusCount}
            growth={campusGrowth}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatisticCard
            icon={<UserOutlined />}
            title="机构总学员数"
            value={totalStudents}
            growth={studentGrowth}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatisticCard
            icon={<TeamOutlined />}
            title="机构总教练数"
            value={totalCoaches}
            growth={coachGrowth}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatisticCard
            icon={<RiseOutlined />}
            title="机构总收入"
            value={totalRevenue.toFixed(1)}
            growth={revenueGrowth}
            color="#52c41a"
            prefix="¥"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatisticCard
            icon={<FallOutlined />}
            title="机构总支出"
            value={totalExpense.toFixed(1)}
            growth={expenseGrowth}
            color="#f5222d"
            prefix="¥"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatisticCard
            icon={<DollarOutlined />}
            title="机构总利润"
            value={totalProfit.toFixed(1)}
            growth={profitGrowth}
            color="#52c41a"
            prefix="¥"
          />
        </Col>
      </Row>
    </div>
  );
};

export default OrganizationStats;