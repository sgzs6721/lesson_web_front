import { useState, useCallback } from 'react';
import { Form, message } from 'antd';
import { Student, CourseGroup, ScheduleTime } from '@/pages/student/types/student';
import { SimpleCourse } from '@/api/course/types';
import dayjs from 'dayjs';

// Mock courses for testing
// 模拟简单课程数据，当API未提供时使用
const mockSimpleCourses: SimpleCourse[] = [
  {
    id: 'basketball',
    name: '篮球训练',
    status: 'PUBLISHED',
    typeName: '团体课',
    coaches: [{ id: 1, name: '张教练' }]
  },
  {
    id: 'swimming',
    name: '游泳课程',
    status: 'PUBLISHED',
    typeName: '团体课',
    coaches: [{ id: 2, name: '李教练' }]
  },
  {
    id: 'tennis',
    name: '网球培训',
    status: 'PUBLISHED',
    typeName: '一对一',
    coaches: [{ id: 3, name: '王教练' }]
  },
];

// Helper function to map frontend status to API status
const mapStatusToApi = (status: string | undefined): string => {
  switch (status) {
    case 'NORMAL':
      return 'NORMAL';
    case 'EXPIRED':
      return 'EXPIRED';
    case 'GRADUATED':
      return 'GRADUATED';
    // 兼容旧的状态值
    case 'active':
    case 'normal':
      return 'NORMAL';
    case 'expired':
      return 'EXPIRED';
    case 'graduated':
      return 'GRADUATED';
    default:
      return 'NORMAL'; // 默认值
  }
};

// Helper function to map API status to frontend status
const mapApiStatusToFrontend = (status: string | undefined): string => {
  switch (status) {
    case 'NORMAL':
      return 'NORMAL';
    case 'EXPIRED':
      return 'EXPIRED';
    case 'GRADUATED':
      return 'GRADUATED';
    case 'STUDYING':
      return 'NORMAL'; // 将 STUDYING 映射为 NORMAL
    // 兼容旧的状态值
    case 'normal':
      return 'NORMAL';
    case 'expired':
      return 'EXPIRED';
    case 'graduated':
      return 'GRADUATED';
    default:
      return 'NORMAL'; // 默认值
  }
};

// Helper function to map API gender to frontend gender
const mapApiGenderToFrontend = (gender: string | undefined): string => {
  switch (gender) {
    case 'MALE':
      return 'male';
    case 'FEMALE':
      return 'female';
    default:
      return 'male'; // 默认值
  }
};

// 辅助函数：安全地处理课程ID，保留字符串类型的ID
const safeProcessCourseId = (id: string | number): string | number => {
  if (typeof id === 'string' && id.trim() !== '') {
    // 如果是非空字符串，尝试转换为数字，但如果不是有效数字则保留原始字符串
    const num = Number(id);
    return isNaN(num) ? id : num;
  } else if (typeof id === 'number' && !isNaN(id)) {
    // 如果已经是有效数字，直接返回
    return id;
  }
  // 默认返回空字符串
  return '';
};

// 辅助函数：灵活匹配课程ID
const findCourseById = (courseList: SimpleCourse[], courseId: string | number): SimpleCourse | undefined => {
  console.log('查找课程ID:', courseId, '类型:', typeof courseId);

  if (!courseId || !courseList || courseList.length === 0) {
    console.log('课程ID或课程列表为空');
    return undefined;
  }

  // 尝试多种匹配方式
  const course = courseList.find(c => {
    const courseIdStr = String(courseId).trim();
    const listIdStr = String(c.id).trim();

    // 尝试多种匹配方式
    const exactMatch = courseIdStr === listIdStr;
    const numericMatch = !isNaN(Number(courseIdStr)) && !isNaN(Number(listIdStr)) &&
                         Number(courseIdStr) === Number(listIdStr);
    const includesMatch = courseIdStr.includes(listIdStr) || listIdStr.includes(courseIdStr);

    if (exactMatch) console.log('找到精确匹配:', c.name, '(ID:', c.id, ')');
    else if (numericMatch) console.log('找到数值匹配:', c.name, '(ID:', c.id, ')');
    else if (includesMatch) console.log('找到包含匹配:', c.name, '(ID:', c.id, ')');

    return exactMatch || numericMatch || includesMatch;
  });

  // 如果没有找到匹配，尝试通过名称匹配
  if (!course && typeof courseId === 'string') {
    const courseByName = courseList.find(c =>
      c.name && typeof c.name === 'string' &&
      c.name.includes(courseId) || courseId.includes(c.name)
    );

    if (courseByName) {
      console.log('通过名称找到匹配课程:', courseByName.name, '(ID:', courseByName.id, ')');
      return courseByName;
    }
  }

  if (course) {
    console.log('成功匹配到课程:', course.name, '(ID:', course.id, ')');
  } else {
    console.log('未找到匹配的课程');
  }

  return course;
};

