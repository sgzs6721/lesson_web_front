import { useState, useEffect } from 'react';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';

export interface StudentSourceOption {
  value: string;
  label: string;
  description?: string;
  id: number; // 添加id字段
}

export const useStudentSourceOptions = () => {
  const [options, setOptions] = useState<StudentSourceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultSourceId, setDefaultSourceId] = useState<number | null>(null);

  const fetchStudentSourceOptions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const constants = await API.constants.getListByType('STUDENT_SOURCE');
      
      const studentSourceOptions: StudentSourceOption[] = constants
        .filter(constant => constant.status !== 0) // 只显示启用的选项
        .map(constant => ({
          value: constant.constantKey,
          label: constant.constantValue,
          description: constant.description,
          id: constant.id
        }));
      
      setOptions(studentSourceOptions);
      
      // 找到"其他"选项作为默认值
      const otherOption = studentSourceOptions.find(option => 
        option.label === '其他' || option.value === 'OTHER'
      );
      if (otherOption) {
        setDefaultSourceId(otherOption.id);
      }
    } catch (err) {
      console.error('获取学员来源选项失败:', err);
      setError(err instanceof Error ? err.message : '获取学员来源选项失败');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentSourceOptions();
  }, []);

  return {
    options,
    loading,
    error,
    defaultSourceId,
    refetch: fetchStudentSourceOptions
  };
}; 