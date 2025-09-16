import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { StatsItem, ClassCardInfo } from '../types/dashboard';

interface TodayStatsProps {
  statsBarItems: StatsItem[];
  classCards: ClassCardInfo[];
  onRefresh?: () => void;
  loading?: boolean;
}

const TodayStats: React.FC<TodayStatsProps> = ({ statsBarItems, classCards, onRefresh, loading }) => {
  // 优化学员列表布局 - 保证每行两列，学员均匀分布
  const getBalancedStudents = (card: ClassCardInfo) => {
    // 确保 card.students 存在且为数组
    if (!card || !card.students || !Array.isArray(card.students)) {
      return [];
    }
    
    const students = [...card.students];
    
    // 确保所有卡片都有足够的学员位置以保持布局一致
    while (students.length < 8) {
      students.push({ name: '', time: '', status: 'empty' });
    }
    
    // 每行两个学员，最多显示4行（即8个学员）
    const rows = [];
    for (let i = 0; i < students.length; i += 2) {
      if (i >= 8) break; // 最多显示4行
      
      rows.push(
        <div className="student-row" key={i}>
          {/* 左侧学员 */}
          <div className="student-item">
            {students[i].name && (
              <>
                <span>{students[i].name} ({students[i].time})</span>
                <span style={{ 
                  color: students[i].status === '已完成' ? '#27ae60' : 
                         students[i].status === '请假' ? '#e74c3c' : 
                         students[i].status === '未打卡' ? '#f39c12' : 'transparent', 
                  fontSize: '12px', 
                  fontWeight: 500,
                  visibility: students[i].status !== 'empty' ? 'visible' : 'hidden'
                }}>
                  {students[i].status !== 'empty' ? students[i].status : '占位'}
                </span>
              </>
            )}
          </div>
          
          {/* 右侧学员 */}
          <div className="student-item">
            {students[i+1] && students[i+1].name && (
              <>
                <span>{students[i+1].name} ({students[i+1].time})</span>
                <span style={{ 
                  color: students[i+1].status === '已完成' ? '#27ae60' : 
                         students[i+1].status === '请假' ? '#e74c3c' : 
                         students[i+1].status === '未打卡' ? '#f39c12' : 'transparent', 
                  fontSize: '12px', 
                  fontWeight: 500,
                  visibility: students[i+1].status !== 'empty' ? 'visible' : 'hidden'
                }}>
                  {students[i+1].status !== 'empty' ? students[i+1].status : '占位'}
                </span>
              </>
            )}
          </div>
        </div>
      );
    }
    
    return rows;
  };

  // 将教练课程分为两行显示
  const renderCoachCardsInRows = () => {
    const rows: React.ReactNode[] = [];
    const cardsPerRow = 2;
    
    // 确保 classCards 存在且为数组
    if (!classCards || !Array.isArray(classCards)) {
      return rows;
    }
    
    for (let i = 0; i < classCards.length; i += cardsPerRow) {
      const rowCards = classCards.slice(i, i + cardsPerRow);
      const isLastRow = i + cardsPerRow >= classCards.length;
      
      rows.push(
        <div key={i} style={{ 
          display: 'flex', 
          justifyContent: rowCards.length < cardsPerRow ? 'flex-start' : 'space-between', 
          gap: '10px', 
          marginBottom: isLastRow ? '0' : '15px' 
        }}>
          {rowCards.map(card => (
            <div key={card.id} className="coach-card" style={{ borderTop: `3px solid ${card.borderColor}` }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '10px', 
                borderBottom: '1px solid rgba(0,0,0,0.05)', 
                paddingBottom: '8px', 
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
              
              <div style={{ display: 'flex', justifyContent: 'center', fontSize: '14px', marginBottom: '8px', padding: '0 5px', textAlign: 'center' }}>
                <span>课时：<b>{card.lessonCount}</b> | 课酬：<b>¥{card.coachSalary}</b> | 销课金额：<b style={{ color: card.borderColor }}>¥{card.salesAmount.toLocaleString()}</b></span>
              </div>
              
              <div className="student-list">
                {getBalancedStudents(card)}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="dashboard-card" id="today-overview-card" style={{ marginBottom: '0' }}>
      <div className="card-header">
        <div className="card-title" style={{ fontSize: '18px' }}>今日数据</div>
        {onRefresh && (
          <Button 
            type="text" 
            icon={<ReloadOutlined />} 
            onClick={onRefresh}
            loading={loading}
            style={{ color: '#1890ff' }}
            title="刷新今日数据"
          />
        )}
      </div>
      <div className="card-body">
        {/* 统计条 */}
        <div className="stats-bar">
          {(statsBarItems || []).map((item, index) => (
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
        <div style={{ marginTop: '12px', marginBottom: '0' }}>
          <div id="class-dimension-view" style={{ padding: '0 5px' }}>
            {renderCoachCardsInRows()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayStats; 