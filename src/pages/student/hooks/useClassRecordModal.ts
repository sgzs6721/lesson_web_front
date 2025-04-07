import { useState } from 'react';
import { Student, ClassRecord } from '@/pages/student/types/student';
import { generateClassRecords } from '@/pages/student/utils/student';

/**
 * 课程记录模态框相关的hook
 * @returns 课程记录模态框相关的状态和函数
 */
export const useClassRecordModal = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<{
    student: Student | null;
    records: ClassRecord[];
  }>({
    student: null,
    records: []
  });

  // 显示课程记录模态框
  const showModal = (student: Student) => {
    // 使用工具函数生成模拟数据
    const mockRecords = generateClassRecords(student);
    
    setData({
      student,
      records: mockRecords
    });
    setVisible(true);
  };

  // 关闭课程记录模态框
  const hideModal = () => {
    setVisible(false);
  };

  return {
    classRecordModalVisible: visible,
    studentClassRecords: data,
    showClassRecordModal: showModal,
    handleClassRecordModalCancel: hideModal
  };
}; 