import { useState } from 'react';
import { Coach, CoachSearchParams } from '../types/coach';
import { mockData } from '../constants/mockData';
import dayjs from 'dayjs';
import { message } from 'antd';
import { generateCoachId } from '../utils/formatters';

export const useCoachData = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 获取教练数据
  const fetchCoaches = async (
    currentPage: number, 
    pageSize: number, 
    params?: CoachSearchParams
  ) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 过滤数据
      let filteredData = mockData;
      
      if (params?.searchText) {
        filteredData = filteredData.filter(
          coach => 
            coach.name.includes(params.searchText) || 
            coach.id.includes(params.searchText) ||
            coach.phone.includes(params.searchText)
        );
      }
      
      if (params?.selectedStatus) {
        filteredData = filteredData.filter(coach => coach.status === params.selectedStatus);
      }

      // 添加职位过滤
      if (params?.selectedJobTitle) {
        filteredData = filteredData.filter(coach => coach.jobTitle === params.selectedJobTitle);
      }

      // 排序
      if (params?.sortField) {
        filteredData = [...filteredData].sort((a, b) => {
          if (params.sortField === 'experience') {
            return b.experience - a.experience;
          } else if (params.sortField === 'hireDate') {
            return dayjs(a.hireDate).isAfter(dayjs(b.hireDate)) ? -1 : 1;
          }
          return 0;
        });
      }

      // 分页
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);
      
      setTotal(filteredData.length);
      setCoaches(paginatedData);
    } catch (error) {
      message.error('获取教练列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 添加教练
  const addCoach = (values: Omit<Coach, 'id'>) => {
    const newCoach: Coach = {
      id: generateCoachId(coaches.length),
      ...values
    };
    setCoaches(prevCoaches => [newCoach, ...prevCoaches]);
    setTotal(prev => prev + 1);
    message.success('教练添加成功');
    return newCoach;
  };
  
  // 更新教练
  const updateCoach = (id: string, values: Partial<Coach>) => {
    setCoaches(prevCoaches => 
      prevCoaches.map(coach => 
        coach.id === id 
          ? { ...coach, ...values } 
          : coach
      )
    );
    message.success('教练信息已更新');
  };
  
  // 删除教练
  const deleteCoach = (id: string) => {
    setCoaches(prevCoaches => prevCoaches.filter(coach => coach.id !== id));
    setTotal(prev => prev - 1);
    message.success('教练已删除');
  };

  return {
    coaches,
    total,
    loading,
    fetchCoaches,
    addCoach,
    updateCoach,
    deleteCoach,
  };
}; 