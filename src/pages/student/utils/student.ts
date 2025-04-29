import { Student, CourseSummary, ClassRecord, ClassSchedule } from '@/pages/student/types/student';
import { courseOptions } from '../constants/options';
import dayjs from 'dayjs';

/**
 * 获取学生所有已报名的课程
 * @param student 学生对象
 * @returns 课程摘要数组
 */
export const getStudentAllCourses = (student: Student | null): CourseSummary[] => {
  if (!student) return [];

  console.log('获取学员课程，学员数据:', JSON.stringify(student, null, 2));
  
  // 确保返回的课程对象中id和name正确区分
  const allCourses: CourseSummary[] = [];

  if (student.courseGroups && student.courseGroups.length > 0) {
    student.courseGroups.forEach((group) => {
      const courseId = group.courses && group.courses.length > 0 ? group.courses[0] : '';
      
      // 查找对应的课程名称，如果不存在则使用"课程+ID"的形式
      let courseName = '';
      if (courseOptions && courseOptions.length > 0) {
        const courseOption = courseOptions.find(opt => String(opt.value) === String(courseId));
        courseName = courseOption ? courseOption.label : `${courseId}`;
      } else {
        courseName = `${courseId}`;
      }
      
      console.log('从课程组获取课程:', {courseId, courseName});
      
      allCourses.push({
        id: courseId, // 确保这里是课程ID
        name: courseName, // 确保这里是课程名称
        type: group.courseType,
        coach: group.coach,
        status: group.status === 'normal' ? '在学' :
               group.status === 'expired' ? '停课' :
               group.status === 'graduated' ? '已毕业' :
               group.status === 'STUDYING' ? '在学' : '待处理',
        enrollDate: group.enrollDate,
        expireDate: group.expireDate,
        remainingClasses: student.remainingClasses
      });
    });
  }
  
  // 主课程
  if (student.course) {
    const courseId = Array.isArray(student.course) ? student.course[0] : student.course;
    
    // 查找对应的课程名称，如果不存在则使用"课程+ID"的形式
    let courseName = '';
    if (courseOptions && courseOptions.length > 0) {
      const courseOption = courseOptions.find(opt => String(opt.value) === String(courseId));
      courseName = courseOption ? courseOption.label : `${courseId}`;
    } else {
      courseName = `${courseId}`;
    }
    
    console.log('从主课程获取课程:', {courseId, courseName});
    
    allCourses.push({
      id: courseId, // 确保这是课程ID
      name: courseName, // 确保这是课程名称
      type: student.courseType || '',
      coach: student.coach,
      status: student.status === 'normal' ? '在学' :
              student.status === 'expired' ? '停课' :
              student.status === 'graduated' ? '已毕业' :
              student.status === 'STUDYING' ? '在学' : '待处理',
      enrollDate: student.enrollDate,
      expireDate: student.expireDate || '',
      remainingClasses: student.remainingClasses
    });
  }
  
  // 如果学员有courseId但没有关联课程，添加一个默认课程
  if (student.courseId && allCourses.length === 0) {
    console.log('学员有courseId但没有课程记录，添加默认课程:', student.courseId);
    
    // 确保courseId是字符串类型
    const courseId = String(student.courseId);
    
    // 查找对应的课程名称，如果不存在则使用"课程+ID"的形式
    let courseName = '';
    if (courseOptions && courseOptions.length > 0) {
      const courseOption = courseOptions.find(opt => String(opt.value) === courseId);
      courseName = courseOption ? courseOption.label : `${courseId}`;
    } else {
      courseName = `${courseId}`;
    }
    
    allCourses.push({
      id: courseId, // 确保这是课程ID
      name: courseName, // 确保这是课程名称
      type: student.courseType || '',
      coach: student.coach || '',
      status: student.status === 'normal' ? '在学' : '在学',
      enrollDate: student.enrollDate || '',
      expireDate: student.expireDate || '',
      remainingClasses: student.remainingClasses
    });
  }
  
  console.log('最终返回课程列表:', allCourses);
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
      status: 'COMPLETED'
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
      status: 'UPCOMING'
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
    status: 'CANCELED'
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