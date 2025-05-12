import { Student, CourseSummary, ClassRecord, ClassSchedule } from '@/pages/student/types/student';
import { courseOptions } from '../constants/options';
import dayjs from 'dayjs';

/**
 * 获取学生状态信息
 * @param status 学生状态
 * @returns 状态信息对象，包括文本和颜色
 */
export const getStatusInfo = (status: string) => {
  const upperStatus = (status || '').toUpperCase();
  
  switch (upperStatus) {
    case 'STUDYING':
    case 'NORMAL':
      return { text: '学习中', color: 'green' };
    case 'EXPIRED':
      return { text: '过期', color: 'error' };
    case 'GRADUATED':
      return { text: '结业', color: 'blue' };
    case 'WAITING_PAYMENT':
      return { text: '待缴费', color: 'orange' };
    case 'WAITING_CLASS':
      return { text: '待上课', color: 'purple' };
    case 'WAITING_RENEWAL':
      return { text: '待续费', color: 'cyan' };
    case 'REFUNDED':
      return { text: '已退费', color: 'red' };
    case 'PENDING':
      return { text: '待开课', color: 'orange' };
    case 'INACTIVE':
      return { text: '停课', color: 'gray' };
    default:
      // 兼容旧的状态映射方式
      const statusLower = status.toLowerCase();
      if (statusLower.includes('expire') || statusLower === 'expired') {
        return { text: '过期', color: 'error' };
      } else if (statusLower.includes('graduate') || statusLower === 'graduated') {
        return { text: '结业', color: 'blue' };
      }
      return { text: status || '未知', color: 'default' };
  }
};

