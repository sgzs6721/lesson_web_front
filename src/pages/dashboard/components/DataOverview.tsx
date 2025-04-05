import React from 'react';
import { PeriodType } from '../types/dashboard';

interface DataOverviewProps {
  activePeriod: PeriodType;
  onTogglePeriod: (period: PeriodType) => void;
}

const DataOverview: React.FC<DataOverviewProps> = ({
  activePeriod,
  onTogglePeriod
}) => {
  // 基于activePeriod渲染不同的数据
  const getData = () => {
    // 根据时间段返回不同的数据
    if (activePeriod === 'week') {
      return {
        totalRevenue: '¥128,645',
        revenueChange: '+5.2%',
        totalProfit: '¥62,290',
        profitChange: '+4.1%',
        totalStudents: '102',
        studentsChange: '+8%',
        coaches: {
          total: '8',
          partTime: '3',
          fullTime: '5'
        },
        lessons: {
          completed: '18',
          total: '35',
          amount: '¥12,800'
        },
        weeklyPayingStudents: {
          total: '7',
          new: '3',
          renew: '4'
        },
        weeklyPaymentAmount: {
          total: '¥28,760',
          new: '¥15,200',
          renew: '¥13,560'
        },
        attendanceRate: {
          value: '94.2%',
          change: '+1.7%'
        }
      };
    } else {
      return {
        totalRevenue: '¥358,645',
        revenueChange: '+8.5%',
        totalProfit: '¥176,290',
        profitChange: '+6.2%',
        totalStudents: '147',
        studentsChange: '+12%',
        coaches: {
          total: '8',
          partTime: '3',
          fullTime: '5'
        },
        lessons: {
          completed: '45',
          total: '89',
          amount: '¥32,400'
        },
        weeklyPayingStudents: {
          total: '24',
          new: '9',
          renew: '15'
        },
        weeklyPaymentAmount: {
          total: '¥88,760',
          new: '¥45,200',
          renew: '¥43,560'
        },
        attendanceRate: {
          value: '92.5%',
          change: '+0.8%'
        }
      };
    }
  };

  const data = getData();

  return (
    <div className="dashboard-card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <div className="card-title" style={{ fontSize: '18px' }}>数据总览</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="period-tabs" style={{ marginRight: '10px' }}>
            <button 
              className={`period-tab ${activePeriod === 'week' ? 'active' : ''}`}
              onClick={() => onTogglePeriod('week')}
            >本周</button>
            <button 
              className={`period-tab ${activePeriod === 'month' ? 'active' : ''}`}
              onClick={() => onTogglePeriod('month')}
            >本月</button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="stats-grid">
          {/* 总流水 */}
          <div className="stat-box">
            <div className="stat-box-title">总流水</div>
            <div className="stat-box-value">{data.totalRevenue}</div>
            <div className="stat-box-subtitle">
              较上{activePeriod === 'week' ? '周' : '月'} <span className="stat-highlight">{data.revenueChange}</span>
            </div>
          </div>
          
          {/* 总利润 */}
          <div className="stat-box">
            <div className="stat-box-title">总利润</div>
            <div className="stat-box-value">{data.totalProfit}</div>
            <div className="stat-box-subtitle">
              较上{activePeriod === 'week' ? '周' : '月'} <span className="stat-highlight">{data.profitChange}</span>
            </div>
          </div>
          
          {/* 总学员数 */}
          <div className="stat-box">
            <div className="stat-box-title">总学员数</div>
            <div className="stat-box-value">{data.totalStudents}</div>
            <div className="stat-box-subtitle">
              较上{activePeriod === 'week' ? '周' : '月'} <span className="stat-highlight">{data.studentsChange}</span>
            </div>
          </div>
          
          {/* 教练数量 */}
          <div className="stat-box">
            <div className="stat-box-title">教练数量</div>
            <div className="stat-box-value">{data.coaches.total}</div>
            <div className="stat-box-subtitle">
              兼职 <span className="stat-highlight-alt">{data.coaches.partTime}</span> | 全职 <span className="stat-highlight-primary">{data.coaches.fullTime}</span>
            </div>
          </div>
          
          {/* 课时 */}
          <div className="stat-box">
            <div className="stat-box-title">{activePeriod === 'week' ? '本周' : '本月'}课时</div>
            <div className="stat-box-value">{data.lessons.completed}/{data.lessons.total}</div>
            <div className="stat-box-subtitle">
              销课金额 <span className="stat-highlight">{data.lessons.amount}</span>
            </div>
          </div>
          
          {/* 缴费学员 */}
          <div className="stat-box">
            <div className="stat-box-title">{activePeriod === 'week' ? '本周' : '本月'}缴费学员</div>
            <div className="stat-box-value">{data.weeklyPayingStudents.total}</div>
            <div className="stat-box-subtitle">
              新学员 <span className="stat-highlight-alt">{data.weeklyPayingStudents.new}</span> | 续费 <span className="stat-highlight-primary">{data.weeklyPayingStudents.renew}</span>
            </div>
          </div>
          
          {/* 缴费金额 */}
          <div className="stat-box">
            <div className="stat-box-title">{activePeriod === 'week' ? '本周' : '本月'}缴费金额</div>
            <div className="stat-box-value">{data.weeklyPaymentAmount.total}</div>
            <div className="stat-box-subtitle">
              新学员 <span className="stat-highlight">{data.weeklyPaymentAmount.new}</span> | 续费 <span className="stat-highlight-alt">{data.weeklyPaymentAmount.renew}</span>
            </div>
          </div>
          
          {/* 出勤率 */}
          <div className="stat-box">
            <div className="stat-box-title">{activePeriod === 'week' ? '本周' : '本月'}出勤率</div>
            <div className="stat-box-value">{data.attendanceRate.value}</div>
            <div className="stat-box-subtitle">
              较上{activePeriod === 'week' ? '周' : '月'} <span className="stat-highlight">{data.attendanceRate.change}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataOverview; 