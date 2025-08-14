import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, DatePicker, TimePicker, Input, Select, message, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import dayjs from 'dayjs';
import { Student } from '../types/student';
import { getStudentAllCourses } from '../utils/student';
import { checkInStudent } from '../../../api/student/attendance';
import { ATTENDANCE_TYPES, ATTENDANCE_TYPE_OPTIONS } from '../constants/attendanceTypes';
import './AttendanceModal.css';
import './AttendanceModal.enhanced.css';

interface AttendanceModalProps {
  visible: boolean;
  student: (Student & { courseName?: string }) | null;
  form: FormInstance;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  visible,
  student,
  form,
  onCancel,
  onOk,
}) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);
  const [duration, setDuration] = useState<string>('0');
  // 添加一个标志，用于跟踪用户是否手动修改了课时
  const [isDurationManuallySet, setIsDurationManuallySet] = useState<boolean>(false);
  // 获取学生所有课程并保存到state
  const [studentCourses, setStudentCourses] = useState<any[]>([]);
  // 添加一个状态来保存选中的课程ID，防止闪烁问题
  const [selectedCourseId, setSelectedCourseId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // 添加 loading 状态

  // 辅助函数：根据开始时间自动生成结束时间（默认课程时长为1小时）
  const generateEndTime = useCallback((startTime: dayjs.Dayjs): dayjs.Dayjs => {
    return startTime.add(1, 'hour');
  }, []);

  // 辅助函数：计算两个时间之间的时长（以小时为单位，保留一位小数）
  const calculateDuration = useCallback((start: dayjs.Dayjs, end: dayjs.Dayjs): number => {
    // 类型检查，确保参数不为空
    if (!start || !end) {
      console.error('计算课时失败：开始或结束时间为空');
      return 0;
    }
    
    // 确保结束时间晚于开始时间
    if (end.isBefore(start)) {
      console.error('计算课时失败：结束时间早于开始时间');
      return 0;
    }
    
    // 计算小时和分钟
    const startHour = start.hour();
    const startMinute = start.minute();
    const endHour = end.hour();
    const endMinute = end.minute();
    
    // 先转换为分钟总数，再计算差值
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    // 计算分钟差值
    const diffMinutes = endTotalMinutes - startTotalMinutes;
    
    // 转换为小时
    const diffHours = diffMinutes / 60;
    
    // 详细日志输出
    console.log(`【课时计算详细】开始时间: ${start.format('HH:mm')}, 结束时间: ${end.format('HH:mm')}`);
    console.log(`开始(小时:${startHour}, 分钟:${startMinute}, 总分钟:${startTotalMinutes})`);
    console.log(`结束(小时:${endHour}, 分钟:${endMinute}, 总分钟:${endTotalMinutes})`);
    console.log(`分钟差值: ${diffMinutes}, 小时差值: ${diffHours}`);
    
    // 四舍五入到最接近的0.5
    const roundedHours = Math.round(diffHours * 2) / 2;
    console.log(`最终课时(四舍五入到0.5): ${roundedHours}`);
    
    return roundedHours;
  }, []);

  // 辅助函数：更新课时到表单和UI
  const updateDurationValue = useCallback((newDuration: number) => {
    // 仅当用户未手动设置课时时更新
    if (!isDurationManuallySet) {
      // 确保课时四舍五入到最接近的0.5
      const formattedDuration = Math.round(newDuration * 2) / 2;
      
      // 设置状态
      setDuration(String(formattedDuration));
      
      // 更新表单值，但不触发onChange事件
      try {
        form.setFieldsValue({ duration: String(formattedDuration) });
        console.log('课时自动计算并填入:', formattedDuration);
      } catch (error) {
        console.error('设置课时失败:', error);
      }
    }
    // 用户已手动设置课时，不做任何操作
    else {
      console.log('用户已手动设置课时，不自动更新');
    }
  }, [form, isDurationManuallySet]);

  // 根据选择的日期和学员排课表自动填充时间
  const autoFillTimeBySchedule = useCallback((date: dayjs.Dayjs) => {
    console.log('尝试自动填充排课时间，日期:', date.format('YYYY-MM-DD'));

    if (!student) {
      console.log('没有学员信息，无法填充排课时间');
      return false;
    }

    // 获取当前选择日期是星期几（0-6，0表示星期日）
    const weekday = date.day();
    // 转换为字符串格式，与排课表匹配
    const weekdayStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][weekday];
    // 转换成数字格式，用于查找固定排课
    const weekdayNum = weekday === 0 ? 7 : weekday; // 0(周日)->7, 1(周一)->1, ...
    console.log('当前选择日期对应星期:', weekdayStr, '数字表示:', weekdayNum);

    // 从所有课程组中收集排课时间
    let scheduledTimes: { time: string, endTime?: string, weekday: string }[] = [];
    let fixedScheduleTimes: { from: string, to: string, weekday: string }[] = [];

    // 收集固定排课时间
    if (student.courses && student.courses.length > 0) {
      for (const course of student.courses) {
        // 检查是否有固定排课时间
        if (course.fixedSchedule) {
          try {
            const parsedSchedule = JSON.parse(course.fixedSchedule);
            if (Array.isArray(parsedSchedule)) {
              const formattedSchedules = parsedSchedule.map((item: any) => {
                // 处理数字或字符串形式的weekday
                let weekdayValue = item.weekday;
                if (/^[1-7]$/.test(String(weekdayValue))) {
                  weekdayValue = String(weekdayValue);
                }
                return {
                  weekday: weekdayValue,
                  from: item.from,
                  to: item.to
                };
              });
              fixedScheduleTimes = [...fixedScheduleTimes, ...formattedSchedules];
              console.log('从课程固定排课中找到排课:', formattedSchedules);
            }
          } catch (e) {
            console.error('解析固定排课失败:', e);
          }
        }
      }
    }

    // 转换固定排课时间格式以与传统排课格式兼容
    const convertedFixedTimes = fixedScheduleTimes.map(item => ({
      time: item.from,
      endTime: item.to,
      weekday: `周${item.weekday}` // 转换格式为"周一"、"周二"等
    }));
    scheduledTimes = [...scheduledTimes, ...convertedFixedTimes];

    // 检查学员课程组中的排课信息
    if (student.courseGroups && student.courseGroups.length > 0) {
      student.courseGroups.forEach(group => {
        if (group.scheduleTimes && group.scheduleTimes.length > 0) {
          // 找出当天的排课
          const todaySchedules = group.scheduleTimes.filter(st => st.weekday === weekdayStr);
          if (todaySchedules.length > 0) {
            console.log('在课程组中找到当天排课:', todaySchedules);
            scheduledTimes = [...scheduledTimes, ...todaySchedules];
          }
        }
      });
    }

    // 如果学员直接有scheduleTimes属性
    if (student.scheduleTimes && student.scheduleTimes.length > 0) {
      const todaySchedules = student.scheduleTimes.filter(st => st.weekday === weekdayStr);
      if (todaySchedules.length > 0) {
        console.log('在学员排课表中找到当天排课:', todaySchedules);
        scheduledTimes = [...scheduledTimes, ...todaySchedules];
      }
    }

    // 1. 首先尝试使用当天的排课时间
    const todaySchedules = scheduledTimes.filter(st => {
      // 判断weekday是否匹配当天
      if (st.weekday === weekdayStr) return true;
      
      // 判断数字形式的weekday是否匹配
      if (st.weekday === String(weekdayNum) || st.weekday === String(weekday)) return true;
      
      return false;
    });

    if (todaySchedules.length > 0) {
      console.log('找到当天排课时间，使用第一个:', todaySchedules[0]);
      return setTimeFromSchedule(todaySchedules[0]);
    }
    
    // 2. 如果没有找到当天的排课时间，查找距离最近的排课
    console.log('没有找到当天的排课时间，查找最近的排课');
    
    // 收集所有时间数据
    let allTimes: { time: string, endTime?: string, weekday: string, dayDiff: number }[] = [];
    
    // 处理所有排课时间，计算与选定日期的距离
    scheduledTimes.forEach(schedule => {
      let scheduleWeekday: number;
      
      // 解析weekday字符串为数字
      if (schedule.weekday.startsWith('周')) {
        const dayChar = schedule.weekday.substring(1);
        const dayMap: { [key: string]: number } = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 0, '天': 0 };
        scheduleWeekday = dayMap[dayChar] || -1;
      } else {
        // 直接是数字形式的weekday
        scheduleWeekday = parseInt(schedule.weekday, 10);
        // 处理周日表示方式: 0 或 7
        if (scheduleWeekday === 7) scheduleWeekday = 0;
      }
      
      if (scheduleWeekday >= 0 && scheduleWeekday <= 6) {
        // 计算这个排课日与当前选择日期的天数差
        let dayDiff = scheduleWeekday - weekday;
        if (dayDiff <= 0) dayDiff += 7; // 确保是未来的天数
        
        allTimes.push({
          ...schedule,
          dayDiff: dayDiff
        });
      }
    });
    
    // 按照与当前日期的距离排序
    allTimes.sort((a, b) => a.dayDiff - b.dayDiff);
    
    // 如果有排序后的结果，使用最近的一个
    if (allTimes.length > 0) {
      const nearestSchedule = allTimes[0];
      const nearestDate = date.add(nearestSchedule.dayDiff, 'day');
      
      console.log('找到最近的排课时间:', nearestSchedule, '在', nearestDate.format('YYYY-MM-DD'));
      
      // 更新表单日期为最近的排课日期
      setSelectedDate(nearestDate);
      form.setFieldsValue({ date: nearestDate });
      
      // 设置时间
      return setTimeFromSchedule(nearestSchedule);
    }
    
    // 如果没有任何排课信息，使用默认时间
    console.log('未找到任何排课时间，设置默认时间');
    const defaultStartTime = dayjs().hour(15).minute(0).second(0);
    setStartTime(defaultStartTime);
    form.setFieldsValue({ startTime: defaultStartTime });
    
    const defaultEndTime = defaultStartTime.add(1, 'hour');
    setEndTime(defaultEndTime);
    form.setFieldsValue({ endTime: defaultEndTime });
    
    if (!isDurationManuallySet) {
      const newDuration = calculateDuration(defaultStartTime, defaultEndTime);
      setDuration(String(newDuration));
      form.setFieldsValue({ duration: String(newDuration) });
    }
    
    return true;
  }, [student, form, generateEndTime, calculateDuration, isDurationManuallySet]);

  // 辅助函数：从排课时间设置表单时间
  const setTimeFromSchedule = useCallback((schedule: { time: string, endTime?: string }) => {
    // 设置开始时间
    if (schedule.time) {
      const [hours, minutes] = schedule.time.split(':').map(Number);
      const startTimeValue = dayjs().hour(hours).minute(minutes).second(0);
      setStartTime(startTimeValue);
      
      // 强制设置表单值
      try {
        form.setFieldsValue({ startTime: startTimeValue });
        console.log('设置开始时间成功:', startTimeValue.format('HH:mm'));
      } catch (error) {
        console.error('设置开始时间失败:', error);
      }

      // 设置结束时间（如果有）
      let endTimeValue: dayjs.Dayjs;
      if (schedule.endTime) {
        const [endHours, endMinutes] = schedule.endTime.split(':').map(Number);
        endTimeValue = dayjs().hour(endHours).minute(endMinutes).second(0);
        console.log('使用排课表中的结束时间:', endTimeValue.format('HH:mm'));
      } else {
        // 如果没有结束时间，自动生成（默认课程时长为1小时）
        endTimeValue = generateEndTime(startTimeValue);
        console.log('生成默认结束时间:', endTimeValue.format('HH:mm'));
      }
      
      setEndTime(endTimeValue);
      
      // 强制设置表单值
      try {
        form.setFieldsValue({ endTime: endTimeValue });
        console.log('设置结束时间成功:', endTimeValue.format('HH:mm'));
      } catch (error) {
        console.error('设置结束时间失败:', error);
      }
      
      // 只有两个时间都有，且用户未手动设置课时，才计算课时
      if (!isDurationManuallySet) {
        const newDuration = calculateDuration(startTimeValue, endTimeValue);
        setDuration(String(newDuration));
        form.setFieldsValue({ duration: String(newDuration) });
        console.log('初始计算课时:', newDuration);
      }
      
      return true; // 返回true表示成功填充
    }
    
    return false; // 返回false表示未能填充
  }, [form, generateEndTime, isDurationManuallySet, calculateDuration]);

  // 初始化学生课程列表和选中的课程
  useEffect(() => {
    if (student && visible) {
      console.log('打卡模态框初始化，学员数据:', student);

      // 如果 student 对象中直接带入了 courseId 和 courseName
      if (student.courseId && student.courseName) {
        const preSelectedCourse = {
          id: String(student.courseId),
          name: student.courseName,
        };
        console.log('使用从表格传递的课程信息:', preSelectedCourse);
        // 将其设置为唯一的选项
        setStudentCourses([preSelectedCourse]); 
        // 设置选中值和表单初始值
        setSelectedCourseId(preSelectedCourse.id);
        form.setFieldsValue({ course: preSelectedCourse.id });
      }
      // 保留之前的逻辑作为后备 (理论上不应该执行了)
      else {
        const courses = getStudentAllCourses(student);
        if (courses.length > 0) {
           // ... 原有的复杂课程选择逻辑 ... 
           // 这部分可能可以简化或移除，但暂时保留以防万一
           console.warn('未直接传递课程名称，使用旧逻辑查找课程');
           setStudentCourses(courses);
           // ... 设置默认选中 ...
        }
      }
      
      // ... (其余初始化逻辑)
    }
  }, [student, visible, form]);

  // 一个额外的useEffect来处理当课时被手动设置标记后的表单状态保持
  useEffect(() => {
    if (isDurationManuallySet) {
      // 确保表单中的课时值与state中的保持一致
      const currentFormValue = form.getFieldValue('duration');
      if (currentFormValue !== duration) {
        form.setFieldsValue({ duration: duration });
      }
    }
  }, [isDurationManuallySet, duration, form]);

  // 监听visible变化，当模态框打开时处理初始化
  useEffect(() => {
    if (!visible) {
      // 模态框关闭时，重置所有状态
      form.resetFields();
      setStartTime(null);
      setEndTime(null);
      setDuration('0');
      setSelectedCourseId(null);
      setIsDurationManuallySet(false);
      return;
    }

    // 先处理课程选择，避免闪烁和首次不回显
    if (studentCourses.length > 0) {
      let courseIdToSet = null;
      if (studentCourses.length === 1) {
        courseIdToSet = studentCourses[0].id;
      } else if (student?.courseId) {
        const match = studentCourses.find(c => String(c.id) === String(student.courseId));
        courseIdToSet = match ? match.id : studentCourses[0].id;
      } else {
        courseIdToSet = studentCourses[0].id;
      }
      setSelectedCourseId(courseIdToSet);
      form.setFieldsValue({ course: courseIdToSet });
    }

    // 只设置日期，不设置时间和课时，时间和课时由排课表决定
    const today = dayjs();
    setSelectedDate(today);
    form.setFieldsValue({ date: today });

    // 排课表自动填充时间
    setTimeout(() => {
      const timeFilledFromSchedule = autoFillTimeBySchedule(today);
      if (!timeFilledFromSchedule) {
        setStartTime(null);
        setEndTime(null);
        form.setFieldsValue({ startTime: undefined, endTime: undefined });
      }
      // 再次确保课程回显
      if (studentCourses.length > 0 && selectedCourseId) {
        form.setFieldsValue({ course: selectedCourseId });
      }
    }, 200);

    setIsDurationManuallySet(false);
  }, [visible, form, student, studentCourses, autoFillTimeBySchedule, selectedCourseId]);

  const handleOk = async () => {
    setLoading(true); // 开始加载
    try {
      const values = await form.validateFields();

      // 获取表单中的课时值（可能是用户手动输入的）
      const formDuration = form.getFieldValue('duration') || duration;

      // 获取课程ID
      const selectedCourseId = form.getFieldValue('course');
      const courseId = Number(selectedCourseId);
      if (isNaN(courseId)) {
        message.error('无效的课程ID，请重新选择课程');
        console.error('无法获取有效的课程ID，表单值:', selectedCourseId);
        return;
      }

      // 获取学生ID
      const studentId = Number(student?.id);
      if (isNaN(studentId)) {
        message.error('无效的学员ID');
        console.error('无法获取有效的学员ID:', student);
        return;
      }
      
      // ★ 新增：获取当前课程的剩余课时
      const selectedCourse = student?.courses?.find(c => Number(c.courseId) === courseId);
      const currentRemainingHours = selectedCourse?.remainingHours ?? 0;

      // ★ 新增：检查输入的课时是否大于剩余课时
      const enteredDuration = parseFloat(formDuration) || 0;
      if (enteredDuration > currentRemainingHours) {
        message.error(`课时不足！当前剩余 ${currentRemainingHours} 课时，无法扣除 ${enteredDuration} 课时。`);
        setLoading(false); // 停止加载状态
        return; // 阻止提交
      }

      // 格式化日期和时间
      const formattedDate = selectedDate?.format('YYYY-MM-DD') || '';
      const formattedStartTime = startTime?.format('HH:mm') || '';
      const formattedEndTime = endTime?.format('HH:mm') || '';

      // 准备提交的数据，确保字段名和类型匹配示例
      const checkInData = {
        studentId: studentId,
        courseId: courseId,
        courseDate: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        duration: parseFloat(formDuration) || 0, // 确保 duration 是数字
        notes: values.notes || '', // 确保 notes 是字符串
        type: values.type || ATTENDANCE_TYPES.NORMAL // 添加打卡类型参数
      };

      console.log('提交打卡数据:', JSON.stringify(checkInData, null, 2));

      // 调用打卡API
      const response = await checkInStudent(checkInData);

      if (response && response.code === 200) {
        // message.success('打卡成功'); // 保持注释
        // 调用父组件的回调函数 - 传递包含关键信息的 checkInData 对象
        onOk(checkInData); 
      } else {
        message.error(response?.message || '打卡失败，请重试');
      }
    } catch (error) {
      // 区分表单验证错误和其他错误
      if (error && (error as any).errorFields) {
        console.error('表单验证失败:', error);
        // Antd 会自动显示验证错误信息，无需额外 message
      } else {
        console.error('打卡失败:', error);
        message.error('打卡操作失败，请重试');
      }
    } finally {
      setLoading(false); // 结束加载
    }
  };

  return (
    <Modal
      title={`学员打卡请假 - ${student?.name}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
      okText="确认"
      cancelText="取消"
      destroyOnClose
      className="attendance-modal"
      centered
      styles={{ 
        body: { padding: '30px 24px' } 
      }}
      maskClosable={true}
      style={{ borderRadius: '12px', overflow: 'hidden' }}
      confirmLoading={loading} // 将 loading 状态传递给确认按钮
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          course: selectedCourseId ? String(selectedCourseId) : undefined,
          date: dayjs(),
          startTime: dayjs().hour(15).minute(0),
          endTime: dayjs().hour(16).minute(0),
          duration: 1.0, // 合理的默认值，会被动态计算覆盖
          type: ATTENDANCE_TYPES.NORMAL // 默认选择正常打卡
        }}
        className="attendance-form"
        preserve={false}
      >
        <div className="course-date-row">
          <Form.Item
            label="课程"
            name="course"
            rules={[{ required: true, message: '请选择课程' }]}
            className="course-item"
            style={{ marginBottom: 24 }}
          >
            <Select
              placeholder="课程已选定"
              style={{ width: '100%' }}
              popupMatchSelectWidth={true}
              getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
              listHeight={256}
              className="course-select"
              dropdownStyle={{ borderRadius: '8px' }}
              disabled={true}
            >
              {studentCourses.map(course => {
                const courseId = course.id ? String(course.id) : '';
                const courseName = course.name || `课程 ${courseId}`;
                
                return (
                  <Select.Option key={courseId} value={courseId}>
                    {courseName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="日期"
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
            className="date-item"
            style={{ marginBottom: 24 }}
          >
            <DatePicker
              style={{ width: '100%', height: '38px', borderRadius: '8px' }}
              onChange={(date) => {
                if (date) {
                  setSelectedDate(date);
                  // 只有在初始状态下才自动填充时间
                  if (!startTime && !endTime) {
                    autoFillTimeBySchedule(date);
                  }
                }
              }}
              inputReadOnly
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                类型
                <Tooltip 
                  title={
                    <div style={{ fontSize: '12px', lineHeight: '16px' }}>
                      <div style={{ marginBottom: '4px' }}>• 正常打卡：扣除课时</div>
                      <div style={{ marginBottom: '4px' }}>• 请假：不扣除课时</div>
                      <div>• 缺勤：扣除课时</div>
                    </div>
                  }
                  placement="top"
                  overlayStyle={{ maxWidth: '200px' }}
                >
                  <InfoCircleOutlined 
                    style={{ 
                      color: '#1890ff', 
                      fontSize: '12px',
                      cursor: 'help'
                    }} 
                  />
                </Tooltip>
              </span>
            }
            name="type"
            rules={[{ required: true, message: '请选择打卡类型' }]}
            className="type-item"
            style={{ marginBottom: 24 }}
          >
            <Select
              placeholder="请选择打卡类型"
              style={{ width: '100%', height: '38px', borderRadius: '8px' }}
              options={ATTENDANCE_TYPE_OPTIONS}
              defaultValue={ATTENDANCE_TYPES.NORMAL}
              size="middle"
              popupMatchSelectWidth={true}
              getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
              dropdownStyle={{ borderRadius: '8px' }}
              className="type-select"
              dropdownClassName="type-select-dropdown"
            />
          </Form.Item>
        </div>

        <div className="time-duration-row">
          <Form.Item
            label="开始时间"
            name="startTime"
            rules={[{ required: true, message: '请选择开始时间' }]}
            className="time-item"
            style={{ marginBottom: 24 }}
          >
            <TimePicker
              format="HH:mm"
              style={{ width: '100%', height: '38px', borderRadius: '8px' }}
              onChange={(time) => {
                if (!time) return;
                
                // 设置开始时间
                setStartTime(time);
                form.setFieldsValue({ startTime: time });
                
                // 如果结束时间未设置，自动设置为开始时间后1小时
                if (!endTime) {
                  const newEndTime = generateEndTime(time);
                  setEndTime(newEndTime);
                  form.setFieldsValue({ endTime: newEndTime });
                  
                  // 只有当用户未手动设置课时时才更新课时
                  if (!isDurationManuallySet) {
                    const newDuration = calculateDuration(time, newEndTime);
                    setDuration(String(newDuration));
                    form.setFieldsValue({ duration: String(newDuration) });
                  }
                } else {
                  // 如果开始和结束时间都有，且用户未手动修改课时，则重新计算
                  if (!isDurationManuallySet) {
                    const newDuration = calculateDuration(time, endTime);
                    setDuration(String(newDuration));
                    form.setFieldsValue({ duration: String(newDuration) });
                  }
                }

                // 立即关闭面板
                document.body.click();
              }}
              onSelect={(time) => {
                if (!time) return;
                
                // 设置开始时间
                setStartTime(time);
                form.setFieldsValue({ startTime: time });
                
                // 如果结束时间未设置，自动设置为开始时间后1小时
                if (!endTime) {
                  const newEndTime = generateEndTime(time);
                  setEndTime(newEndTime);
                  form.setFieldsValue({ endTime: newEndTime });
                  
                  // 只有当用户未手动设置课时时才更新课时
                  if (!isDurationManuallySet) {
                    const newDuration = calculateDuration(time, newEndTime);
                    setDuration(String(newDuration));
                    form.setFieldsValue({ duration: String(newDuration) });
                  }
                } else {
                  // 如果开始和结束时间都有，且用户未手动修改课时，则重新计算
                  if (!isDurationManuallySet) {
                    const newDuration = calculateDuration(time, endTime);
                    setDuration(String(newDuration));
                    form.setFieldsValue({ duration: String(newDuration) });
                  }
                }
                
                // 立即关闭面板
                document.body.click();
              }}
              inputReadOnly
              popupClassName="time-picker-popup"
              hideDisabledOptions
              hourStep={1}
              minuteStep={10}
              disabledTime={() => ({
                disabledHours: () => [...Array(8).keys(), ...Array.from({length: 24-23+1}, (_, i) => i + 23)],
                disabledMinutes: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 59]
              })}
              allowClear={false}
              showNow={false}
            />
          </Form.Item>

          <Form.Item
            label="结束时间"
            name="endTime"
            rules={[{ required: true, message: '请选择结束时间' }]}
            className="time-item"
            style={{ marginBottom: 24 }}
          >
            <TimePicker
              format="HH:mm"
              style={{ width: '100%', height: '38px', borderRadius: '8px' }}
              onChange={(time) => {
                if (!time) return;
                
                // 设置结束时间
                setEndTime(time);
                form.setFieldsValue({ endTime: time });
                
                // 只有当用户未手动设置课时，且开始时间存在时，才更新课时
                if (!isDurationManuallySet && startTime) {
                  const newDuration = calculateDuration(startTime, time);
                  setDuration(String(newDuration));
                  form.setFieldsValue({ duration: String(newDuration) });
                }

                // 立即关闭面板
                document.body.click();
              }}
              onSelect={(time) => {
                if (!time) return;
                
                // 设置结束时间
                setEndTime(time);
                form.setFieldsValue({ endTime: time });
                
                // 只有当用户未手动设置课时，且开始时间存在时，才更新课时
                if (!isDurationManuallySet && startTime) {
                  const newDuration = calculateDuration(startTime, time);
                  setDuration(String(newDuration));
                  form.setFieldsValue({ duration: String(newDuration) });
                }
                
                // 立即关闭面板
                document.body.click();
              }}
              inputReadOnly
              popupClassName="time-picker-popup"
              hideDisabledOptions
              hourStep={1}
              minuteStep={10}
              disabledTime={() => ({
                disabledHours: () => [...Array(8).keys(), ...Array.from({length: 24-23+1}, (_, i) => i + 23)],
                disabledMinutes: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 59]
              })}
              allowClear={false}
              showNow={false}
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="课时"
            className="duration-item"
            style={{ marginBottom: 24 }}
            rules={[{ required: true, message: '请输入课时' }]}
          >
            <div className="duration-input-container">
              <Input
                type="text"
                style={{
                  textAlign: 'center',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  width: '50%',
                  fontSize: '14px',
                  fontWeight: 'normal',
                  height: '38px'
                }}
                value={duration}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
                    setDuration(inputValue);
                    form.setFieldsValue({ duration: inputValue });
                    setIsDurationManuallySet(true);
                    // 不再清空开始时间和结束时间
                  }
                }}
                onBlur={(e) => {
                  let val = parseFloat(e.target.value || '0');
                  if (isNaN(val)) val = 0;
                  val = Math.round(val * 2) / 2;
                  setDuration(String(val));
                  form.setFieldsValue({ duration: String(val) });
                  // 不做任何关于开始时间和结束时间的处理
                }}
                placeholder="课时"
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    let val = parseFloat(duration || '0');
                    if (isNaN(val)) val = 0;
                    if (e.key === 'ArrowUp') {
                      val += 0.5;
                    } else {
                      val = Math.max(0, val - 0.5);
                    }
                    setDuration(String(val));
                    form.setFieldsValue({ duration: String(val) });
                    setIsDurationManuallySet(true); // 用户手动输入后彻底解绑
                  }
                }}
              />
              <div className="duration-unit" style={{ 
                width: '50%',
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderLeft: 'none',
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '38px',
                color: 'rgba(0, 0, 0, 0.65)'
              }}>课时</div>
            </div>
          </Form.Item>
        </div>

        <Form.Item
          label="备注"
          name="notes"
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea rows={3} placeholder="请输入备注信息" style={{ resize: 'none' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttendanceModal;