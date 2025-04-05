import React from 'react';
import { StatsItem, ClassCardInfo } from '../types/dashboard';

interface TodayStatsProps {
  statsBarItems: StatsItem[];
  classCards: ClassCardInfo[];
}

const TodayStats: React.FC<TodayStatsProps> = ({ statsBarItems, classCards }) => {
  return (
    <div className="dashboard-card" id="today-overview-card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <div className="card-title" style={{ fontSize: '18px' }}>今日数据</div>
      </div>
      <div className="card-body">
        {/* 统计条 */}
        <div className="stats-bar">
          {statsBarItems.map((item, index) => (
            <div className="stat-item" key={index}>
              <div className="stat-content">
                <div className="stat-number">
                  {item.number.toLocaleString()}
                  <span className="stat-unit">{item.unit}</span>
                </div>
                <div className="stat-label">{item.label}</div>
              </div>
              {index < statsBarItems.length - 1 && <div className="stat-divider"></div>}
            </div>
          ))}
        </div>

        {/* 教练课程卡片 */}
        <div style={{ marginTop: '15px' }}>
          <div id="class-dimension-view">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'stretch' }}>
              {classCards.map(card => (
                <div key={card.id} className="coach-card" style={{ borderTop: `3px solid ${card.borderColor}` }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '15px', 
                    borderBottom: '1px solid rgba(0,0,0,0.05)', 
                    paddingBottom: '12px', 
                    paddingTop: '8px', 
                    backgroundColor: card.backgroundColor, 
                    borderRadius: '6px', 
                    position: 'relative' 
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#34495e', textAlign: 'center', width: '100%', padding: '6px 0' }}>
                      {card.title}
                    </div>
                    <span style={{ fontSize: '13px', color: '#777', fontWeight: 500, position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}>
                      1对1-{card.coachName}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', fontSize: '14px', marginBottom: '15px', padding: '0 5px', textAlign: 'center' }}>
                    <span>课时：<b>{card.lessonCount}</b> | 课酬：<b>¥{card.coachSalary}</b> | 销课金额：<b style={{ color: card.borderColor }}>¥{card.salesAmount.toLocaleString()}</b></span>
                  </div>
                  
                  <div className="student-list">
                    <div>
                      {card.students.map((student, idx) => (
                        <div className="student-item" key={idx}>
                          <span>{student.name} ({student.time})</span>
                          <span style={{ 
                            color: student.status === '已完成' ? '#28a745' : '#dc3545', 
                            fontSize: '12px', 
                            fontWeight: 500 
                          }}>
                            {student.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayStats; 