import { useState, useEffect, useRef } from 'react';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';

// 费用类别选项Hook
export const useExpenseCategories = (transactionType: 'EXPEND' | 'INCOME' | null | undefined) => {
  const [categories, setCategories] = useState<{ label: string; value: number; type?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 防重复请求的ref
  const lastRequestTimeRef = useRef<number>(0);
  const lastRequestTypeRef = useRef<'EXPEND' | 'INCOME' | null | undefined>(undefined);
  const requestPromiseRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    // 如果传入 undefined，则不发起请求（用于优化性能）
    if (transactionType === undefined) {
      return;
    }

    const now = Date.now();
    const timeDiff = now - lastRequestTimeRef.current;

    // 如果距离上次请求不足500ms且请求参数相同，则不重复请求
    if (timeDiff < 500 && lastRequestTypeRef.current === transactionType) {
      return;
    }

    // 如果当前有正在进行的请求且参数相同，则复用该请求
    if (requestPromiseRef.current && lastRequestTypeRef.current === transactionType) {
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
          const type = transactionType;
          allCategories = await API.constants.getListByType(type);
          // 强制设置类型，以防API没有返回
          allCategories = allCategories.map(item => ({ ...item, type }));
        }
        
        // 转换为选项格式
        const options = allCategories.map((item: Constant) => ({
          label: item.constantValue,
          value: item.id,
          type: item.type // 保留类型信息供UI使用
        }));
        
        setCategories(options);
      } catch (error) {
        console.error('获取费用类别失败:', error);
        setCategories([]);
      } finally {
        setLoading(false);
        // 清除请求promise引用
        requestPromiseRef.current = null;
      }
    };

    // 记录请求信息
    lastRequestTimeRef.current = now;
    lastRequestTypeRef.current = transactionType;
    
    // 保存请求promise
    const promise = fetchCategories();
    requestPromiseRef.current = promise;

  }, [transactionType]);

  return {
    categories,
    loading
  };
};