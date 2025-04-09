import React from 'react';
import { Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { AllCampusData } from '../types/campus';

interface CampusStatisticsProps {
  campusData: AllCampusData;
}

const CampusStatistics: React.FC<CampusStatisticsProps> = ({ campusData }) => {
  // 计算总收入
  const totalRevenue = Object.values(campusData).reduce((sum, campus) => sum + campus.revenue, 0);
  
  // 计算总利润
  const totalProfit = Object.values(campusData).reduce((sum, campus) => sum + campus.profit, 0);
  
  // 计算总学员数
  const totalStudents = Object.values(campusData).reduce((sum, campus) => sum + campus.students, 0);
  
  // 计算总教练数
  const totalCoaches = Object.values(campusData).reduce((sum, campus) => sum + campus.coaches, 0);
  
  return (
    <div className="stats-cards">
      <Card className="stat-card stat-revenue">
        <div className="stat-title">总收入（万元）</div>
        <div className="stat-value" style={{ color: '#3498db' }}>{totalRevenue.toFixed(2)}</div>
        <div className="stat-trend trend-up">
          <ArrowUpOutlined /> 8.5% 较上月
        </div>
      </Card>
      
      <Card className="stat-card stat-profit">
        <div className="stat-title">总利润（万元）</div>
        <div className="stat-value" style={{ color: '#2ecc71' }}>{totalProfit.toFixed(2)}</div>
        <div className="stat-trend trend-up">
          <ArrowUpOutlined /> 7.2% 较上月
        </div>
      </Card>
      
      <Card className="stat-card stat-students">
        <div className="stat-title">总学员数</div>
        <div className="stat-value" style={{ color: '#f39c12' }}>{totalStudents}</div>
        <div className="stat-trend trend-up">
          <ArrowUpOutlined /> 5.4% 较上月
        </div>
      </Card>
      
      <Card className="stat-card stat-coaches">
        <div className="stat-title">总教练数</div>
        <div className="stat-value" style={{ color: '#9b59b6' }}>{totalCoaches}</div>
        <div className="stat-trend trend-down">
          <ArrowDownOutlined /> 2.1% 较上月
        </div>
      </Card>
    </div>
  );
};

export default CampusStatistics; 