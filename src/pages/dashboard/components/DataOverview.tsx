import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { PeriodType } from '../types/dashboard';
import { DashboardOverviewVO } from '@/api/dashboard';

interface DataOverviewProps {
  activePeriod: PeriodType;
  onTogglePeriod: (period: PeriodType) => void;
  overviewData?: DashboardOverviewVO | null;
  loading?: boolean;
  onRefresh?: () => void;
}

const DataOverview: React.FC<DataOverviewProps> = ({
  activePeriod,
  onTogglePeriod,
  overviewData,
  loading = false,
  onRefresh
}) => {
  // 基于API数据渲染
  const getData = () => {
    console.log('DataOverview - overviewData:', overviewData);
    if (!overviewData) {
      // 默认数据
      return {
        totalRevenue: '¥0',
        revenueChange: '+0%',
        totalProfit: '¥0',
        profitChange: '+0%',
        totalStudents: '0',
        studentsChange: '+0%',
        coaches: {
          total: '0',
          partTime: '0',
          fullTime: '0'
        },
        lessons: {
          completed: '0',
          total: '0',
          amount: '¥0'
        },
        weeklyPayingStudents: {
          total: '0',
          new: '0',
          renew: '0'
        },
        weeklyPaymentAmount: {
          total: '¥0',
          new: '¥0',
          renew: '¥0'
        },
        attendanceRate: {
          value: '0%',
          change: '+0%'
        }
      };
    }

    // 使用API数据
    return {
      totalRevenue: `¥${overviewData.totalRevenue.toLocaleString()}`,
      revenueChange: `${overviewData.totalRevenueChangePercent >= 0 ? '+' : ''}${overviewData.totalRevenueChangePercent}%`,
      totalProfit: `¥${overviewData.totalProfit.toLocaleString()}`,
      profitChange: `${overviewData.totalProfitChangePercent >= 0 ? '+' : ''}${overviewData.totalProfitChangePercent}%`,
      totalStudents: overviewData.totalStudents.toString(),
      studentsChange: `${overviewData.totalStudentsChangePercent >= 0 ? '+' : ''}${overviewData.totalStudentsChangePercent}%`,
      coaches: {
        total: overviewData.totalCoaches.toString(),
        partTime: overviewData.partTimeCoaches.toString(),
        fullTime: overviewData.fullTimeCoaches.toString()
      },
      lessons: {
        completed: overviewData.currentWeekClassHoursRatio.split('/')[0],
        total: overviewData.currentWeekClassHoursRatio.split('/')[1],
        amount: `¥${overviewData.currentWeekSalesAmount.toLocaleString()}`
      },
      weeklyPayingStudents: {
        total: overviewData.currentWeekPayingStudents.toString(),
        new: overviewData.currentWeekNewPayingStudents.toString(),
        renew: overviewData.currentWeekRenewalPayingStudents.toString()
      },
      weeklyPaymentAmount: {
        total: `¥${overviewData.currentWeekPaymentAmount.toLocaleString()}`,
        new: `¥${overviewData.currentWeekNewStudentPaymentAmount.toLocaleString()}`,
        renew: `¥${overviewData.currentWeekRenewalPaymentAmount.toLocaleString()}`
      },
      attendanceRate: {
        value: `${overviewData.currentWeekAttendanceRate}%`,
        change: `${overviewData.currentWeekAttendanceRateChangePercent >= 0 ? '+' : ''}${overviewData.currentWeekAttendanceRateChangePercent}%`
      }
    };
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
          {onRefresh && (
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
              style={{ color: '#1890ff' }}
              title="刷新数据总览"
            />
          )}
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