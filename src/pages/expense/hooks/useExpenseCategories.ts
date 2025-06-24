import { useState, useEffect } from 'react';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';

// 费用类别选项Hook
export const useExpenseCategories = (transactionType: 'income' | 'expense' | null | undefined) => {
  const [categories, setCategories] = useState<{ label: string; value: string; type?: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 如果传入 undefined，则不发起请求（用于优化性能）
    if (transactionType === undefined) {
      return;
    }

    const fetchCategories = async () => {
      setLoading(true);
      try {
        let allCategories: Constant[] = [];

        if (!transactionType) {
          // 如果交易类型为 null，获取所有类别（支出 + 收入）
          allCategories = await API.constants.getListByTypes(['EXPEND', 'INCOME']);
          
          // 按类型排序：先支出，后收入
          allCategories.sort((a, b) => {
            if (a.type === 'EXPEND' && b.type === 'INCOME') return -1;
            if (a.type === 'INCOME' && b.type === 'EXPEND') return 1;
            return a.constantValue.localeCompare(b.constantValue);
          });
        } else {
          // 根据交易类型获取对应的类别
          const type = transactionType === 'expense' ? 'EXPEND' : 'INCOME';
          allCategories = await API.constants.getListByType(type);
          // 强制设置类型，以防API没有返回
          allCategories = allCategories.map(item => ({ ...item, type }));
        }
        
        // 转换为选项格式
        const options = allCategories.map((item: Constant) => ({
          label: item.constantValue,
          value: item.constantValue,
          type: item.type // 保留类型信息供UI使用
        }));
        
        setCategories(options);
      } catch (error) {
        console.error('获取费用类别失败:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [transactionType]);

  return {
    categories,
    loading
  };
};