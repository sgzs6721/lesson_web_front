import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, DatePicker, TimePicker, Input, Select, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import dayjs from 'dayjs';
import { Student } from '../types/student';
import { getStudentAllCourses } from '../utils/student';
import { checkInStudent } from '../../../api/student/attendance';
import { getCourseSimpleList } from '../../../api/course';
import './AttendanceModal.css';
import './AttendanceModal.enhanced.css';

interface AttendanceModalProps {
  visible: boolean;
  student: Student | null;
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
  const [duration, setDuration] = useState<number>(0);
  const [realCourses, setRealCourses] = useState<any[]>([]);

  // 定义计算课时的函数
  const calculateDuration = useCallback((start: dayjs.Dayjs | null, end: dayjs.Dayjs | null) => {
    if (start && end) {
      const diff = end.diff(start, 'hour', true);
      const newDuration = Math.round(diff * 10) / 10; // 保留一位小数
      setDuration(newDuration);

      // 尝试更新表单中的课时字段（如果表单已初始化）
      if (form) {
        form.setFieldsValue({ duration: newDuration });
      }
    } else {
      setDuration(0);
      if (form) {
        form.setFieldsValue({ duration: 0 });
      }
    }
  }, [form]);

  // 处理课时手动修改
  const handleDurationChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setDuration(numValue);
    }
  };

  // 辅助函数：根据开始时间自动生成结束时间（默认课程时长为1小时）
  const generateEndTime = useCallback((startTime: dayjs.Dayjs): dayjs.Dayjs => {
    return startTime.add(1, 'hour');
  }, []);

  // 根据选择的日期和学员排课表自动填充时间
  const autoFillTimeBySchedule = useCallback((date: dayjs.Dayjs) => {
    if (!student || !student.courseGroups) return;

    // 获取当前选择日期是星期几（0-6，0表示星期日）
    const weekday = date.day();
    // 转换为字符串格式，与排课表匹配
    const weekdayStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][weekday];

    // 从所有课程组中收集排课时间
    let scheduledTimes: { time: string, endTime?: string }[] = [];

    student.courseGroups.forEach(group => {
      if (group.scheduleTimes) {
        // 找出当天的排课
        const todaySchedules = group.scheduleTimes.filter(st => st.weekday === weekdayStr);
        scheduledTimes = [...scheduledTimes, ...todaySchedules];
      }
    });

    // 如果学员直接有scheduleTimes属性
    if (student.scheduleTimes) {
      const todaySchedules = student.scheduleTimes.filter(st => st.weekday === weekdayStr);
      scheduledTimes = [...scheduledTimes, ...todaySchedules];
    }

    // 如果找到了当天的排课时间
    if (scheduledTimes.length > 0) {
      // 使用第一个找到的时间
      const schedule = scheduledTimes[0];

      // 设置开始时间
      if (schedule.time) {
        const [hours, minutes] = schedule.time.split(':').map(Number);
        const startTimeValue = dayjs().hour(hours).minute(minutes);
        setStartTime(startTimeValue);
        form.setFieldsValue({ startTime: startTimeValue });

        // 如果没有结束时间，自动生成（默认课程时长为1小时）
        if (!schedule.endTime) {
          const endTimeValue = generateEndTime(startTimeValue);
          setEndTime(endTimeValue);
          form.setFieldsValue({ endTime: endTimeValue });
          calculateDuration(startTimeValue, endTimeValue);
        }
      }

      // 设置结束时间（如果有）
      if (schedule.endTime) {
        const [hours, minutes] = schedule.endTime.split(':').map(Number);
        const endTimeValue = dayjs().hour(hours).minute(minutes);
        setEndTime(endTimeValue);
        form.setFieldsValue({ endTime: endTimeValue });

        // 计算课时
        const currentStartTime = form.getFieldValue('startTime') || startTime;
        if (currentStartTime) {
          calculateDuration(currentStartTime, endTimeValue);
        }
      }
    } else {
      // 如果没有找到当天的排课，尝试使用排课表中的第一个时间段
      let allScheduledTimes: { time: string, endTime?: string, weekday: string }[] = [];

      // 收集所有排课时间
      if (student.courseGroups) {
        student.courseGroups.forEach(group => {
          if (group.scheduleTimes && group.scheduleTimes.length > 0) {
            allScheduledTimes = [...allScheduledTimes, ...group.scheduleTimes];
          }
        });
      }

      // 如果学员直接有scheduleTimes属性
      if (student.scheduleTimes && student.scheduleTimes.length > 0) {
        allScheduledTimes = [...allScheduledTimes, ...student.scheduleTimes];
      }

      // 如果有任何排课时间，使用第一个
      if (allScheduledTimes.length > 0) {
        const firstSchedule = allScheduledTimes[0];
        console.log('没有找到当天排课，使用第一个排课时间:', firstSchedule);

        // 设置开始时间
        if (firstSchedule.time) {
          const [hours, minutes] = firstSchedule.time.split(':').map(Number);
          const startTimeValue = dayjs().hour(hours).minute(minutes);
          setStartTime(startTimeValue);
          form.setFieldsValue({ startTime: startTimeValue });

          // 如果没有结束时间，自动生成（默认课程时长为1小时）
          if (!firstSchedule.endTime) {
            const endTimeValue = generateEndTime(startTimeValue);
            setEndTime(endTimeValue);
            form.setFieldsValue({ endTime: endTimeValue });
            calculateDuration(startTimeValue, endTimeValue);
          }
        }

        // 设置结束时间（如果有）
        if (firstSchedule.endTime) {
          const [hours, minutes] = firstSchedule.endTime.split(':').map(Number);
          const endTimeValue = dayjs().hour(hours).minute(minutes);
          setEndTime(endTimeValue);
          form.setFieldsValue({ endTime: endTimeValue });

          // 计算课时
          const currentStartTime = form.getFieldValue('startTime') || startTime;
          if (currentStartTime) {
            calculateDuration(currentStartTime, endTimeValue);
          }
        }
      } else {
        // 如果没有任何排课时间，清空时间选择
        console.log('没有找到任何排课时间');
        setStartTime(null);
        setEndTime(null);
        form.setFieldsValue({ startTime: null, endTime: null });
        setDuration(0);
      }
    }
  }, [student, form, calculateDuration, generateEndTime]);

  // 获取真实课程列表
  useEffect(() => {
    const fetchRealCourses = async () => {
      try {
        // 获取当前校区ID
        const campusId = student?.campusId || '';
        console.log('使用校区ID获取课程列表:', campusId);

        const courses = await getCourseSimpleList(campusId);
        console.log('获取到真实课程列表:', courses);

        // 检查课程ID的类型和值
        courses.forEach(course => {
          console.log(`课程: ${course.name}, ID: ${course.id}, 类型: ${typeof course.id}`);
        });

        setRealCourses(courses);
      } catch (error) {
        console.error('获取课程列表失败:', error);
      }
    };

    if (visible) {
      fetchRealCourses();
    }
  }, [visible, student]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      const today = dayjs();
      setSelectedDate(today);

      // 设置初始表单值
      form.setFieldsValue({
        date: today,
        duration: duration // 初始化课时字段
      });

      // 初始化时自动填充今天的排课时间
      autoFillTimeBySchedule(today);

      // 如果学生有courseId，直接使用
      if (student?.courseId) {
        console.log('学员有courseId，直接使用:', student.courseId);
        form.setFieldsValue({
          course: student.courseId
        });
      } else {
        // 获取学生所有课程
        const courses = getStudentAllCourses(student);

        // 如果学员只有一个课程，自动选择该课程
        if (courses.length === 1) {
          const onlyCourse = courses[0];
          console.log('学员只有一个课程，自动选择:', onlyCourse.name);
          form.setFieldsValue({
            course: onlyCourse.id || onlyCourse.name
          });
        }
      }
    }
  }, [visible, form, student, autoFillTimeBySchedule, duration]);

  const handleTimeChange = (type: 'start' | 'end', time: dayjs.Dayjs | null) => {
    if (type === 'start') {
      setStartTime(time);
      if (time && endTime) {
        calculateDuration(time, endTime);
      }
    } else {
      setEndTime(time);
      if (time && startTime) {
        calculateDuration(startTime, time);
      }
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 确保表单中的课时值与状态中的一致
      form.setFieldsValue({ duration });

      // 获取表单数据
      const formData = {
        ...values,
        date: selectedDate?.format('YYYY-MM-DD'),
        startTime: startTime?.format('HH:mm'),
        endTime: endTime?.format('HH:mm'),
        duration, // 使用状态中的课时值
      };

      try {
        // 准备API请求数据
        const startHour = startTime?.hour() || 0;
        const startMinute = startTime?.minute() || 0;
        const endHour = endTime?.hour() || 0;
        const endMinute = endTime?.minute() || 0;

        // 打印所有表单值，帮助调试
        console.log('表单提交的所有值:', values);
        console.log('选择的课程值:', values.course, '类型:', typeof values.course);

        // 打印所有可用的课程列表，帮助调试
        console.log('可用的真实课程列表:', realCourses);
        console.log('学生课程列表:', studentCourses);

        // 直接从真实课程列表中查找课程
        const selectedRealCourse = realCourses.find(course => {
          console.log(`比较课程: ${course.id} (${typeof course.id}) 与选择的: ${values.course} (${typeof values.course})`);
          return String(course.id) === String(values.course);
        });

        // 尝试将课程ID转换为数字
        let courseId: number | null = null;

        if (selectedRealCourse) {
          // 使用真实课程的ID
          courseId = Number(selectedRealCourse.id);
          console.log('从真实课程列表中找到课程:', selectedRealCourse.name, '课程ID:', courseId);
        } else {
          console.log('在真实课程列表中未找到课程，尝试从学生课程中查找');
          // 如果在真实课程列表中找不到，尝试从学生课程中查找
          const selectedCourse = studentCourses.find(course => {
            console.log(`比较学生课程: ${course.id} (${typeof course.id}) 与选择的: ${values.course} (${typeof values.course})`);
            return course.id === values.course || course.name === values.course;
          });

          console.log('从学生课程中找到:', selectedCourse);

          if (selectedCourse?.id) {
            // 如果ID是字符串类型，尝试转换为数字
            if (typeof selectedCourse.id === 'string') {
              // 检查是否可以转换为数字
              if (!isNaN(Number(selectedCourse.id))) {
                courseId = Number(selectedCourse.id);
                console.log('从字符串转换为数字:', selectedCourse.id, '->', courseId);
              }
            } else if (typeof selectedCourse.id === 'number') {
              // 如果已经是数字类型，直接使用
              courseId = selectedCourse.id;
              console.log('使用数字类型ID:', courseId);
            }
          }
        }

        // 如果没有找到课程ID，尝试直接使用表单值
        if (!courseId && values.course) {
          console.log('尝试直接使用表单值作为课程ID:', values.course);
          // 检查是否可以转换为数字
          if (!isNaN(Number(values.course))) {
            courseId = Number(values.course);
            console.log('直接使用表单值作为课程ID:', courseId);
          }
        }

        if (!courseId) {
          message.error('无效的课程ID，请重新选择课程');
          console.error('无法获取有效的课程ID，表单值:', values.course);
          return;
        }

        console.log('打卡使用的课程ID:', courseId, '类型:', typeof courseId);

        const requestData = {
          studentId: Number(student?.id),
          courseId: courseId,
          courseDate: selectedDate?.format('YYYY-MM-DD') || '',
          startTime: {
            hour: startHour,
            minute: startMinute,
            second: 0,
            nano: 0
          },
          endTime: {
            hour: endHour,
            minute: endMinute,
            second: 0,
            nano: 0
          },
          notes: values.notes
        };

        // 调用打卡API
        const response = await checkInStudent(requestData);

        if (response && response.code === 200) {
          message.success('打卡成功');
          // 调用父组件的回调函数
          onOk(formData);
        } else {
          message.error(response?.message || '打卡失败，请重试');
        }
      } catch (error) {
        console.error('打卡失败:', error);
        message.error('打卡失败，请重试');
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const studentCourses = getStudentAllCourses(student);

  return (
    <Modal
      title={`学员打卡 - ${student?.name}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={500}
      okText="确认"
      cancelText="取消"
      destroyOnClose
      className="attendance-modal"
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: dayjs(),
        }}
        className="attendance-form"
      >
        <div className="course-date-row">
          <Form.Item
            label="课程"
            name="course"
            rules={[{ required: true, message: '请选择课程' }]}
            className="course-item"
          >
            <Select
              placeholder="请选择课程"
              style={{ width: '100%' }}
              dropdownMatchSelectWidth={true}
              popupMatchSelectWidth={true}
              options={realCourses.length > 0
                ? realCourses.map(course => {
                    console.log(`添加课程选项: ${course.name}, ID: ${course.id}, 类型: ${typeof course.id}`);
                    return {
                      label: course.name,
                      value: course.id, // 使用真实课程ID
                    };
                  })
                : studentCourses.map(course => ({
                    label: course.name,
                    value: course.id, // 只使用ID作为值
                  }))
              }
              getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
              listHeight={256}
              className="course-select"
            />
          </Form.Item>

          <Form.Item
            label="日期"
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
            className="date-item"
          >
            <DatePicker
              style={{ width: '100%' }}
              onChange={(date) => {
                if (date) {
                  setSelectedDate(date);
                  // 当日期变化时，自动填充对应的排课时间
                  autoFillTimeBySchedule(date);
                }
              }}
            />
          </Form.Item>
        </div>

        <div className="time-duration-row">
          <Form.Item
            label="开始时间"
            name="startTime"
            rules={[{ required: true, message: '请选择开始时间' }]}
            className="time-item"
          >
            <TimePicker
              format="HH:mm"
              style={{ width: '100%' }}
              onChange={(time) => handleTimeChange('start', time)}
            />
          </Form.Item>

          <Form.Item
            label="结束时间"
            name="endTime"
            rules={[{ required: true, message: '请选择结束时间' }]}
            className="time-item"
          >
            <TimePicker
              format="HH:mm"
              style={{ width: '100%' }}
              onChange={(time) => handleTimeChange('end', time)}
            />
          </Form.Item>

          <Form.Item
            label="课时"
            name="duration"
            className="duration-item"
          >
            <div className="duration-input-container">
              <Input
                value={duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                style={{ textAlign: 'center' }}
              />
              <div className="duration-unit">课时</div>
            </div>
          </Form.Item>
        </div>

        <Form.Item
          label="备注"
          name="notes"
        >
          <Input.TextArea rows={3} placeholder="请输入备注信息" style={{ resize: 'none' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttendanceModal;