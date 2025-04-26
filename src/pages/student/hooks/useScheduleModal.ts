import { useState } from 'react';
import { Student, ClassSchedule } from '@/pages/student/types/student';
import { generateStudentSchedules } from '@/pages/student/utils/student';

/**
 * 课表模态框相关的hook
 * @returns 课表模态框相关的状态和函数
 */
export const useScheduleModal = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<{
    student: Student | null;
    schedules: ClassSchedule[];
  }>({
    student: null,
    schedules: []
  });

  // 显示课表模态框
  const showModal = (student: Student) => {
    // 使用工具函数生成模拟课表数据
    const mockSchedules = generateStudentSchedules(student);

    setData({
      student,
      schedules: mockSchedules
    });
    setVisible(true);
  };

  // 关闭课表模态框
  const hideModal = () => {
    setVisible(false);
    setData({ student: null, schedules: [] });
  };

  return {
    scheduleModalVisible: visible,
    studentSchedule: data,
    showScheduleModal: showModal,
    handleScheduleModalCancel: hideModal
  };
};