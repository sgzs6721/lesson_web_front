import { useState } from 'react';
import { Student, ClassRecord } from '@/api/student/types';
import { API } from '@/api';
import { message } from 'antd';

/**
 * 课程记录模态框相关的hook
 * @returns 课程记录模态框相关的状态和函数
 */
export const useClassRecordModal = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    student: Student | null;
    records: ClassRecord[];
  }>({
    student: null,
    records: []
  });

  // 显示课程记录模态框
  const showModal = async (student: Student) => {
    try {
      setLoading(true);
      setData({
        student,
        records: []
      });
      setVisible(true);

      // 从 API 获取学生课程记录
      const records = await API.student.getClassRecords(student.id);

      setData({
        student,
        records
      });
    } catch (error) {
      console.error('获取课程记录失败:', error);
      message.error('获取课程记录失败');
    } finally {
      setLoading(false);
    }
  };

  // 关闭课程记录模态框
  const hideModal = () => {
    setVisible(false);
    setData({
      student: null,
      records: []
    });
  };

  return {
    classRecordModalVisible: visible,
    studentClassRecords: data,
    classRecordLoading: loading,
    showClassRecordModal: showModal,
    handleClassRecordModalCancel: hideModal
  };
};