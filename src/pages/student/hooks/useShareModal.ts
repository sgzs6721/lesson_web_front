import { useState } from 'react';
import { Form, message } from 'antd';
import { Student } from '../types/student';
import { SimpleCourse } from '@/api/course/types';

export interface UseShareModalResult {
  visible: boolean;
  form: any;
  loading: boolean;
  currentStudent: (Student & { selectedCourseId?: string; selectedCourseName?: string }) | null;
  targetCourseCoachNames: string[];
  handleShare: (student: Student & { selectedCourseId?: string; selectedCourseName?: string }) => void;
  handleCancel: () => void;
  handleSubmit: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export default function useShareModal(courseList: SimpleCourse[] = []): UseShareModalResult {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<(Student & { selectedCourseId?: string; selectedCourseName?: string }) | null>(null);
  const [targetCourseCoachNames, setTargetCourseCoachNames] = useState<string[]>([]);

  const handleShare = (student: Student & { selectedCourseId?: string; selectedCourseName?: string }) => {
    setCurrentStudent(student);
    form.resetFields();
    form.setFieldsValue({
      studentName: student.name,
      fromCourseName: (student as any).selectedCourseName,
      fromCourseId: (student as any).selectedCourseId,
    });
    setTargetCourseCoachNames([]);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setCurrentStudent(null);
    setTargetCourseCoachNames([]);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // 这里暂未对接后端接口，仅做成功提示
      message.success('共享成功');

      // 提交后派发预览事件，供列表即时展示
      try {
        const studentId = (currentStudent as any)?.id || (currentStudent as any)?.studentId;
        const fromCourseId = values.fromCourseId;
        const targetCourseId = values.targetCourseId;
        const target = courseList.find(c => String(c.id) === String(targetCourseId));
        const toCourseName = target?.name || '';
        window.dispatchEvent(new CustomEvent('student:share:preview', {
          detail: { studentId, fromCourseId, toCourseName }
        }));
      } catch {}

      // 刷新列表/摘要（如果后端已更新）
      try { window.dispatchEvent(new Event('student:list-summary:refresh')); } catch {}

      handleCancel();
    } catch (error) {
      // 校验失败不处理
    } finally {
      setLoading(false);
    }
  };

  return {
    visible,
    form,
    loading,
    currentStudent,
    targetCourseCoachNames,
    handleShare,
    handleCancel,
    handleSubmit,
    setLoading,
  };
} 