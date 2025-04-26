import { useState, useCallback } from 'react';
import { Form, message } from 'antd';
import { Student, CourseGroup, ScheduleTime as ApiScheduleTime } from '@/api/student/types';
import { ScheduleTime as UiScheduleTime } from '@/pages/student/types/student';
import { SimpleCourse } from '@/api/course/types';
import dayjs from 'dayjs';

// 导入模拟课程数据，用于备用
// 注意：这里的模拟数据应与 course/index.ts 中的保持一致
// 如果有变化，需要同步更新
// 这里复制一份是为了避免循环引用
// 实际开发中应考虑将模拟数据提取到单独文件
// 以便共享使用
const mockSimpleCourses: SimpleCourse[] = [
  { id: 'basketball', name: '篮球训练', typeName: '体育大类', status: 'PUBLISHED', coaches: [{ id: 1001, name: '王教练' }, { id: 1002, name: '李教练' }] },
  { id: 'swimming', name: '游泳课程', typeName: '体育小班', status: 'PUBLISHED', coaches: [{ id: 1003, name: '张教练' }] },
  { id: 'tennis', name: '网球培训', typeName: '体育一对一', status: 'PUBLISHED', coaches: [{ id: 1004, name: '赵教练' }] },
  { id: 'painting', name: '绘画班', typeName: '艺术启蒙', status: 'PUBLISHED', coaches: [{ id: 1005, name: '孙教练' }] },
  { id: 'piano', name: '钢琴培训', typeName: '艺术一对一', status: 'PUBLISHED', coaches: [{ id: 1006, name: '吴教练' }] },
  { id: 'dance', name: '舞蹈课程', typeName: '艺术形体', status: 'PUBLISHED', coaches: [{ id: 1007, name: '冯教练' }] },
  { id: 'math', name: '数学辅导', typeName: '学科培优', status: 'PUBLISHED', coaches: [{ id: 1008, name: '杨教练' }] },
  { id: 'english', name: '英语班', typeName: '语言提升', status: 'PUBLISHED', coaches: [{ id: 1009, name: '秦教练' }] },
];

// Helper function to map frontend status to API status
const mapStatusToApi = (status: string | undefined): string => {
  switch (status) {
    case 'active':
    case 'normal':
      return 'NORMAL';
    case 'inactive':
      return 'INACTIVE';
    case 'pending':
      return 'PENDING';
    // Add mapping for 'completed' if needed
    default:
      return 'NORMAL'; // Default or throw error
  }
};

