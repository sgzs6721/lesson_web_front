import React from 'react';
import { ScheduleCell, Student } from '../types/schedule';

interface ScheduleGridProps {
  cells: ScheduleCell[];
  isEditMode: boolean;
  onDragStart: (e: React.DragEvent, student: Student, cellId: string) => void;
  onDragOver: (e: React.DragEvent, cellId: string) => void;
  onDrop: (e: React.DragEvent, targetCellId: string) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  cells,
  isEditMode,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const timeSlots = ['9:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];

  // 对同一单元格中的学生按照分组进行处理
  const renderStudents = (cell: ScheduleCell) => {
    // 从学生列表中提取所有的分组
    const groups: { [key: string]: Student[] } = {};
    const noGroupStudents: Student[] = [];

    cell.students.forEach(student => {
      if (student.groupId) {
        if (!groups[student.groupId]) {
          groups[student.groupId] = [];
        }
        groups[student.groupId].push(student);
      } else {
        noGroupStudents.push(student);
      }
    });

    return (
      <>
        {/* 渲染分组的学生 */}
        {Object.entries(groups).map(([groupId, students]) => {
          // 只有当分组中有多个学生时才使用分组样式
          if (students.length > 1) {
            // 对组中的第一个学生使用 onDragStart
            const firstStudent = students[0];
            return (
              <div 
                key={groupId} 
                className={`student-group coach-${cell.coachId}`} 
                draggable={isEditMode}
                onDragStart={isEditMode ? (e) => onDragStart(e, firstStudent, cell.id) : undefined}
              >
                {students.map((student, index) => (
                  <div
                    key={student.id}
                    className={`student-info ${index === 0 ? 'group-first' : index === students.length - 1 ? 'group-last' : 'group-middle'}`}
                  >
                    <div className="name">{student.name}</div>
                    <div className="details">
                      剩余课时: {student.remainingClasses}/{student.totalClasses} | 单价: ¥{student.pricePerClass}
                    </div>
                    <div className="details course-info">
                      {student.courseTypeName} | {student.courseName}
                    </div>
                  </div>
                ))}
              </div>
            );
          } else {
            // 单个学生的分组仍然当做普通学生处理
            return students.map(student => (
              <div
                key={student.id}
                className={`student-info coach-${cell.coachId}`}
                draggable={isEditMode}
                onDragStart={isEditMode ? (e) => onDragStart(e, student, cell.id) : undefined}
              >
                <div className="name">{student.name}</div>
                <div className="details">
                  剩余课时: {student.remainingClasses}/{student.totalClasses} | 单价: ¥{student.pricePerClass}
                </div>
                <div className="details course-info">
                  {student.courseTypeName} | {student.courseName}
                </div>
              </div>
            ));
          }
        })}

        {/* 渲染没有分组的学生 */}
        {noGroupStudents.map(student => (
          <div
            key={student.id}
            className={`student-info coach-${cell.coachId}`}
            draggable={isEditMode}
            onDragStart={isEditMode ? (e) => onDragStart(e, student, cell.id) : undefined}
          >
            <div className="name">{student.name}</div>
            <div className="details">
              剩余课时: {student.remainingClasses}/{student.totalClasses} | 单价: ¥{student.pricePerClass}
            </div>
            <div className="details course-info">
              {student.courseTypeName} | {student.courseName}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="schedule">
      {/* 表头 */}
      <div className="schedule-header">时间段</div>
      {weekdays.map(weekday => (
        <div key={weekday} className="schedule-header">
          {weekday}
        </div>
      ))}

      {/* 课表内容 */}
      {timeSlots.map(timeSlot => (
        <React.Fragment key={timeSlot}>
          <div className="schedule-time">{timeSlot}</div>
          {weekdays.map(weekday => {
            const cell = cells.find(
              c => c.timeSlot === timeSlot && c.weekday === weekday
            );
            return (
              <div
                key={`${timeSlot}-${weekday}`}
                className={`schedule-cell ${isEditMode ? 'draggable' : ''}`}
                data-cell-id={cell?.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (cell) onDragOver(e, cell.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (cell) onDrop(e, cell.id);
                }}
              >
                {cell && renderStudents(cell)}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ScheduleGrid; 