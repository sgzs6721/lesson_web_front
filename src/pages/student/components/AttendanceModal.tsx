import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, TimePicker, Input, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import dayjs from 'dayjs';
import { Student } from '../types/student';
import { getStudentAllCourses } from '../utils/student';

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

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setSelectedDate(dayjs());
      setStartTime(null);
      setEndTime(null);
      setDuration(0);
    }
  }, [visible, form]);

  const calculateDuration = (start: dayjs.Dayjs | null, end: dayjs.Dayjs | null) => {
    if (start && end) {
      const diff = end.diff(start, 'hour', true);
      setDuration(Math.round(diff * 10) / 10); // 保留一位小数
    } else {
      setDuration(0);
    }
  };

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
      onOk({
        ...values,
        date: selectedDate?.format('YYYY-MM-DD'),
        startTime: startTime?.format('HH:mm'),
        endTime: endTime?.format('HH:mm'),
        duration,
      });
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
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: dayjs(),
        }}
        className="attendance-form"
      >
        <Form.Item
          label="日期"
          name="date"
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date) => setSelectedDate(date)}
          />
        </Form.Item>

        <Form.Item
          label="开始时间"
          name="startTime"
          rules={[{ required: true, message: '请选择开始时间' }]}
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
        >
          <TimePicker
            format="HH:mm"
            style={{ width: '100%' }}
            onChange={(time) => handleTimeChange('end', time)}
          />
        </Form.Item>

        <Form.Item label="课时">
          <Input value={`${duration} 小时`} disabled />
        </Form.Item>

        <Form.Item
          label="课程"
          name="course"
          rules={[{ required: true, message: '请选择课程' }]}
        >
          <Select
            placeholder="请选择课程"
            options={studentCourses.map(course => ({
              label: course.name,
              value: course.id || course.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="备注"
          name="notes"
        >
          <Input.TextArea rows={3} placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttendanceModal;