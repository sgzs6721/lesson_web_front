import { Student, CourseSummary, ClassSchedule, ClassRecord } from '../types/student';
import { courseOptions } from '../constants/options';
import dayjs from 'dayjs';

/**
 * 获取学生所有已报名的课程
 * @param student 学生对象
 * @returns 课程摘要数组
 */
export const getStudentAllCourses = (student: Student | null): CourseSummary[] => {
  if (!student) return [];

  // 创建一个包含所有课程的数组
  const allCourses: CourseSummary[] = [];

  // 如果学员有多个课程组，将其添加到课程列表中
  if (student.courseGroups && student.courseGroups.length > 0) {
    student.courseGroups.forEach((group) => {
      const courseId = group.courses && group.courses.length > 0 ? group.courses[0] : '';
      const courseName = courseId 
        ? courseOptions.find(c => c.value === courseId)?.label || courseId
        : '未知课程';
      
      allCourses.push({
        id: courseId,
        name: courseName,
        type: courseOptions.find(c => c.value === courseId)?.type || group.courseType,
        coach: group.coach,
        status: group.status === 'active' ? '在学' : 
               group.status === 'inactive' ? '停课' : '待处理',
        enrollDate: group.enrollDate,
        expireDate: group.expireDate,
        remainingClasses: student.remainingClasses
      });
    });
  } else if (student.course) {
    // 如果只有一个主课程，添加到课程列表
    const courseId = Array.isArray(student.course) ? student.course[0] : student.course;
    const courseName = courseOptions.find(c => c.value === courseId)?.label || courseId;
    
    allCourses.push({
      id: courseId,
      name: courseName,
      type: courseOptions.find(c => c.value === courseId)?.type || student.courseType,
      coach: student.coach,
      status: student.status === 'active' ? '在学' : 
              student.status === 'inactive' ? '停课' : '待处理',
      enrollDate: student.enrollDate,
      expireDate: student.expireDate,
      remainingClasses: student.remainingClasses
    });
  }

  return allCourses;
};

/**
 * 根据关键词搜索学员
 * @param students 学员列表
 * @param keyword 搜索关键词
 * @param excludeId 排除的学员ID
 * @returns 匹配的学员列表
 */
export const searchStudentsByKeyword = (students: Student[], keyword: string, excludeId?: string): Student[] => {
  if (!keyword.trim()) return [];
  
  return students.filter(student => 
    (excludeId ? student.id !== excludeId : true) && 
    (
      student.name.toLowerCase().includes(keyword.toLowerCase()) ||
      student.id.toLowerCase().includes(keyword.toLowerCase()) ||
      student.phone.includes(keyword)
    )
  );
};

/**
 * 生成学员课表数据
 * @param student 学员
 * @returns 课表数据
 */
export const generateStudentSchedules = (student: Student): ClassSchedule[] => {
  const mockSchedules: ClassSchedule[] = [];
  const weekdayMap: Record<string, string> = {
    'Mon': '一',
    'Tue': '二',
    'Wed': '三',
    'Thu': '四',
    'Fri': '五',
    'Sat': '六',
    'Sun': '日'
  };
  
  // 获取主课程（如果是数组则取第一个）
  const mainCourse = Array.isArray(student.course) ? student.course[0] : student.course;
  
  // 生成过去的已完成课程
  for (let i = 1; i <= 3; i++) {
    const date = dayjs().subtract(i * 7, 'day');
    const weekdayEn = date.format('ddd');
    
    mockSchedules.push({
      date: date.format('YYYY-MM-DD'),
      weekday: weekdayMap[weekdayEn] || weekdayEn,
      startTime: '15:00',
      endTime: '16:30',
      courseName: courseOptions.find(c => c.value === mainCourse)?.label || mainCourse,
      coach: student.coach,
      status: 'completed'
    });
  }
  
  // 生成未来的即将到来的课程
  for (let i = 1; i <= 4; i++) {
    const date = dayjs().add(i * 7, 'day');
    const weekdayEn = date.format('ddd');
    
    mockSchedules.push({
      date: date.format('YYYY-MM-DD'),
      weekday: weekdayMap[weekdayEn] || weekdayEn,
      startTime: '15:00',
      endTime: '16:30',
      courseName: courseOptions.find(c => c.value === mainCourse)?.label || mainCourse,
      coach: student.coach,
      status: 'upcoming'
    });
  }
  
  // 添加一个取消的课程
  const cancelDate = dayjs().add(2, 'day');
  const cancelWeekdayEn = cancelDate.format('ddd');
  
  mockSchedules.push({
    date: cancelDate.format('YYYY-MM-DD'),
    weekday: weekdayMap[cancelWeekdayEn] || cancelWeekdayEn,
    startTime: '15:00',
    endTime: '16:30',
    courseName: courseOptions.find(c => c.value === mainCourse)?.label || mainCourse,
    coach: student.coach,
    status: 'canceled'
  });
  
  // 按日期排序
  return mockSchedules.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

/**
 * 生成学员课程记录
 * @param student 学员
 * @returns 课程记录列表
 */
export const generateClassRecords = (student: Student): ClassRecord[] => {
  const mockRecords: ClassRecord[] = [];
  
  // 获取主课程（如果是数组则取第一个）
  const mainCourse = Array.isArray(student.course) ? student.course[0] : student.course;
  
  // 生成过去10节课的记录
  const today = dayjs();
  
  for (let i = 0; i < 10; i++) {
    const date = today.subtract(i * 7, 'day').format('YYYY-MM-DD');
    
    mockRecords.push({
      id: i.toString(),
      date,
      startTime: '16:00',
      endTime: '17:00',
      courseName: courseOptions.find(c => c.value === mainCourse)?.label || '未知课程',
      coach: student.coach,
      content: `专项训练${i + 1}：${['基本功训练', '力量训练', '耐力训练', '技巧训练', '比赛模拟'][i % 5]}`,
      feedback: `学生表现${['优秀', '良好', '一般', '需要加强'][i % 4]}，${['积极参与课堂活动', '注意力有所提高', '技能有所进步', '需要更多练习'][i % 4]}`
    });
  }
  
  // 按日期排序，最新的排在前面
  return mockRecords.sort((a, b) => 
    dayjs(b.date).unix() - dayjs(a.date).unix()
  );
}; 