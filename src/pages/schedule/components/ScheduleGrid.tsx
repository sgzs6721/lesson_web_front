import React, { useRef, useEffect } from 'react';
import { FixedScheduleData, ScheduleCourseInfo, CoachSimpleInfo } from '@/api/schedule/types';
import { Tag } from 'antd';

interface ScheduleGridProps {
  scheduleData: FixedScheduleData | null;
  selectedCoach: number | null;
  coachList: CoachSimpleInfo[];
}

const generateCoachColors = (scheduleData: FixedScheduleData, coachList: CoachSimpleInfo[]): { [key: number]: string } => {
  if (!scheduleData || !scheduleData.schedule || !coachList) return {};
  
  const colors = [
    '#e74c3c', // 红色
    '#3498db', // 蓝色  
    '#2ecc71', // 绿色
    '#f39c12', // 橙色
    '#9b59b6', // 紫色
    '#e67e22', // 橙红色
    '#1abc9c', // 青色
    '#34495e', // 深灰色
  ];

  const colorMap: { [key: number]: string } = {};
  coachList.forEach((coach, index) => {
    colorMap[coach.id] = colors[index % colors.length];
  });

  return colorMap;
};

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ scheduleData, selectedCoach, coachList }) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // 创建tooltip元素
  useEffect(() => {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;

    return () => {
      if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
        document.body.removeChild(tooltipRef.current);
      }
    };
  }, []);

  // tooltip显示和隐藏函数
  const showTooltip = (event: React.MouseEvent, content: string) => {
    if (!tooltipRef.current) return;
    
    const tooltip = tooltipRef.current;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    
    tooltip.textContent = content;
    
    // 设置tooltip显示在元素正上方
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 35}px`; // 显示在元素上方
    tooltip.style.transform = 'translateX(-50%)'; // 水平居中
    tooltip.classList.add('show');
    
    // 调整位置防止超出视窗
    setTimeout(() => {
      const tooltipRect = tooltip.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      
      // 水平边界调整
      if (tooltipRect.right > windowWidth) {
        const newLeft = rect.left + rect.width / 2 - (tooltipRect.right - windowWidth) - 10;
        tooltip.style.left = `${newLeft}px`;
      }
      if (tooltipRect.left < 0) {
        const newLeft = rect.left + rect.width / 2 + Math.abs(tooltipRect.left) + 10;
        tooltip.style.left = `${newLeft}px`;
      }
      
      // 垂直边界调整 - 如果上方空间不够，显示在下方
      if (tooltipRect.top < 0) {
        tooltip.style.top = `${rect.bottom + 5}px`;
      }
    }, 0);
  };

  const hideTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.classList.remove('show');
    }
  };

  if (!scheduleData || !scheduleData.timeSlots || !scheduleData.days) {
    return (
      <div className="schedule-placeholder">
        暂无课表数据
      </div>
    );
  }

  const coachColors = generateCoachColors(scheduleData, coachList);

  // 格式化课时数，小数时显示一位小数，整数时显示整数
  const formatHours = (hours: string): string => {
    const num = parseFloat(hours);
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  const renderCourseInfo = (course: ScheduleCourseInfo) => {
    const coachColor = coachColors[course.coachId] || '#95a5a6';
    
    // 获取教练对应的CSS类名 - 根据实际教练列表动态生成
    const getCoachClass = (coachId: number) => {
      const coachIndex = coachList.findIndex(coach => coach.id === coachId);
      if (coachIndex === -1) return '';
      
      // 根据教练在列表中的顺序分配类名
      const classNames = ['coach-1', 'coach-2', 'coach-3', 'coach-4', 'coach-5', 'coach-6', 'coach-7', 'coach-8'];
      return classNames[coachIndex % classNames.length];
    };
    
    // 课程类型标签颜色映射 - 动态分配颜色
    const getTypeTagColor = (type: string) => {
      const colors = ['orange', 'purple', 'magenta', 'green', 'blue', 'red', 'cyan', 'geekblue'];
      const hash = type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    };
    
    // 处理学生姓名显示 - 精简版
    const renderStudentNames = () => {
      const students = course.studentName ? course.studentName.split(',') : [];
      const studentList = students.map(student => student.trim()).join(', ');
      
      return (
        <div style={{ 
          textAlign: 'center'
        }}>
          <span style={{ 
            color: '#1890ff', 
            fontWeight: 'bold', 
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {studentList}
          </span>
        </div>
      );
    };
    
    // 构建hover提示内容
    const hoverContent = `${course.courseType} | 剩余${formatHours(course.remainHours)}/${formatHours(course.totalHours)}课时`;
    
    return (
      <div 
        className={`student-info ${getCoachClass(course.coachId)}`} 
        style={{ borderLeft: `3px solid ${coachColor}` }}
        onMouseEnter={(e) => showTooltip(e, hoverContent)}
        onMouseLeave={hideTooltip}
      >
        <div className="details">
          <div className="description">{course.description}</div>
          {renderStudentNames()}
        </div>
      </div>
    );
  };

  return (
    <div className="schedule-container">
      <div className="schedule">
        {/* 左上角空白格子 */}
        <div className="schedule-header"></div>
        
        {/* 星期几标题行 */}
        {scheduleData.days.map(day => (
          <div key={day} className="schedule-header">
            {day}
          </div>
        ))}
        
        {/* 时间段和课程内容 */}
        {scheduleData.timeSlots.map(timeSlot => (
          <React.Fragment key={timeSlot}>
            {/* 时间段标题 */}
            <div className="schedule-time">
              {timeSlot}
            </div>
            
            {/* 每天的课程安排 */}
            {scheduleData.days.map(day => {
              const coursesForDay = scheduleData.schedule[timeSlot]?.[day] || [];
              
              // 根据选中的教练ID过滤课程
              const filteredCourses = selectedCoach 
                ? coursesForDay.filter((course: ScheduleCourseInfo) => course.coachId === selectedCoach)
                : coursesForDay;
              
              // 判断是否只有一个课程块，添加single-item类名实现居中
              const cellClassName = filteredCourses.length === 1 ? 'schedule-cell single-item' : 'schedule-cell';
              
              return (
                <div key={`${timeSlot}-${day}`} className={cellClassName}>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course: ScheduleCourseInfo, index: number) => 
                      <div key={`${course.description}-${index}`}>
                        {renderCourseInfo(course)}
                      </div>
                    )
                  ) : (
                    <div style={{ 
                      color: '#ccc', 
                      textAlign: 'center',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      flex: 1
                    }}>
                      {selectedCoach ? '暂无' : '空闲'}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid; 