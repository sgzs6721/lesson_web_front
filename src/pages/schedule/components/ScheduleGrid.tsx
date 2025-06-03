import React from 'react';
import { FixedScheduleData, ScheduleCourseInfo } from '@/api/schedule/types';

interface ScheduleGridProps {
  scheduleData: FixedScheduleData | null;
  selectedCoach: string | null;
}

const generateCoachColors = (scheduleData: FixedScheduleData): { [key: string]: string } => {
  if (!scheduleData || !scheduleData.schedule) return {};
  
  const coachNames = new Set<string>();
  Object.values(scheduleData.schedule).forEach(timeSlot => {
    Object.values(timeSlot).forEach(daySchedules => {
      daySchedules.forEach((course: ScheduleCourseInfo) => {
        if (course.coachName) {
          coachNames.add(course.coachName);
        }
      });
    });
  });

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

  const colorMap: { [key: string]: string } = {};
  Array.from(coachNames).forEach((coachName, index) => {
    colorMap[coachName] = colors[index % colors.length];
  });

  return colorMap;
};

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ scheduleData, selectedCoach }) => {
  if (!scheduleData || !scheduleData.timeSlots || !scheduleData.days) {
    return (
      <div className="schedule-placeholder">
        暂无课表数据
      </div>
    );
  }

  const coachColors = generateCoachColors(scheduleData);

  const renderCourseInfo = (course: ScheduleCourseInfo) => {
    const coachColor = coachColors[course.coachName] || '#95a5a6';
    
    return (
      <div 
        key={`${course.coachName}-${course.courseName}`}
        className="student-info"
        style={{
          backgroundColor: `${coachColor}15`,
          borderLeft: `4px solid ${coachColor}`,
        }}
      >
        <div className="name">{course.courseName}</div>
        <div className="details">
          <div className="course-info">教练: {course.coachName}</div>
          <div className="description">{course.description}</div>
          <div style={{ marginTop: 4, color: '#666', fontSize: '11px' }}>
            剩余: {course.remainHours}/{course.totalHours}课时
          </div>
          <div style={{ color: '#666', fontSize: '11px' }}>
            单价: ¥{course.unitPrice}
          </div>
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
              
              // 根据选中的教练过滤课程
              const filteredCourses = selectedCoach 
                ? coursesForDay.filter((course: ScheduleCourseInfo) => course.coachName === selectedCoach)
                : coursesForDay;
              
              return (
                <div key={`${timeSlot}-${day}`} className="schedule-cell">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course: ScheduleCourseInfo, index: number) => 
                      renderCourseInfo(course)
                    )
                  ) : (
                    <div style={{ 
                      color: '#ccc', 
                      textAlign: 'center', 
                      padding: '20px 0',
                      fontSize: '12px'
                    }}>
                      {selectedCoach ? '无此教练课程' : '空闲'}
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