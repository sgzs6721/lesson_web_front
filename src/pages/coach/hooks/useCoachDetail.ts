import { useState } from 'react';
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

  return {
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
    baseSalary: apiCoach.salary?.baseSalary || apiCoach.baseSalary,
    socialInsurance: apiCoach.salary?.socialInsurance || apiCoach.socialInsurance,
    classFee: apiCoach.salary?.classFee || apiCoach.classFee,
    performanceBonus: apiCoach.salary?.performanceBonus || apiCoach.performanceBonus,
    commission: apiCoach.salary?.commission || apiCoach.commission,
    dividend: apiCoach.salary?.dividend || apiCoach.dividend,
    campusId: apiCoach.campusId,
    campusName: apiCoach.campusName,
    // 保存其他有用的信息
    institutionId: apiCoach.institutionId,
    institutionName: apiCoach.institutionName,
    salaryEffectiveDate: apiCoach.salary?.effectiveDate ? formatDate(apiCoach.salary.effectiveDate) : undefined
  };
};

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
      const apiCoachDetail = await API.coach.getDetail(id);
      // 转换为页面使用的Coach类型
      return apiCoachDetail ? convertApiCoachToCoach(apiCoachDetail) : null;
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
    try {
      // 通过API获取完整的教练详情
      const coachDetail = await fetchCoachDetail(record.id);
      if (coachDetail) {
        setViewingCoach(coachDetail);
        setDetailVisible(true);
      }
    } catch (error) {
      console.error('显示教练详情失败:', error);
    }
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
  };
}; 