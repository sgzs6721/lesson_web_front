import React, { useState, useEffect } from 'react';
import '@/assets/styles/index.css';

// Interfaces for component data
interface StatCard {
  id: string;
  title: string;
  value: number;
  subtitle: string;
  period: 'day' | 'week' | 'month';
  growthPercent?: number;
  growthPositive?: boolean;
  icon: string;
}

interface CoachStats {
  id: string;
  name: string;
  completedLessons: number;
  completedAmount: number;
  pendingLessons: number;
  pendingAmount: number;
  hourlyRate: number;
  estimatedSalary: number;
  type: '全职' | '兼职';
  colorClass: string;
}

interface PaymentRecord {
  id: string;
  studentName: string;
  amount: number;
  lessons: number;
  date: string;
  type: string;
  coach: string;
}

interface StatsItem {
  number: number;
  unit: string;
  label: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState<'day' | 'week' | 'month'>('week');
  const [coachStats, setCoachStats] = useState<CoachStats[]>([]);
  const [coachStatsView, setCoachStatsView] = useState<'week' | 'month'>('week');

  // 处理全选功能
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll('input[data-status="unchecked"]');
    
    checkboxes.forEach((checkbox) => {
      const cb = checkbox as HTMLInputElement;
      cb.checked = isChecked;
    });
  };

  // 处理批量打卡功能
  const handleBatchPunch = () => {
    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked:not(#selectAllAttendance)');
    
    if (selectedCheckboxes.length === 0) {
      alert('请先选择要打卡的学员');
      return;
    }
    
    // 这里可以添加确认对话框
    if (window.confirm(`确定要为选中的 ${selectedCheckboxes.length} 名学员进行打卡吗？`)) {
      // 这里应该调用后端API进行批量打卡操作
      // 模拟操作成功
      selectedCheckboxes.forEach(checkbox => {
        const cb = checkbox as HTMLInputElement;
        cb.disabled = true;
        cb.checked = false;
        cb.setAttribute('data-status', 'checked');
        
        // 获取所在行，更新状态显示
        const row = cb.closest('tr');
        if (row) {
          const statusCell = row.querySelector('td:nth-child(9)');
          if (statusCell) {
            const badge = statusCell.querySelector('.badge');
            if (badge) {
              badge.className = 'badge badge-success';
              badge.textContent = '已打卡';
            }
          }
          
          // 更新操作按钮
          const actionCell = row.querySelector('td:nth-child(10)');
          if (actionCell) {
            actionCell.innerHTML = '<span style="color: #888; fontSize: 12px;">已完成</span>';
          }
        }
      });
      
      // 重置全选复选框
      const selectAllCheckbox = document.getElementById('selectAllAttendance') as HTMLInputElement;
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
      }
      
      alert('批量打卡成功！');
    }
  };

  // 拖动功能
  useEffect(() => {
    const cards = document.querySelectorAll('.dashboard-card');
    let activeCard: HTMLElement | null = null;
    let initialX: number, initialY: number;
    let offsetX: number, offsetY: number;
    
    // Show all drag handles
    const dragHandles = document.querySelectorAll('.drag-handle');
    dragHandles.forEach(handle => {
      (handle as HTMLElement).style.display = 'block';
    });
    
    // Add event listeners for drag handles
    dragHandles.forEach(handle => {
      const dragHandle = handle as HTMLElement;
      
      // Mouse events for desktop
      dragHandle.addEventListener('mousedown', startDrag);
      
      // Touch events for mobile
      dragHandle.addEventListener('touchstart', startDragTouch);
    });
    
    function startDrag(e: MouseEvent) {
      e.preventDefault();
      const target = e.target as HTMLElement;
      activeCard = target.closest('.dashboard-card') as HTMLElement;
      
      if (!activeCard) return;
      
      // Store initial positions
      initialX = e.clientX;
      initialY = e.clientY;
      
      // Set the initial offset
      const cardRect = activeCard.getBoundingClientRect();
      offsetX = initialX - cardRect.left;
      offsetY = initialY - cardRect.top;
      
      // Add dragging class
      activeCard.classList.add('dragging');
      
      // Set initial position
      activeCard.style.position = 'absolute';
      activeCard.style.zIndex = '1000';
      moveCard(e.clientX, e.clientY);
      
      // Add event listeners for drag movement
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', endDrag);
    }
    
    function startDragTouch(e: TouchEvent) {
      const target = e.target as HTMLElement;
      activeCard = target.closest('.dashboard-card') as HTMLElement;
      
      if (!activeCard || e.touches.length === 0) return;
      
      // Store initial positions
      initialX = e.touches[0].clientX;
      initialY = e.touches[0].clientY;
      
      // Set the initial offset
      const cardRect = activeCard.getBoundingClientRect();
      offsetX = initialX - cardRect.left;
      offsetY = initialY - cardRect.top;
      
      // Add dragging class
      activeCard.classList.add('dragging');
      
      // Set initial position
      activeCard.style.position = 'absolute';
      activeCard.style.zIndex = '1000';
      moveCard(e.touches[0].clientX, e.touches[0].clientY);
      
      // Add event listeners for drag movement
      document.addEventListener('touchmove', dragTouch);
      document.addEventListener('touchend', endDragTouch);
    }
    
    function drag(e: MouseEvent) {
      if (!activeCard) return;
      moveCard(e.clientX, e.clientY);
    }
    
    function dragTouch(e: TouchEvent) {
      if (!activeCard || e.touches.length === 0) return;
      moveCard(e.touches[0].clientX, e.touches[0].clientY);
    }
    
    function moveCard(clientX: number, clientY: number) {
      if (!activeCard) return;
      
      const contentPanel = document.querySelector('.content-panel');
      if (!contentPanel) return;
      
      const contentRect = contentPanel.getBoundingClientRect();
      
      // Calculate position relative to the content panel
      let left = clientX - offsetX - contentRect.left;
      let top = clientY - offsetY - contentRect.top;
      
      // Constrain within content panel
      left = Math.max(0, Math.min(left, contentRect.width - activeCard.offsetWidth));
      top = Math.max(0, Math.min(top, contentRect.height - 100)); // Allow some overflow at bottom
      
      activeCard.style.left = `${left}px`;
      activeCard.style.top = `${top}px`;
    }
    
    function endDrag() {
      finishDrag();
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', endDrag);
    }
    
    function endDragTouch() {
      finishDrag();
      document.removeEventListener('touchmove', dragTouch);
      document.removeEventListener('touchend', endDragTouch);
    }
    
    function finishDrag() {
      if (!activeCard) return;
      
      // Remove dragging class
      activeCard.classList.remove('dragging');
      
      // Reset the active card
      activeCard = null;
    }
    
    return () => {
      // Cleanup event listeners
      dragHandles.forEach(handle => {
        const dragHandle = handle as HTMLElement;
        dragHandle.removeEventListener('mousedown', startDrag);
        dragHandle.removeEventListener('touchstart', startDragTouch);
      });
      
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', dragTouch);
      document.removeEventListener('touchend', endDragTouch);
    };
  }, []);

  // 切换本周/本月视图
  const togglePeriodView = (view: 'week' | 'month') => {
    setCoachStatsView(view);
  };

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Simulate fetching coach stats
  useEffect(() => {
    // Sample data for different periods
    const coachStatsData = {
      day: [
        { id: '1', name: '李教练', completedLessons: 8, completedAmount: 960, pendingLessons: 2, pendingAmount: 240, hourlyRate: 120, estimatedSalary: 960, type: '全职' as const, colorClass: 'rgba(231, 76, 60, 0.7)' },
        { id: '2', name: '王教练', completedLessons: 6, completedAmount: 603, pendingLessons: 3, pendingAmount: 301.5, hourlyRate: 100.5, estimatedSalary: 603, type: '全职' as const, colorClass: 'rgba(52, 152, 219, 0.7)' },
        { id: '3', name: '张教练', completedLessons: 4, completedAmount: 442, pendingLessons: 1, pendingAmount: 110.5, hourlyRate: 110.5, estimatedSalary: 442, type: '兼职' as const, colorClass: 'rgba(46, 204, 113, 0.7)' },
        { id: '4', name: '刘教练', completedLessons: 5, completedAmount: 650.62, pendingLessons: 2, pendingAmount: 260.25, hourlyRate: 130.123, estimatedSalary: 650, type: '兼职' as const, colorClass: 'rgba(243, 156, 18, 0.7)' },
      ],
      week: [
        { id: '1', name: '李教练', completedLessons: 24, completedAmount: 2880, pendingLessons: 8, pendingAmount: 960, hourlyRate: 120, estimatedSalary: 2880, type: '全职' as const, colorClass: 'rgba(231, 76, 60, 0.7)' },
        { id: '2', name: '王教练', completedLessons: 18, completedAmount: 1809, pendingLessons: 10, pendingAmount: 1005, hourlyRate: 100.5, estimatedSalary: 1800, type: '全职' as const, colorClass: 'rgba(52, 152, 219, 0.7)' },
        { id: '3', name: '张教练', completedLessons: 16, completedAmount: 1768, pendingLessons: 12, pendingAmount: 1326, hourlyRate: 110.5, estimatedSalary: 1760, type: '兼职' as const, colorClass: 'rgba(46, 204, 113, 0.7)' },
        { id: '4', name: '刘教练', completedLessons: 14, completedAmount: 1821.72, pendingLessons: 7, pendingAmount: 910.86, hourlyRate: 130.123, estimatedSalary: 1820, type: '兼职' as const, colorClass: 'rgba(243, 156, 18, 0.7)' },
      ],
      month: [
        { id: '1', name: '李教练', completedLessons: 86, completedAmount: 10320, pendingLessons: 14, pendingAmount: 1680, hourlyRate: 120, estimatedSalary: 10320, type: '全职' as const, colorClass: 'rgba(231, 76, 60, 0.7)' },
        { id: '2', name: '王教练', completedLessons: 62, completedAmount: 6200, pendingLessons: 18, pendingAmount: 1800, hourlyRate: 100, estimatedSalary: 6200, type: '全职' as const, colorClass: 'rgba(52, 152, 219, 0.7)' },
        { id: '3', name: '张教练', completedLessons: 54, completedAmount: 5940, pendingLessons: 16, pendingAmount: 1760, hourlyRate: 110, estimatedSalary: 5940, type: '兼职' as const, colorClass: 'rgba(46, 204, 113, 0.7)' },
        { id: '4', name: '刘教练', completedLessons: 48, completedAmount: 6240, pendingLessons: 12, pendingAmount: 1560, hourlyRate: 130, estimatedSalary: 6240, type: '兼职' as const, colorClass: 'rgba(243, 156, 18, 0.7)' },
      ]
    };
    
    if (coachStatsView === 'week') {
      setCoachStats(coachStatsData.week);
    } else if (coachStatsView === 'month') {
      setCoachStats(coachStatsData.month);
    } else {
      setCoachStats(coachStatsData[activePeriod]);
    }
  }, [activePeriod, coachStatsView]);

  // Sample payment records data
  const paymentRecords: PaymentRecord[] = [
    { id: '1', studentName: '张小明', amount: 3800, lessons: 24, date: '2025-03-01', type: '1v1', coach: '李教练' },
    { id: '2', studentName: '李华', amount: 5400, lessons: 30, date: '2025-03-02', type: '1v1', coach: '王教练' },
    { id: '3', studentName: '王芳', amount: 3000, lessons: 20, date: '2025-03-03', type: '1v1', coach: '张教练' },
    { id: '4', studentName: '赵强', amount: 3200, lessons: 20, date: '2025-03-04', type: '1v1', coach: '刘教练' },
  ];

  // Stat cards data
  const statCards: StatCard[] = [
    {
      id: '1',
      title: '学员数',
      value: activePeriod === 'day' ? 85 : activePeriod === 'week' ? 320 : 1250,
      subtitle: '活跃学员',
      period: activePeriod,
      growthPercent: 5.2,
      growthPositive: true,
      icon: 'user-graduate'
    },
    {
      id: '2',
      title: '课程数',
      value: activePeriod === 'day' ? 24 : activePeriod === 'week' ? 156 : 620,
      subtitle: '已开展课程',
      period: activePeriod,
      growthPercent: 3.8,
      growthPositive: true,
      icon: 'book'
    },
    {
      id: '3',
      title: '教练数',
      value: activePeriod === 'day' ? 12 : activePeriod === 'week' ? 18 : 25,
      subtitle: '在职教练',
      period: activePeriod,
      growthPercent: 1.2,
      growthPositive: true,
      icon: 'user-tie'
    },
    {
      id: '4',
      title: '校区数',
      value: activePeriod === 'day' ? 4 : activePeriod === 'week' ? 5 : 8,
      subtitle: '运营校区',
      period: activePeriod,
      growthPercent: 0,
      growthPositive: false,
      icon: 'building'
    }
  ];

  // Stats bar data
  const statsBarItems: StatsItem[] = [
    { number: 3, unit: '个', label: '上课老师' },
    { number: 3, unit: '个', label: '上课班级' },
    { number: 11, unit: '人', label: '上课学员' },
    { number: 11, unit: '次', label: '打卡次数' },
    { number: 11, unit: '个', label: '消耗课时' },
    { number: 3, unit: '人', label: '请假人数' },
    { number: 950, unit: '元', label: '老师课酬' },
    { number: 2902, unit: '元', label: '消耗费用' },
  ];

  // Calculate coach stats totals
  const calculateTotals = (period: 'week' | 'month') => {
    if (period === 'week') {
      return {
        completed: 72,
        completedAmount: 8260,
        pending: 37,
        pendingAmount: 4200,
        salary: 8260
      };
    } else {
      return {
        completed: 250,
        completedAmount: 28700,
        pending: 60,
        pendingAmount: 6800,
        salary: 28700
      };
    }
  };

  const totals = calculateTotals(coachStatsView);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <span>加载中...</span>
      </div>
    );
  }

  return (
    <>
      {/* 今日数据 */}
      <div className="dashboard-card" id="today-overview-card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-title" style={{ fontSize: '18px' }}>今日数据</div>
          <div>
            <span className="drag-handle" title="拖动卡片">⋮⋮</span>
          </div>
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
                {/* 杨大冬课程卡片 */}
                <div className="coach-card" style={{ borderTop: '3px solid #3498db' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '15px', 
                    borderBottom: '1px solid rgba(0,0,0,0.05)', 
                    paddingBottom: '12px', 
                    paddingTop: '8px', 
                    backgroundColor: 'rgba(52, 152, 219, 0.05)', 
                    borderRadius: '6px', 
                    position: 'relative' 
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#34495e', textAlign: 'center', width: '100%', padding: '6px 0' }}>
                      杨大冬课程
                    </div>
                    <span style={{ fontSize: '13px', color: '#777', fontWeight: 500, position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}>
                      1对1-杨教练
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', fontSize: '14px', marginBottom: '15px', padding: '0 5px', textAlign: 'center' }}>
                    <span>课时：<b>8</b> | 课酬：<b>¥300</b> | 销课金额：<b style={{ color: '#3498db' }}>¥1,056.60</b></span>
                  </div>
                  
                  <div className="student-list">
                    <div>
                      <div className="student-item">
                        <span>张小明 (15:30-16:30)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>李华 (16:40-17:40)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>王芳 (18:00-19:00)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>赵强 (19:10-20:10)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>刘洋 (10:00-11:00)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>周明 (11:10-12:10)</span>
                        <span style={{ color: '#dc3545', fontSize: '12px', fontWeight: 500 }}>请假</span>
                      </div>
                      <div className="student-item">
                        <span>郑伟 (12:20-13:20)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>黄霞 (13:30-14:30)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 苗寒青课程卡片 */}
                <div className="coach-card" style={{ borderTop: '3px solid #2ecc71' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '15px', 
                    borderBottom: '1px solid rgba(0,0,0,0.05)', 
                    paddingBottom: '12px', 
                    paddingTop: '8px', 
                    backgroundColor: 'rgba(46, 204, 113, 0.05)', 
                    borderRadius: '6px', 
                    position: 'relative' 
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#34495e', textAlign: 'center', width: '100%', padding: '6px 0' }}>
                      苗寒青课程
                    </div>
                    <span style={{ fontSize: '13px', color: '#777', fontWeight: 500, position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}>
                      1对1-苗教练
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', fontSize: '14px', marginBottom: '15px', padding: '0 5px', textAlign: 'center' }}>
                    <span>课时：<b>3</b> | 课酬：<b>¥270</b> | 销课金额：<b style={{ color: '#2ecc71' }}>¥824.60</b></span>
                  </div>
                  
                  <div className="student-list">
                    <div>
                      <div className="student-item">
                        <span>刘明 (10:00-11:00)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>郑华 (11:10-12:10)</span>
                        <span style={{ color: '#dc3545', fontSize: '12px', fontWeight: 500 }}>请假</span>
                      </div>
                      <div className="student-item">
                        <span>周丽 (14:00-15:00)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 武文册课程卡片 */}
                <div className="coach-card" style={{ borderTop: '3px solid #f39c12' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '15px', 
                    borderBottom: '1px solid rgba(0,0,0,0.05)', 
                    paddingBottom: '12px', 
                    paddingTop: '8px', 
                    backgroundColor: 'rgba(243, 156, 18, 0.05)', 
                    borderRadius: '6px', 
                    position: 'relative' 
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#34495e', textAlign: 'center', width: '100%', padding: '6px 0' }}>
                      武文册课程
                    </div>
                    <span style={{ fontSize: '13px', color: '#777', fontWeight: 500, position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}>
                      1对1-武教练
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', fontSize: '14px', marginBottom: '15px', padding: '0 5px', textAlign: 'center' }}>
                    <span>课时：<b>7</b> | 课酬：<b>¥380</b> | 销课金额：<b style={{ color: '#f39c12' }}>¥1,021.10</b></span>
                  </div>
                  
                  <div className="student-list">
                    <div>
                      <div className="student-item">
                        <span>陈刚 (13:00-14:00)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>吴婷 (14:10-15:10)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>黄伟 (15:20-16:20)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>杨洁 (16:30-17:30)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>王鑫 (9:00-10:00)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                      <div className="student-item">
                        <span>赵丽 (10:10-11:10)</span>
                        <span style={{ color: '#dc3545', fontSize: '12px', fontWeight: 500 }}>请假</span>
                      </div>
                      <div className="student-item">
                        <span>张飞 (11:20-12:20)</span>
                        <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 500 }}>已完成</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 今日上课学员 */}
      <div id="attendance-card" className="dashboard-card" style={{ marginBottom: '20px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-title" style={{ fontSize: '18px' }}>今日上课学员</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              className="btn-batch-punch" 
              style={{ marginRight: '10px' }}
              onClick={handleBatchPunch}
            >
              <span>✓</span> 批量打卡
            </button>
            <span className="drag-handle" title="拖动卡片">⋮⋮</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: '0' }}>
          <div style={{ overflow: 'auto' }}>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', width: '40px' }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }} 
                      onChange={handleSelectAll}
                      id="selectAllAttendance"
                    />
                  </th>
                  <th>学员姓名</th>
                  <th>时间</th>
                  <th>教练</th>
                  <th>剩余课时</th>
                  <th>课程类型</th>
                  <th>销课金额</th>
                  <th>剩余金额</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }} 
                      data-status="unchecked"
                    />
                  </td>
                  <td>张小明</td>
                  <td>14:00-16:00</td>
                  <td>李教练</td>
                  <td>12/24</td>
                  <td>
                    <span className="badge badge-warning">未打卡</span>
                  </td>
                  <td>¥2,400</td>
                  <td>¥2,400</td>
                  <td>
                    <span className="badge badge-warning">未打卡</span>
                  </td>
                  <td>
                    <button className="btn-expense" style={{ marginRight: '5px' }}>请假</button>
                    <button className="btn-punch">✓ 打卡</button>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }} 
                      data-status="checked"
                      disabled
                    />
                  </td>
                  <td>李华</td>
                  <td>10:00-11:00</td>
                  <td>王教练</td>
                  <td>15/30</td>
                  <td>
                    <span className="badge badge-success">已打卡</span>
                  </td>
                  <td>¥180</td>
                  <td>¥2,700</td>
                  <td>
                    <span className="badge badge-success">已打卡</span>
                  </td>
                  <td>
                    <span style={{ color: '#888', fontSize: '12px' }}>已完成</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }} 
                      data-status="leave"
                      disabled
                    />
                  </td>
                  <td>王芳</td>
                  <td>16:00-17:00</td>
                  <td>张教练</td>
                  <td>8/20</td>
                  <td>
                    <span className="badge badge-danger">已请假</span>
                  </td>
                  <td>¥1,600</td>
                  <td>¥1,600</td>
                  <td>
                    <span className="badge badge-danger">已请假</span>
                  </td>
                  <td>
                    <span style={{ color: '#888', fontSize: '12px' }}>已请假</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 教练员课时统计 */}
      <div className="dashboard-card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-title">教练员课时统计</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="period-tabs" style={{ marginRight: '10px' }}>
              <button 
                className={`period-tab ${coachStatsView === 'week' ? 'active' : ''}`}
                onClick={() => togglePeriodView('week')}
              >本周</button>
              <button 
                className={`period-tab ${coachStatsView === 'month' ? 'active' : ''}`}
                onClick={() => togglePeriodView('month')}
              >本月</button>
            </div>
            <span className="drag-handle" title="拖动卡片">⋮⋮</span>
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
                      <span className="amount-note" style={{ color: '#28a745', opacity: 0.8 }}>(¥{coach.completedAmount.toLocaleString()})</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#ffc107' }}>{coach.pendingLessons}</span> 
                      <span className="amount-note" style={{ color: '#ffc107', opacity: 0.8 }}>(¥{coach.pendingAmount.toLocaleString()})</span>
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
                  <td>{totals.completed} <span className="amount-note">(¥{totals.completedAmount.toLocaleString()})</span></td>
                  <td>{totals.pending} <span className="amount-note">(¥{totals.pendingAmount.toLocaleString()})</span></td>
                  <td>-</td>
                  <td>-</td>
                  <td>{totals.salary.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      {/* 数据统计 */}
      <div className="dashboard-card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-title" style={{ fontSize: '18px' }}>数据总览</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="period-tabs" style={{ marginRight: '10px' }}>
              <button 
                className={`period-tab ${coachStatsView === 'week' ? 'active' : ''}`}
                onClick={() => togglePeriodView('week')}
              >本周</button>
              <button 
                className={`period-tab ${coachStatsView === 'month' ? 'active' : ''}`}
                onClick={() => togglePeriodView('month')}
              >本月</button>
            </div>
            <span className="drag-handle" title="拖动卡片">⋮⋮</span>
          </div>
        </div>
        <div className="card-body">
          <div className="stats-grid">
            {/* 总流水 */}
            <div className="stat-box">
              <div className="stat-box-title">总流水</div>
              <div className="stat-box-value">¥358,645</div>
              <div className="stat-box-subtitle">
                较上月 <span className="stat-highlight">+8.5%</span>
              </div>
            </div>
            
            {/* 总利润 */}
            <div className="stat-box">
              <div className="stat-box-title">总利润</div>
              <div className="stat-box-value">¥176,290</div>
              <div className="stat-box-subtitle">
                较上月 <span className="stat-highlight">+6.2%</span>
              </div>
            </div>
            
            {/* 总学员数 */}
            <div className="stat-box">
              <div className="stat-box-title">总学员数</div>
              <div className="stat-box-value">147</div>
              <div className="stat-box-subtitle">
                较上月 <span className="stat-highlight">+12%</span>
              </div>
            </div>
            
            {/* 教练数量 */}
            <div className="stat-box">
              <div className="stat-box-title">教练数量</div>
              <div className="stat-box-value">8</div>
              <div className="stat-box-subtitle">
                兼职 <span className="stat-highlight-alt">3</span> | 全职 <span className="stat-highlight-primary">5</span>
              </div>
            </div>
            
            {/* 本周课时 */}
            <div className="stat-box">
              <div className="stat-box-title">本周课时</div>
              <div className="stat-box-value">18/35</div>
              <div className="stat-box-subtitle">
                销课金额 <span className="stat-highlight">¥12,800</span>
              </div>
            </div>
            
            {/* 本周缴费学员 */}
            <div className="stat-box">
              <div className="stat-box-title">本周缴费学员</div>
              <div className="stat-box-value">7</div>
              <div className="stat-box-subtitle">
                新学员 <span className="stat-highlight-alt">3</span> | 续费 <span className="stat-highlight-primary">4</span>
              </div>
            </div>
            
            {/* 本周缴费金额 */}
            <div className="stat-box">
              <div className="stat-box-title">本周缴费金额</div>
              <div className="stat-box-value">¥28,760</div>
              <div className="stat-box-subtitle">
                新学员 <span className="stat-highlight">¥15,200</span> | 续费 <span className="stat-highlight-alt">¥13,560</span>
              </div>
            </div>
            
            {/* 本周出勤率 */}
            <div className="stat-box">
              <div className="stat-box-title">本周出勤率</div>
              <div className="stat-box-value">94.2%</div>
              <div className="stat-box-subtitle">
                较上周 <span className="stat-highlight">+1.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 