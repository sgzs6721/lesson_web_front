import { useState, useRef } from 'react';
import { Coach } from '../types/coach';
import { message } from 'antd';
import { API } from '@/api';
import { Coach as ApiCoach } from '@/api/coach/types';

// 将API返回的Coach类型转换为页面使用的Coach类型
export const convertApiCoachToCoach = (apiCoach: any): Coach => {
  // 处理hireDate格式，如果是数组，则转换为YYYY-MM-DD格式
  const formatDate = (dateArray: number[] | string) => {
    if (Array.isArray(dateArray)) {
      return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
    }
    return dateArray;
  };

  // 处理certifications，确保其为数组
  const certifications = apiCoach.certifications || [];

  // 记录原始API响应用于调试
  console.log('API返回的教练数据:', apiCoach);

  // 构建转换后的教练对象
  const coach: any = {
    id: String(apiCoach.id), // 确保id是字符串类型
    name: apiCoach.name,
    gender: apiCoach.gender,
    age: apiCoach.age,
    phone: apiCoach.phone,
    avatar: apiCoach.avatar,
    jobTitle: apiCoach.jobTitle,
    certifications: certifications,
    experience: apiCoach.experience, 
    status: apiCoach.status,
    hireDate: formatDate(apiCoach.hireDate),
    // 从salary对象中提取工资信息，如果存在
    baseSalary: apiCoach.salary?.baseSalary || apiCoach.baseSalary || 0,
    socialInsurance: apiCoach.salary?.socialInsurance || apiCoach.socialInsurance || 0,
    classFee: apiCoach.salary?.classFee || apiCoach.classFee || 0,
    performanceBonus: apiCoach.salary?.performanceBonus || apiCoach.performanceBonus || 0,
    commission: apiCoach.salary?.commission || apiCoach.commission || 0,
    dividend: apiCoach.salary?.dividend || apiCoach.dividend || 0,
    campusId: apiCoach.campusId,
    campusName: apiCoach.campusName,
    // 保存其他有用的信息
    institutionId: apiCoach.institutionId,
    institutionName: apiCoach.institutionName
  };

  // 如果API返回的数据中包含salary对象，则保留该对象
  if (apiCoach.salary) {
    coach.salary = {
      ...apiCoach.salary
    };
    console.log('保存嵌套的salary对象:', coach.salary);
  }

  return coach as Coach;
};

// 创建一个共享的教练详情缓存，用于跨组件共享
export const coachDetailCache: Record<string, Coach> = {};

export const useCoachDetail = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [viewingCoach, setViewingCoach] = useState<Coach | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取教练详情
  const fetchCoachDetail = async (id: string | number) => {
    setLoading(true);
    try {
      // 检查缓存中是否已有此教练数据
      const stringId = String(id);
      if (coachDetailCache[stringId]) {
        console.log('使用缓存的教练详情数据:', stringId);
        return coachDetailCache[stringId];
      }

      // 如果缓存中没有，则调用API获取
      const apiCoachDetail = await API.coach.getDetail(id);
      if (apiCoachDetail) {
        // 转换为页面使用的Coach类型
        const coach = convertApiCoachToCoach(apiCoachDetail);
        // 存入缓存
        coachDetailCache[stringId] = coach;
        return coach;
      }
      return null;
    } catch (error) {
      message.error('获取教练详情失败');
      console.error('获取教练详情失败:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 显示教练详情
  const showDetail = async (record: Coach) => {
    // 先显示模态框和加载状态
    setDetailVisible(true);
    setLoading(true);
    setViewingCoach(null); // 先清空数据，显示加载中

    try {
      // 检查缓存中是否已有此教练详情
      const stringId = String(record.id);
      if (coachDetailCache[stringId]) {
        console.log('使用缓存的教练详情数据:', stringId);
        setViewingCoach(coachDetailCache[stringId]);
        setLoading(false);
        return;
      }

      // 通过API获取完整的教练详情
      const coachDetail = await fetchCoachDetail(record.id);
      if (coachDetail) {
        setViewingCoach(coachDetail);
      } else {
        // 如果获取详情失败，则关闭模态框
        message.error('无法获取教练详情');
        setDetailVisible(false);
      }
    } catch (error) {
      console.error('显示教练详情失败:', error);
      message.error('获取教练详情失败');
      setDetailVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // 清除特定ID的缓存
  const clearCoachCache = (id: string) => {
    if (coachDetailCache[id]) {
      delete coachDetailCache[id];
      console.log('已清除教练详情缓存:', id);
    }
  };

  // 清除所有缓存
  const clearAllCoachCache = () => {
    Object.keys(coachDetailCache).forEach(key => {
      delete coachDetailCache[key];
    });
    console.log('已清除所有教练详情缓存');
  };

  // 关闭详情模态框
  const closeDetail = () => {
    setDetailVisible(false);
    setViewingCoach(null);
  };

  // 显示删除确认
  const showDeleteConfirm = (id: string) => {
    setRecordToDelete(id);
    setDeleteModalVisible(true);
  };

  // 取消删除
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  return {
    detailVisible,
    viewingCoach,
    deleteModalVisible,
    recordToDelete,
    loading,
    fetchCoachDetail,
    showDetail,
    closeDetail,
    showDeleteConfirm,
    cancelDelete,
    clearCoachCache,
    clearAllCoachCache
  };
}; 