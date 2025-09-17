import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { ReloadOutlined, EllipsisOutlined } from '@ant-design/icons';
import { StatsItem, ClassCardInfo } from '../types/dashboard';

interface TodayStatsProps {
  statsBarItems: StatsItem[];
  classCards: ClassCardInfo[];
  onRefresh?: () => void;
  loading?: boolean;
}

const TodayStats: React.FC<TodayStatsProps> = ({ statsBarItems, classCards, onRefresh, loading }) => {
  // 本地状态以便在不改动上层时更新学员状态展示
  const [cards, setCards] = useState<ClassCardInfo[]>(classCards || []);
  useEffect(() => {
    setCards(classCards || []);
  }, [classCards]);

  // 多选：每个卡片是否开启与已选索引
  const [multiSelect, setMultiSelect] = useState<Record<string, { enabled: boolean; selected: Record<number, boolean> }>>({});
  const ensureCardMulti = (cardId: string) => {
    setMultiSelect(prev => (prev[cardId] ? prev : { ...prev, [cardId]: { enabled: false, selected: {} } }));
  };
  const toggleMulti = (cardId: string) => {
    ensureCardMulti(cardId);
    setMultiSelect(prev => ({ ...prev, [cardId]: { enabled: !(prev[cardId]?.enabled ?? false), selected: {} } }));
  };
  const toggleStudentChecked = (cardId: string, idx: number, checked: boolean) => {
    setMultiSelect(prev => ({
      ...prev,
      [cardId]: { enabled: prev[cardId]?.enabled ?? false, selected: { ...(prev[cardId]?.selected ?? {}), [idx]: checked } }
    }));
  };
  const getCheckedCount = (cardId: string) => Object.values(multiSelect[cardId]?.selected || {}).filter(Boolean).length;
  const isAllChecked = (cardId: string, total: number) => {
    const map = multiSelect[cardId]?.selected || {};
    let cnt = 0;
    for (let i = 0; i < total; i++) if (map[i]) cnt++;
    return total > 0 && cnt === total;
  };
  const toggleSelectAll = (cardId: string, total: number, checked: boolean) => {
    setMultiSelect(prev => {
      const selected: Record<number, boolean> = {};
      if (checked) {
        for (let i = 0; i < total; i++) selected[i] = true;
      }
      return { ...prev, [cardId]: { enabled: prev[cardId]?.enabled ?? false, selected } };
    });
  };
  const batchPunch = (cardIndex: number, cardId: string) => {
    const selectedMap = multiSelect[cardId]?.selected || {};
    const indices = Object.keys(selectedMap).map(n => parseInt(n)).filter(i => selectedMap[i]);
    if (indices.length === 0) return;
    Modal.confirm({
      title: `确认批量打卡选中的 ${indices.length} 名学员？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setCards(prev => {
          const next = [...prev];
          const card = next[cardIndex];
          next[cardIndex] = { ...card, students: card.students.map((s, idx) => (indices.includes(idx) ? { ...s, status: '已完成' } : s)) };
          return next;
        });
        setMultiSelect(prev => ({ ...prev, [cardId]: { enabled: true, selected: {} } }));
      }
    });
  };

  const confirmChange = (
    cardIndex: number,
    studentIndex: number,
    action: 'checkin' | 'leave' | 'absent'
  ) => {
    const actionText = action === 'checkin' ? '打卡' : action === 'leave' ? '请假' : '缺勤';
    Modal.confirm({
      title: `确认${actionText}？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setCards(prev => {
          const next = [...prev];
          const status = action === 'checkin' ? '已完成' : action === 'leave' ? '请假' : '未打卡';
          if (next[cardIndex] && next[cardIndex].students[studentIndex]) {
            next[cardIndex] = {
              ...next[cardIndex],
              students: next[cardIndex].students.map((s, idx) =>
                idx === studentIndex ? { ...s, status } : s
              )
            };
          }
          return next;
        });
      }
    });
  };

  // 已移除三点菜单
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
                <span style={{ flex: '0 1 auto' }}>
                  {students[i].name} ({students[i].time})
                </span>
                {students[i].remainingHours !== undefined && students[i].totalHours !== undefined && (
                  <span
                    style={{
                      padding: '0 6px',
                      background: 'rgba(0,0,0,0.04)',
                      borderRadius: 4,
                      fontSize: '12px',
                      fontWeight: 600,
                      lineHeight: '18px'
                    }}
                    title={`剩余课时/总课时：${students[i].remainingHours}/${students[i].totalHours}`}
                  >
                    <span style={{ color: '#27ae60' }}>{students[i].remainingHours}</span>
                    <span style={{ color: '#bfbfbf' }}>/</span>
                    <span style={{ color: '#8c8c8c' }}>{students[i].totalHours}</span>
                  </span>
                )}
                <span style={{ 
                  color: students[i].status === '已完成' ? '#27ae60' : 
                         students[i].status === '请假' ? '#e74c3c' : 
                         students[i].status === '未打卡' ? '#f39c12' : 'transparent', 
                  fontSize: '12px', 
                  fontWeight: 500,
                  visibility: students[i].status !== 'empty' ? 'visible' : 'hidden',
                  marginLeft: 'auto'
                }}>
                  {students[i].status !== 'empty' ? students[i].status : '占位'}
                </span>
              </div>
            )}
          </div>
          
          {/* 右侧学员 */}
          <div className="student-item">
            {students[i+1] && students[i+1].name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
                <span style={{ flex: '0 1 auto' }}>
                  {students[i+1].name} ({students[i+1].time})
                </span>
                {students[i+1].remainingHours !== undefined && students[i+1].totalHours !== undefined && (
                  <span
                    style={{
                      padding: '0 6px',
                      background: 'rgba(0,0,0,0.04)',
                      borderRadius: 4,
                      fontSize: '12px',
                      fontWeight: 600,
                      lineHeight: '18px'
                    }}
                    title={`剩余课时/总课时：${students[i+1].remainingHours}/${students[i+1].totalHours}`}
                  >
                    <span style={{ color: '#27ae60' }}>{students[i+1].remainingHours}</span>
                    <span style={{ color: '#bfbfbf' }}>/</span>
                    <span style={{ color: '#8c8c8c' }}>{students[i+1].totalHours}</span>
                  </span>
                )}
                <span style={{ 
                  color: students[i+1].status === '已完成' ? '#27ae60' : 
                         students[i+1].status === '请假' ? '#e74c3c' : 
                         students[i+1].status === '未打卡' ? '#f39c12' : 'transparent', 
                  fontSize: '12px', 
                  fontWeight: 500,
                  visibility: students[i+1].status !== 'empty' ? 'visible' : 'hidden',
                  marginLeft: 'auto'
                }}>
                  {students[i+1].status !== 'empty' ? students[i+1].status : '占位'}
                </span>
              </div>
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
    const cardsPerRow = 3;
    
    // 确保 classCards 存在且为数组
    if (!cards || !Array.isArray(cards)) {
      return rows;
    }
    
    for (let i = 0; i < cards.length; i += cardsPerRow) {
      const rowCards = cards.slice(i, i + cardsPerRow);
      const isLastRow = i + cardsPerRow >= cards.length;
      
      rows.push(
        <div key={i} style={{ 
          display: 'flex', 
          justifyContent: rowCards.length < cardsPerRow ? 'flex-start' : 'space-between', 
          gap: '10px', 
          marginBottom: isLastRow ? '0' : '15px' 
        }}>
          {rowCards.map((card, cardIdx) => (
            <div
              key={card.id}
              className="coach-card"
              style={{
                borderTop: `3px solid ${card.borderColor}`,
                flex: '0 0 calc((100% - 20px) / 3)'
              }}
            >
              <div style={{ 
                marginBottom: '10px',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                padding: '6px 10px',
                backgroundColor: card.backgroundColor,
                borderRadius: '6px',
                position: 'relative',
                textAlign: 'center'
              }}>
                {/* 左上角多选入口（仅未开启时显示） */}
                {!multiSelect[card.id]?.enabled && (
                  <div style={{ position: 'absolute', left: 10, top: 6 }}>
                    <Button size="small" className="multi-select-trigger" onClick={() => toggleMulti(card.id)}>多选</Button>
                  </div>
                )}
                <span style={{ position: 'absolute', right: 10, top: 8, fontSize: '12px', color: '#777', fontWeight: 500 }}>{card.coachName}</span>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#34495e' }}>{card.title}</div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '8px 12px',
                  lineHeight: '18px'
                }}>
                  <span>课时：<b>{card.lessonCount}</b></span>
                  <span>|</span>
                  <span>课酬：<b>¥{card.coachSalary}</b></span>
                  <span>|</span>
                  <span>销课金额：<b style={{ color: card.borderColor }}>¥{card.salesAmount.toLocaleString()}</b></span>
                </div>
              </div>
              
              {/* 去重：下方重复的概要信息已移除 */}
              
              <div className="student-list">
                {(() => {
                  const sList = card.students ?? [];
                  return sList.map((stu, si) => {
                    const isMulti = !!multiSelect[card.id]?.enabled;
                    return (
                      <div className="student-row" key={si}>
                        <div
                          className="student-item student-grid"
                          style={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: isMulti ? '24px repeat(4, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
                            columnGap: 12
                          }}
                        >
                          {stu && stu.name && (
                            <>
                              {/* 勾选列：仅在多选开启时渲染 */}
                              {isMulti && (
                                <div className="col checkbox-col">
                                  <input
                                    type="checkbox"
                                    checked={!!multiSelect[card.id]?.selected?.[si]}
                                    onChange={e => toggleStudentChecked(card.id, si, e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                              )}

                              {/* 姓名 */}
                              <div className="col name-col">{stu.name}</div>

                              {/* 时间 */}
                              <div className="col time-col">{stu.time}</div>

                              {/* 课时徽标 */}
                              <div className="col hours-col">
                                {stu.remainingHours !== undefined && stu.totalHours !== undefined && (
                                  <span
                                    className="hours-badge"
                                    title={`剩余课时/总课时：${stu.remainingHours}/${stu.totalHours}`}
                                  >
                                    <span className="hours-remain">{stu.remainingHours}</span>
                                    <span className="hours-sep">/</span>
                                    <span className="hours-total">{stu.totalHours}</span>
                                  </span>
                                )}
                              </div>

                              {/* 状态 */}
                              <div className="col status-col" style={{
                                color: stu.status === '已完成' ? '#27ae60' :
                                       stu.status === '请假' ? '#e74c3c' :
                                       stu.status === '未打卡' ? '#f39c12' : 'transparent',
                                fontSize: '12px',
                                fontWeight: 500,
                                visibility: stu.status !== 'empty' ? 'visible' : 'hidden'
                              }}>
                                {stu.status !== 'empty' ? stu.status : '占位'}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* 多选操作条 - 移动到列表下方显示 */}
              {multiSelect[card.id]?.enabled && (
                <div className="multi-actions">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Button
                      size="small"
                      onClick={() => toggleSelectAll(card.id, card.students?.length || 0, !isAllChecked(card.id, card.students?.length || 0))}
                      style={{ borderRadius: 4, padding: '1px 8px', background: '#f6ffed', color: '#389e0d', borderColor: '#b7eb8f', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <input
                        type="checkbox"
                        checked={isAllChecked(card.id, card.students?.length || 0)}
                        readOnly
                        style={{ width: 12, height: 12, cursor: 'pointer' }}
                      />
                      全选
                    </Button>
                    <Button
                      size="small"
                      onClick={() => toggleMulti(card.id)}
                      style={{ borderRadius: 4, padding: '1px 8px', background: '#fff1f0', color: '#cf1322', borderColor: '#ffa39e' }}
                    >
                      取消
                    </Button>
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>已选 {getCheckedCount(card.id)} 人</div>
                  <div>
                    {(() => { const realIndex = i + cardIdx; return (
                      <Button size="small" type="primary" onClick={() => batchPunch(realIndex, card.id)} style={{ borderRadius: 4, padding: '1px 10px' }}>批量打卡</Button>
                    ); })()}
                  </div>
                </div>
              )}

              {/* 底部批量按钮已移到上方操作条 */}
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
                    {item.number?.toLocaleString() || '0'}
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