// Helper function to map API status to frontend status
const mapApiStatusToFrontend = (status: string | undefined): string => {
  switch (status) {
    case 'NORMAL':
      return 'normal';
    case 'INACTIVE':
      return 'inactive';
    case 'PENDING':
      return 'pending';
    case 'STUDYING':
      return 'normal'; // 将 STUDYING 映射为 normal
    default:
      return 'normal'; // 默认值
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

export const useStudentForm = (
  onAddStudent: (payload: { studentInfo: any; courseInfo: any }) => Promise<Student>,
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

    form.setFieldsValue(mappedStudent);

    setEditingStudent(student);
    setVisible(true);

    if (student.courseGroups && student.courseGroups.length > 0) {
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
    if (currentEditingGroupIndex !== null) {
      message.warning('请先完成当前课程组的编辑');
      return false;
    }
    if (courseGroups.length === 0 && !tempCourseGroup) {
      message.error('请至少添加一个课程');
      return false;
    }
    if (tempCourseGroup) {
      const confirmed = confirmAddCourseGroup();
      if (!confirmed) {
        return false;
      }
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      const currentCourseGroups = tempCourseGroup ? courseGroups.concat([tempCourseGroup]) : courseGroups;
      if (currentCourseGroups.length === 0) {
        message.error('无法获取课程信息，请重试');
        setLoading(false);
        return false;
      }
      const primaryGroup = currentCourseGroups[0];

      try {
        if (editingStudent) {
          // --- EDITING EXISTING STUDENT (Nested Structure for /api/student/update) ---
          const selectedCourseId = primaryGroup.courses[0];
          console.log('选择的课程ID:', selectedCourseId);
          console.log('可用课程列表:', courseList);

          // 使用辅助函数尝试匹配课程
          console.log('课程ID类型:', typeof selectedCourseId, '值:', selectedCourseId);
          console.log('课程列表长度:', courseList.length);
          if (courseList.length > 0) {
            console.log('课程列表中的第一个ID类型:', typeof courseList[0].id, '值:', courseList[0].id);
          }

          // 使用辅助函数进行灵活匹配
          let selectedCourse = findCourseById(courseList, selectedCourseId);

          // 如果找不到课程，尝试使用模拟数据
          if (!selectedCourse && mockSimpleCourses) {
            console.log('在正常课程列表中找不到课程，尝试使用模拟数据');
            selectedCourse = findCourseById(mockSimpleCourses, selectedCourseId);
          }

          // 如果仍然找不到课程，但我们有课程ID，则创建一个虚拟课程对象
          if (!selectedCourse && selectedCourseId) {
            console.log('创建虚拟课程对象，使用ID:', selectedCourseId);
            selectedCourse = {
              id: selectedCourseId,
              name: `课程${selectedCourseId}`,
              typeName: '未知类型',
              status: 'PUBLISHED',
              coaches: [{ id: 1, name: primaryGroup.coach || '未知教练' }]
            };
          }

          // 如果仍然没有课程，则报错
          if (!selectedCourse) {
            message.error('无法获取课程信息，请重新选择课程');
            setLoading(false);
            return false;
          }

          let coachId = 0; // 默认教练ID

          if (selectedCourse && primaryGroup.coach) {
            console.log('找到课程:', selectedCourse);
            const coach = selectedCourse.coaches?.find(co => co.name === primaryGroup.coach);
            if (coach) {
              coachId = coach.id;
              console.log('找到教练:', coach);
            } else {
              // 如果找不到指定教练，使用第一个教练
              if (selectedCourse.coaches && selectedCourse.coaches.length > 0) {
                coachId = selectedCourse.coaches[0].id;
                console.log(`无法找到教练 '${primaryGroup.coach}'，使用第一个教练:`, selectedCourse.coaches[0]);
                message.warning(`无法找到课程 '${selectedCourse.name}' 下名为 '${primaryGroup.coach}' 的教练ID，将使用默认值。`);
              } else {
                console.log('课程没有教练信息，使用默认值 0');
                message.warning(`课程 '${selectedCourse.name}' 没有教练信息，将使用默认值。`);
              }
            }
          }

          // 准备学员信息
          const studentInfo = {
            name: values.name,
            gender: values.gender === 'male' ? 'MALE' : 'FEMALE',
            age: Number(values.age),
            phone: values.phone,
            campusId: 1, // TODO: 动态校区ID
            status: mapStatusToApi(values.status)
          };

          // 准备课程信息
          const courseInfo: any = {
            courseId: safeProcessCourseId(selectedCourse.id), // 使用找到的课程ID，保留字符串类型
            startDate: primaryGroup.enrollDate,
            endDate: primaryGroup.expireDate,
            coachId: coachId || 1, // 确保有教练ID
          };

          // 如果有排课时间，添加到请求中
          if (primaryGroup.scheduleTimes && primaryGroup.scheduleTimes.length > 0) {
            courseInfo.fixedScheduleTimes = primaryGroup.scheduleTimes.map(st => ({
              weekday: st.weekday,
              from: st.time,
              to: st.endTime || st.time
            }));
          }

          // 构建更新请求的payload
          const updatePayload = {
            studentId: editingStudent.studentId || Number(editingStudent.id),
            courseId: safeProcessCourseId(selectedCourse.id), // 使用找到的课程ID，保留字符串类型
            studentInfo,
            courseInfo
          };

          console.log("提交更新请求到 /lesson/api/student/update:", JSON.stringify(updatePayload, null, 2));

          // 检查是否有studentId，确保能正确更新
          if (!updatePayload.studentId) {
            message.error('无法获取学员ID，请重新选择学员');
            setLoading(false);
            return false;
          }

          // 检查courseId是否有效
          if (updatePayload.courseId === undefined || updatePayload.courseId === null || updatePayload.courseId === '') {
            message.error('无法获取课程ID，请重新选择课程');
            setLoading(false);
            return false;
          }

          try {
            // 直接传递payload对象，不需要ID参数，因为studentId已经包含在payload中
            await onUpdateStudent("", updatePayload);
            console.log("学生信息更新成功");
            message.success('学员更新成功');
          } catch (error) {
            console.error("更新学员失败:", error);
            message.error('更新学员失败，请检查网络连接或联系管理员');
            setLoading(false);
            return false;
          }
        } else {
          // --- ADDING NEW STUDENT (Nested Structure for /api/student/create) ---
          const selectedCourseId = primaryGroup.courses[0];
          console.log('选择的课程ID:', selectedCourseId);
          console.log('可用课程列表:', courseList);

          // 使用辅助函数尝试匹配课程
          console.log('课程ID类型:', typeof selectedCourseId, '值:', selectedCourseId);
          console.log('课程列表长度:', courseList.length);
          if (courseList.length > 0) {
            console.log('课程列表中的第一个ID类型:', typeof courseList[0].id, '值:', courseList[0].id);
          }

          // 使用辅助函数进行灵活匹配
          let selectedCourse = findCourseById(courseList, selectedCourseId);

          // 如果找不到课程，尝试使用模拟数据
          if (!selectedCourse && mockSimpleCourses) {
            console.log('在正常课程列表中找不到课程，尝试使用模拟数据');
            selectedCourse = findCourseById(mockSimpleCourses, selectedCourseId);
          }

          // 如果仍然找不到课程，但我们有课程ID，则创建一个虚拟课程对象
          if (!selectedCourse && selectedCourseId) {
            console.log('创建虚拟课程对象，使用ID:', selectedCourseId);
            selectedCourse = {
              id: selectedCourseId,
              name: `课程${selectedCourseId}`,
              typeName: '未知类型',
              status: 'PUBLISHED',
              coaches: [{ id: 1, name: primaryGroup.coach || '未知教练' }]
            };
          }

          // 如果仍然没有课程，则报错
          if (!selectedCourse) {
            message.error('无法获取课程信息，请重新选择课程');
            setLoading(false);
            return false;
          }

          let coachId = 0; // 默认教练ID

          if (selectedCourse && primaryGroup.coach) {
            console.log('找到课程:', selectedCourse);
            const coach = selectedCourse.coaches?.find(co => co.name === primaryGroup.coach);
            if (coach) {
              coachId = coach.id;
              console.log('找到教练:', coach);
            } else {
              // 如果找不到指定教练，使用第一个教练
              if (selectedCourse.coaches && selectedCourse.coaches.length > 0) {
                coachId = selectedCourse.coaches[0].id;
                console.log(`无法找到教练 '${primaryGroup.coach}'，使用第一个教练:`, selectedCourse.coaches[0]);
                message.warning(`无法找到课程 '${selectedCourse.name}' 下名为 '${primaryGroup.coach}' 的教练ID，将使用默认值。`);
              } else {
                console.log('课程没有教练信息，使用默认值 0');
                message.warning(`课程 '${selectedCourse.name}' 没有教练信息，将使用默认值。`);
              }
            }
          }

          // 准备学员信息
          const studentInfo = {
            name: values.name,
            gender: values.gender === 'male' ? 'MALE' : 'FEMALE',
            age: Number(values.age),
            phone: values.phone,
            campusId: 1, // TODO: 动态校区ID
            status: mapStatusToApi(values.status)
          };

          // 准备课程信息 - 确保包含courseId
          const courseInfo: any = {
            courseId: safeProcessCourseId(selectedCourse.id), // 使用找到的课程ID，保留字符串类型
            startDate: primaryGroup.enrollDate,
            endDate: primaryGroup.expireDate,
            coachId: coachId || 1, // 确保有教练ID
          };

          // 如果有排课时间，添加到请求中
          if (primaryGroup.scheduleTimes && primaryGroup.scheduleTimes.length > 0) {
            courseInfo.fixedScheduleTimes = primaryGroup.scheduleTimes.map(st => ({
              weekday: st.weekday,
              from: st.time,
              to: st.endTime || st.time
            }));
          }

          // 确保courseId存在且有效
          if (courseInfo.courseId === undefined || courseInfo.courseId === null || courseInfo.courseId === '') {
            message.error('无法获取课程ID，请重新选择课程');
            setLoading(false);
            return false;
          }

          // 构建最终请求
          const payload = {
            studentInfo,
            courseInfo
          };

          console.log("提交创建请求到 /api/student/create:", JSON.stringify(payload, null, 2));

          // 记录教练信息，用于调试
          if (selectedCourse && selectedCourse.coaches && selectedCourse.coaches.length > 0) {
            console.log("选中课程的教练信息:", selectedCourse.coaches);
            console.log("选中的教练:", primaryGroup.coach);
          }

          try {
            const createdStudent = await onAddStudent(payload);
            console.log("学员创建成功:", createdStudent);
            message.success('学员添加成功');

            // Trigger a global event to notify that a student has been added
            // Pass the created student data to avoid an extra API call
            window.dispatchEvent(new CustomEvent('studentCreated', {
              detail: { student: createdStudent }
            }));

            if (window.sessionStorage.getItem('afterAddStudent') === 'true') {
              window.sessionStorage.removeItem('afterAddStudent');
              window.dispatchEvent(new CustomEvent('studentAddedForTransfer', { detail: {id: 0, name: studentInfo.name} }));
            }
          } catch (error) {
            console.error("创建学员失败:", error);
            message.error('创建学员失败，请检查网络连接或联系管理员');
            setLoading(false);
            return false;
          }
        }

        setVisible(false);
        form.resetFields();
        setCourseGroups([]);
        setCurrentEditingGroupIndex(null);
        setTempCourseGroup(null);
        setOriginalCourseGroup(null);
        setIsEditing(false);
        return true;

      } catch (error: any) {
        console.error('提交学员数据失败:', error);
        const errorMsg = error?.response?.data?.message || error?.message || '提交学员数据失败，请检查网络或联系管理员';
        message.error(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }

    } catch (info) {
      console.log('表单校验失败:', info);
      setLoading(false);
      message.error('表单校验失败，请检查输入');
      return false;
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
    const newGroup: CourseGroup = {
      key: newKey,
      courses: [],
      courseType: '',
      coach: '',
      status: form.getFieldValue('status') || 'normal',
      enrollDate: dayjs().format('YYYY-MM-DD'),
      expireDate: dayjs().add(6, 'month').format('YYYY-MM-DD'),
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
      if (!group.courses || group.courses.length === 0 || !group.enrollDate || !group.expireDate) {
        message.error('请确保课程、报名日期和有效期已填写');
        return false;
      }
      setCurrentEditingGroupIndex(null);
      setOriginalCourseGroup(null);
      setIsEditing(false);
      message.success('课程编辑已确认');
      return true;
    }
    else if (tempCourseGroup) {
      if (!tempCourseGroup.courses || tempCourseGroup.courses.length === 0 || !tempCourseGroup.enrollDate || !tempCourseGroup.expireDate) {
        message.error('请确保课程、报名日期和有效期已填写');
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