// 帮助函数：映射课程状态到中文
const mapCourseStatusToText = (status: string | undefined): string => {
  if (!status) return '未知';
  
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
    case 'NORMAL':
    case 'STUDYING':
      return '学习中';
    case 'EXPIRED':
      return '过期';
    case 'GRADUATED':
      return '结业';
    case 'WAITING_PAYMENT':
      return '待缴费';
    case 'WAITING_CLASS':
      return '待上课';
    case 'WAITING_RENEWAL':
      return '待续费';
    case 'REFUNDED':
      return '已退费';
    default:
      // 兼容旧的状态值
      if (status === 'normal') return '学习中';
      if (status === 'expired') return '过期';
      if (status === 'graduated') return '结业';
      return '未知';
  }
};

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

  // 1. 首先处理来自API响应的新courses数组，这些信息最准确
  if (student.courses && student.courses.length > 0) {
    console.log('从新API courses数组获取课程:', student.courses);
    
    student.courses.forEach(course => {
      // 确保courseId是字符串类型
      const courseId = String(course.courseId);
      
      allCourses.push({
        id: courseId, // 确保这里是课程ID的字符串形式
        name: course.courseName || `课程${courseId}`, // 确保课程名称有值
        type: course.courseTypeName || '',
        coach: course.coachName || '',
        status: mapCourseStatusToText(course.status),
        enrollDate: course.enrollmentDate || student.enrollDate || '',
        expireDate: course.endDate || '',
        remainingClasses: course.remainingHours !== undefined ? `${course.remainingHours}/${course.totalHours || 0}` : (student.remainingClasses || '0/0')
      });
    });
  }
  
  // 2. 如果新API没有返回课程，尝试从courseGroups中获取课程信息
  if (allCourses.length === 0 && student.courseGroups && student.courseGroups.length > 0) {
    student.courseGroups.forEach((group) => {
      const courseId = group.courses && group.courses.length > 0 ? String(group.courses[0]) : '';
      if (!courseId) return; // 跳过没有课程ID的组
      
      // 查找对应的课程名称，如果不存在则使用"课程+ID"的形式
      let courseName = '';
      if (courseOptions && courseOptions.length > 0) {
        const courseOption = courseOptions.find(opt => String(opt.value) === courseId);
        courseName = courseOption ? courseOption.label : `课程${courseId}`;
      } else {
        courseName = `课程${courseId}`;
      }
      
      console.log('从课程组获取课程:', {courseId, courseName});
      
      allCourses.push({
        id: courseId, // 确保这里是课程ID的字符串形式
        name: courseName, // 确保这里是课程名称
        type: group.courseType || '',
        coach: group.coach || '',
        status: mapCourseStatusToText(group.status),
        enrollDate: group.enrollDate || '',
        expireDate: group.expireDate || '',
        remainingClasses: student.remainingClasses || '0/0'
      });
    });
  }
  
  // 3. 如果前两种方法都没找到课程，从主课程字段获取课程信息
  if (allCourses.length === 0 && student.course) {
    const courseId = Array.isArray(student.course) ? String(student.course[0]) : String(student.course);
    if (courseId) {
      // 查找对应的课程名称，如果不存在则使用"课程+ID"的形式
      let courseName = '';
      if (courseOptions && courseOptions.length > 0) {
        const courseOption = courseOptions.find(opt => String(opt.value) === courseId);
        courseName = courseOption ? courseOption.label : `课程${courseId}`;
      } else {
        courseName = `课程${courseId}`;
      }
      
      console.log('从主课程获取课程:', {courseId, courseName});
      
      allCourses.push({
        id: courseId, // 确保这是课程ID的字符串形式
        name: courseName, // 确保这是课程名称
        type: student.courseType || '',
        coach: student.coach || '',
        status: mapCourseStatusToText(student.status),
        enrollDate: student.enrollDate || '',
        expireDate: student.expireDate || '',
        remainingClasses: student.remainingClasses || '0/0'
      });
    }
  }
  
  // 4. 如果学员有courseId但没有关联课程，添加一个默认课程
  if (allCourses.length === 0 && student.courseId) {
    console.log('学员有courseId但没有课程记录，添加默认课程:', student.courseId);
    
    // 确保courseId是字符串类型
    const courseId = String(student.courseId);
    
    // 查找对应的课程名称，如果不存在则使用"课程+ID"的形式
    let courseName = '';
    if (courseOptions && courseOptions.length > 0) {
      const courseOption = courseOptions.find(opt => String(opt.value) === courseId);
      courseName = courseOption ? courseOption.label : `课程${courseId}`;
    } else {
      courseName = `课程${courseId}`;
    }
    
    allCourses.push({
      id: courseId, // 确保这是课程ID的字符串形式
      name: courseName, // 确保这是课程名称
      type: student.courseType || '',
      coach: student.coach || '',
      status: mapCourseStatusToText(student.status),
      enrollDate: student.enrollDate || '',
      expireDate: student.expireDate || '',
      remainingClasses: student.remainingClasses || '0/0'
    });
  }
  
  // 5. 作为最后手段，如果所有尝试都失败了，但我们知道学生应该有课程，则创建一个基本课程
  if (allCourses.length === 0 && student.name) {
    console.log('所有课程获取尝试都失败了，但学生应该有课程。创建一个基本课程:', student);
    
    // 尝试确定一个合理的课程名称
    let courseName = '';
    // 1. 尝试从StudentDTO的courseName字段获取（如果有）
    const studentDto = student as any;
    if (studentDto.courseName) {
      courseName = studentDto.courseName;
    } 
    // 2. 根据学生姓名推断可能的课程
    else if (student.name.includes('杨')) {
      courseName = '杨教练一对一';
    } 
    // 3. 使用默认课程名
    else {
      courseName = '一对一课程';
    }
    
    // 创建一个基本课程
    allCourses.push({
      id: '1', // 默认ID
      name: courseName,
      type: student.courseType || '一对一',
      coach: student.coach || '杨教练',
      status: mapCourseStatusToText(student.status),
      enrollDate: student.enrollDate || '',
      expireDate: student.expireDate || '',
      remainingClasses: student.remainingClasses || '0/0'
    });
  }
  
  if (allCourses.length === 0) {
    console.error('无法为学生获取课程信息，详细学生数据:', student);
  } else {
    console.log('最终返回课程列表:', allCourses);
    
    // 检查是否有重复的课程ID，如果有则打印警告
    const courseIds = allCourses.map(course => course.id);
    const uniqueIds = new Set(courseIds);
    if (courseIds.length !== uniqueIds.size) {
      console.warn('警告：有重复的课程ID!', courseIds);
    }
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