import React from 'react';
import { CoachStats, CoachStatsViewType } from '../types/dashboard';

interface CoachStatisticsProps {
  coachStats: CoachStats[];
  coachStatsView: CoachStatsViewType;
  totals: {
    completed: number;
    completedAmount: number;
    pending: number;
    pendingAmount: number;
    salary: number;
  };
  onToggleView: (view: CoachStatsViewType) => void;
}

const CoachStatistics: React.FC<CoachStatisticsProps> = ({
  coachStats,
  coachStatsView,
  totals,
  onToggleView
}) => {
  return (
    <div className="dashboard-card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <div className="card-title">教练员课时统计</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="period-tabs" style={{ marginRight: '10px' }}>
            <button 
              className={`period-tab ${coachStatsView === 'week' ? 'active' : ''}`}
              onClick={() => onToggleView('week')}
            >本周</button>
            <button 
              className={`period-tab ${coachStatsView === 'month' ? 'active' : ''}`}
              onClick={() => onToggleView('month')}
            >本月</button>
          </div>
        </div>
      </div>
      <div className="card-body" style={{ padding: '0' }}>
        <div style={{ overflow: 'auto' }}>
          <table className="coach-lessons-table">
            <thead>
              <tr>
                <th>教练姓名</th>
                <th>已销课时</th>
                <th>待销课时</th>
                <th>课时费(元/课时)</th>
                <th>类型</th>
                <th>预计工资(元)</th>
              </tr>
            </thead>
            <tbody>
              {coachStats.map((coach) => (
                <tr key={coach.id}>
                  <td>{coach.name}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#28a745' }}>{coach.completedLessons}</span> 
                    <div style={{ color: '#28a745', opacity: 0.8, fontSize: '12px', marginTop: '3px' }}>￥{coach.completedAmount.toLocaleString()}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#e83e8c' }}>{coach.pendingLessons}</span> 
                    <div style={{ color: '#e83e8c', opacity: 0.7, fontSize: '12px', marginTop: '3px' }}>￥{coach.pendingAmount.toLocaleString()}</div>
                  </td>
                  <td>{coach.hourlyRate}</td>
                  <td>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        backgroundColor: coach.type === '全职' ? 'rgba(52, 152, 219, 0.15)' : 'rgba(46, 204, 113, 0.15)',
                        color: coach.type === '全职' ? '#3498db' : '#2ecc71'
                      }}
                    >
                      {coach.type}
                    </span>
                  </td>
                  <td>{coach.estimatedSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>{coachStatsView === 'week' ? '本周合计' : '本月合计'}</td>
                <td>
                  <span style={{ fontWeight: 600, color: '#28a745' }}>{totals.completed}</span>
                  <div style={{ color: '#28a745', opacity: 0.8, fontSize: '12px', marginTop: '3px' }}>￥{totals.completedAmount.toLocaleString()}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: '#e83e8c' }}>{totals.pending}</span>
                  <div style={{ color: '#e83e8c', opacity: 0.7, fontSize: '12px', marginTop: '3px' }}>￥{totals.pendingAmount.toLocaleString()}</div>
                </td>
                <td>-</td>
                <td>-</td>
                <td>{totals.salary.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoachStatistics; 