// Helper function to convert Chinese weekday to number (1-7)
const mapWeekdayToNumber = (weekday: string): number | undefined => {
  const map: { [key: string]: number } = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7,
    '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6, '周日': 7,
    '星期一': 1, '星期二': 2, '星期三': 3, '星期四': 4, '星期五': 5, '星期六': 6, '星期日': 7
  };
  // Also handle if it's already a number or a string number
  const num = Number(weekday);
  if (!isNaN(num) && num >= 1 && num <= 7) {
    return num;
  }
  return map[weekday];
};

export const useStudentForm = (
  onAddStudent: (payload: { studentInfo: any; courseInfoList: any[] }) => Promise<Student>,
  onUpdateStudent: (id: string, student: any) => Promise<void>,
  courseList: SimpleCourse[]
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
  const [tempCourseGroup, setTempCourseGroup] = useState<CourseGroup | null>(null);
  const [currentEditingGroupIndex, setCurrentEditingGroupIndex] = useState<number | null>(null);
  const [originalCourseGroup, setOriginalCourseGroup] = useState<CourseGroup | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 显示添加学员模态框
  const showAddModal = () => {
    form.resetFields();
    setEditingStudent(null);
    setVisible(true);
    setCourseGroups([]);
    setCurrentEditingGroupIndex(null);
    setTempCourseGroup(null);
    setOriginalCourseGroup(null);
    setIsEditing(false);
  };

  // 显示编辑学员模态框
  const showEditModal = (student: Student) => {
    // 将API枚举值映射为前端显示值
    const mappedStudent = {
      ...student,
      gender: mapApiGenderToFrontend(student.gender), // 将 MALE/FEMALE 映射为 male/female
      status: mapApiStatusToFrontend(student.status), // 将后端状态映射为前端状态
      ...(student.expireDate && { expireDate: dayjs(student.expireDate) }),
      ...(student.enrollDate && { enrollDate: dayjs(student.enrollDate) }),
    };

    console.log('Mapped student for edit:', mappedStudent);
    console.log('Student scheduleTimes:', student.scheduleTimes);
    console.log('Student courses:', student.courses);

    form.setFieldsValue(mappedStudent);

    setEditingStudent(student);
    setVisible(true);
    
    // 优先使用新的courses结构（API返回的数据）
    if (student.courses && student.courses.length > 0) {
      console.log('使用student.courses数组创建课程组');
      const newCourseGroups: CourseGroup[] = student.courses.map((course, index) => {
        // 解析固定排课时间字符串（如果有的话）
        let scheduleTimes: ScheduleTime[] = [];
        if (course.fixedSchedule) {
          try {
            const scheduleData = JSON.parse(course.fixedSchedule);
            scheduleTimes = scheduleData.map((schedule: any) => {
              // 将数字weekday转换为中文周几
              let weekday = schedule.weekday;
              // 如果weekday是数字（1-7），转换为对应的中文
              if (/^[1-7]$/.test(String(weekday))) {
                // 1-7 对应 周一到周日
                const weekdayMap = ['', '一', '二', '三', '四', '五', '六', '日'];
                weekday = weekdayMap[Number(weekday)];
              }
              
              return {
                weekday: weekday,
                time: schedule.from,
                endTime: schedule.to
              };
            });
          } catch (e) {
            console.error('解析固定排课时间失败:', e);
          }
        }

        // 将API状态值映射为UI使用的状态值
        const statusValue = mapApiStatusToFrontend(course.status);

        return {
          key: `course-${index}-${course.courseId || course.studentCourseId}`,
          courses: [course.courseId?.toString() || ''],
          courseType: course.courseTypeName || '',
          coach: course.coachName || '',
          status: statusValue as 'normal' | 'expired' | 'graduated' | 'STUDYING' | '',
          enrollDate: course.enrollmentDate || '',
          expireDate: course.endDate || '',
          scheduleTimes: scheduleTimes
        };
      });
      setCourseGroups(newCourseGroups);
    } else if (student.courseGroups && student.courseGroups.length > 0) {
      setCourseGroups(student.courseGroups);
    } else if (student.course) {
      // 确保scheduleTimes存在且格式正确
      let scheduleTimes = student.scheduleTimes || [];

      // 如果scheduleTimes为空，但我们知道这是从API获取的学生数据，可能需要记录日志
      if (scheduleTimes.length === 0) {
        console.log('学生没有固定排课时间或解析失败:', student.id);
      }

      const courseGroup = {
        key: '1',
        courses: Array.isArray(student.course) ? student.course : [student.course],
        courseType: student.courseType ?? '',
        coach: student.coach,
        status: student.status,
        enrollDate: student.enrollDate,
        expireDate: student.expireDate ?? '',
        scheduleTimes: scheduleTimes
      };

      console.log('创建课程组:', courseGroup);
      setCourseGroups([courseGroup]);
    } else {
      setCourseGroups([]);
    }

    setCurrentEditingGroupIndex(null);
    setTempCourseGroup(null);
    setOriginalCourseGroup(null);
    setIsEditing(false);
  };

  // 处理表单提交 - Rebuild nested structure for /api/student/create
  const handleSubmit = async (): Promise<boolean> => {
    try {
      setLoading(true);
      // 1. 首先验证基本信息表单
      const values = await form.validateFields();
      console.log('基本信息验证通过:', values);

      // 2. 检查是否添加了至少一个课程（在基础信息验证通过后）
      if (!courseGroups || courseGroups.length === 0) {
        message.error('请至少添加一个课程');
        setLoading(false);
        return false; // 验证失败，阻止提交
      }
      
      // 3. 检查是否有未确认的课程组（临时课程或正在编辑的课程）
      if (tempCourseGroup) {
        message.error('您有未确认添加的课程，请先确认或取消。');
        setLoading(false);
        return false;
      }
      if (currentEditingGroupIndex !== null) {
        message.error('您有未确认编辑的课程，请先确认或取消。');
        setLoading(false);
        return false;
      }

      // 准备提交的数据
      const studentInfo = {
        ...values,
        age: Number(values.age), // 确保年龄是数字
        gender: values.gender === 'male' ? 'MALE' : 'FEMALE',
      };

      const courseInfoList = courseGroups.map(group => {
        let scheduleData: any[] = [];
        if (group.scheduleTimes && group.scheduleTimes.length > 0) {
          scheduleData = group.scheduleTimes.map(st => ({
            weekday: mapWeekdayToNumber(st.weekday), // Convert Chinese weekday to number
            from: st.time,
            to: st.endTime
          }));
        }

        return {
          courseId: safeProcessCourseId(group.courses[0]),
          status: mapStatusToApi(group.status),
          enrollDate: group.enrollDate ? dayjs(group.enrollDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
          fixedSchedule: JSON.stringify(scheduleData) // 将排课时间转换为JSON字符串
        };
      });

      console.log('准备提交的数据:', { studentInfo, courseInfoList });

      // 根据是编辑还是添加调用不同的回调函数
      if (editingStudent) {
        await onUpdateStudent(editingStudent.id, { ...studentInfo, id: editingStudent.id, courseInfoList });
        message.success('学员信息更新成功');
      } else {
        await onAddStudent({ studentInfo, courseInfoList });
        message.success('学员添加成功');
      }

      setVisible(false);
      return true; // 提交成功
    } catch (errorInfo) {
      console.log('表单验证或提交失败:', errorInfo);
      message.error('请检查表单信息是否填写完整且正确');
      return false; // 提交失败
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setEditingStudent(null);
    setCourseGroups([]);
    setCurrentEditingGroupIndex(null);
    setTempCourseGroup(null);
    setOriginalCourseGroup(null);
    setIsEditing(false);
  };

  // 开始添加课程组 (不直接添加，而是准备临时组)
  const startAddCourseGroup = () => {
    if (tempCourseGroup !== null || currentEditingGroupIndex !== null) {
      message.warning('请先完成当前的课程编辑或添加');
      return false;
    }

    const newKey = Date.now().toString();
    // 明确指定 newGroup 的类型为 CourseGroup
    const newGroup: CourseGroup = {
      key: newKey,
      courses: [],
      courseType: '',
      coach: '',
      status: '' as any, // <--- 使用类型断言强制让空字符串通过类型检查
      enrollDate: dayjs().format('YYYY-MM-DD'),
      expireDate: dayjs().add(6, 'month').format('YYYY-MM-DD'), // 保留默认有效期设置
      scheduleTimes: []
    };

    setTempCourseGroup(newGroup);
    setIsEditing(true);
    return true;
  };

  // 更新临时课程组
  const updateTempCourseGroup = useCallback((field: keyof CourseGroup, value: any) => {
    setTempCourseGroup(prevGroup => {
      if (!prevGroup) return null;
      return { ...prevGroup, [field]: value };
    });
  }, []);

  // 更新已存在的课程组
  const updateCourseGroup = (index: number, field: keyof CourseGroup, value: any) => {
    setCourseGroups(prevGroups => {
      const updated = [...prevGroups];
      if (index >= 0 && index < updated.length) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  // 进入编辑现有课程组的状态
  const editCourseGroup = (index: number): boolean => {
    if (tempCourseGroup !== null || currentEditingGroupIndex !== null) {
      message.warning('请先完成当前的课程编辑或添加');
      return false;
    }
    if (index < 0 || index >= courseGroups.length) {
      message.error('无效的课程组索引');
      return false;
    }

    const groupToEdit = courseGroups[index];
    setCurrentEditingGroupIndex(index);
    setOriginalCourseGroup({ ...groupToEdit });
    setIsEditing(true);
    return true;
  };

  // 确认添加/编辑课程组 - Crucial for state management
  const confirmAddCourseGroup = (): boolean => {
    if (currentEditingGroupIndex !== null) {
      const group = courseGroups[currentEditingGroupIndex];
      if (!group.courses || group.courses.length === 0 || !group.enrollDate) {
        message.error('请确保课程和报名日期已填写');
        return false;
      }
      setCurrentEditingGroupIndex(null);
      setOriginalCourseGroup(null);
      setIsEditing(false);
      message.success('课程编辑已确认');
      return true;
    }
    else if (tempCourseGroup) {
      if (!tempCourseGroup.courses || tempCourseGroup.courses.length === 0 || !tempCourseGroup.enrollDate) {
        message.error('请确保课程和报名日期已填写');
        return false;
      }
      setCourseGroups(prevGroups => [...prevGroups, tempCourseGroup]);
      setTempCourseGroup(null);
      setIsEditing(false);
      message.success('课程添加已确认');
      return true;
    }
    message.error('无法确认课程组，状态异常');
    return false;
  };

  // 取消添加/编辑课程组
  const cancelAddCourseGroup = () => {
    if (currentEditingGroupIndex !== null && originalCourseGroup) {
      setCourseGroups(prevGroups => {
        const updated = [...prevGroups];
        updated[currentEditingGroupIndex] = originalCourseGroup;
        return updated;
      });
    }
    setCurrentEditingGroupIndex(null);
    setTempCourseGroup(null);
    setOriginalCourseGroup(null);
    setIsEditing(false);
  };

  // 删除课程组
  const removeCourseGroup = (key: string) => {
    setCourseGroups(prevGroups => prevGroups.filter(group => group.key !== key));
    message.success('课程已删除');
    if (currentEditingGroupIndex !== null && courseGroups[currentEditingGroupIndex]?.key === key) {
      setCurrentEditingGroupIndex(null);
      setOriginalCourseGroup(null);
      setIsEditing(false);
    }
  };

  return {
    form,
    visible,
    loading,
    editingStudent,
    courseGroups,
    tempCourseGroup,
    currentEditingGroupIndex,
    originalCourseGroup,
    isEditing,
    showAddModal,
    showEditModal,
    handleSubmit,
    handleCancel,
    startAddCourseGroup,
    updateTempCourseGroup,
    updateCourseGroup,
    confirmAddCourseGroup,
    cancelAddCourseGroup,
    editCourseGroup,
    removeCourseGroup
  };
};
