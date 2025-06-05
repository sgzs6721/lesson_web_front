import React from 'react';
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
    
    // 处理学生姓名显示
    const renderStudentNames = () => {
      const students = course.studentName ? course.studentName.split(',') : [];
      
      if (students.length <= 2) {
        // 1-2个学生，学员名字和标签第一行居中，剩余课时第二行
        const studentList = students.map(student => student.trim()).join(', ');
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '16px' }}>
                {studentList}
              </span>
              <Tag color={getTypeTagColor(course.courseType)} style={{ margin: 0 }}>{course.courseType}</Tag>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#999', fontSize: '12px' }}>
                剩余{formatHours(course.remainHours)}/{formatHours(course.totalHours)}课时
              </span>
            </div>
          </div>
        );
      } else {
        // 3个以上学生，用逗号分隔，hover显示详情
        const studentList = students.map(student => student.trim()).join(', ');
        const hoverContent = students.map(student => 
          `${student.trim()} - 剩余${formatHours(course.remainHours)}/${formatHours(course.totalHours)}课时`
        ).join('\n');
        
        return (
          <div title={hoverContent} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '16px' }}>
                {studentList}
              </span>
              <Tag color={getTypeTagColor(course.courseType)} style={{ margin: 0 }}>{course.courseType}</Tag>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#999', fontSize: '12px' }}>
                剩余{formatHours(course.remainHours)}/{formatHours(course.totalHours)}课时
              </span>
            </div>
          </div>
        );
      }
    };
    
    return (
      <div className={`student-info ${getCoachClass(course.coachId)}`} style={{ borderLeft: `3px solid ${coachColor}` }}>
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