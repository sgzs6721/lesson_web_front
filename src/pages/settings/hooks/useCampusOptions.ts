import { useState, useEffect } from 'react';
import { campus } from '../../../api/campus';

// 校区选项类型
interface CampusOption {
  value: string;
  label: string;
}

export const useCampusOptions = () => {
  const [campusOptions, setCampusOptions] = useState<CampusOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取校区列表
  const fetchCampusOptions = async () => {
    setLoading(true);
    setError(null);

    try {
      // 调用API获取校区简单列表
      const campusList = await campus.getSimpleList();
      console.log('获取到的校区列表:', campusList);

      // 转换为选项格式
      const options = campusList
        // 先按id排序
        .sort((a, b) => {
          // 将id转换为数字进行比较
          const idA = typeof a.id === 'string' ? parseInt(a.id) : a.id;
          const idB = typeof b.id === 'string' ? parseInt(b.id) : b.id;
          return idA - idB;
        })
        // 然后转换为选项格式
        .map(item => ({
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
