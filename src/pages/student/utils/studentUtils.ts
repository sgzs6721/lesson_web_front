import { Student, CourseSummary } from '../types/student';

/**
 * 获取学生所有课程信息
 * @param student 学生信息
 * @returns 课程概要数组
 */
export function getStudentAllCourses(student: Student): CourseSummary[] {
  if (!student) return [];
  
  // 从courses字段生成课程概要
  if (student.courses && Array.isArray(student.courses) && student.courses.length > 0) {
    return student.courses.map(course => ({
      id: String(course.courseId),
      name: course.courseName || '未知课程',
      type: course.courseTypeName || '未知类型',
      coach: course.coachName || '未知教练',
      status: course.status || 'normal',
      enrollDate: course.enrollmentDate || student.enrollDate || '',
      expireDate: course.endDate || student.expireDate || '',
      remainingClasses: course.remainingHours ? `${course.remainingHours}/未知` : '未知'
    }));
  }
  
  // 如果没有详细的课程信息，但有课程ID，创建一个默认概要
  if (student.courseId) {
    return [{
      id: String(student.courseId),
      name: student.course instanceof Array ? student.course[0] : student.course,
      type: student.courseType || '未知类型',
      coach: student.coach || '未知教练',
      status: student.status || 'normal',
      enrollDate: student.enrollDate || '',
      expireDate: student.expireDate || '',
      remainingClasses: student.remainingClasses || '未知'
    }];
  }
  
  // 如果无法获取课程信息，返回空数组
  return [];
} 