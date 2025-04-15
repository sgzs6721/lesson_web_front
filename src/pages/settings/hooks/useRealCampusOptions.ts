import { useState, useEffect } from 'react';
import { getCampusList } from '@/components/CampusSelector';
import { Campus } from '@/api/campus/types';

// 校区选项类型
interface CampusOption {
  value: string;
  label: string;
}

export const useRealCampusOptions = () => {
  const [campusOptions, setCampusOptions] = useState<CampusOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取校区列表
  const fetchCampusOptions = async () => {
    setLoading(true);
    setError(null);

    try {
      // 使用共享的getCampusList函数获取校区列表
      const campusList = await getCampusList();
      console.log('从banner获取的校区列表:', campusList);

      // 转换为选项格式
      const options = campusList.map(item => ({
        value: String(item.id), // 确保值是字符串
        label: item.name
      }));

      setCampusOptions(options);
    } catch (err) {
      console.error('获取校区列表失败:', err);
      setError('获取校区列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取校区列表
  useEffect(() => {
    fetchCampusOptions();
  }, []);

  return {
    campusOptions,
    loading,
    error,
    refreshCampusOptions: fetchCampusOptions
  };
};
