import { useState } from 'react';
import { Coach, CoachSearchParams } from '../types/coach';
import { message } from 'antd';
import { generateCoachId } from '../utils/formatters';
import { API } from '@/api';
import { CoachGender, CoachStatus } from '@/api/coach/types';

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
      // 构建API请求参数
      const apiParams = {
        pageNum: currentPage,
        pageSize: pageSize,
        keyword: params?.searchText,
        status: params?.selectedStatus as CoachStatus,
        jobTitle: params?.selectedJobTitle,
        sortField: params?.sortField,
        sortOrder: 'desc' as 'asc' | 'desc' // 默认降序
      };

      // 调用API获取教练列表
      const response = await API.coach.getList(apiParams);

      // 将API返回的数据映射到组件状态
      setTotal(response.total);

      // 将API返回的教练数据映射到组件使用的Coach类型
      const mappedCoaches = response.list.map(apiCoach => ({
        id: apiCoach.id.toString(),
        name: apiCoach.name,
        gender: apiCoach.gender,
        age: apiCoach.age,
        phone: apiCoach.phone,
        avatar: apiCoach.avatar,
        jobTitle: apiCoach.jobTitle,
        certifications: apiCoach.certifications,
        experience: apiCoach.experience,
        status: apiCoach.status,
        hireDate: apiCoach.hireDate,
        baseSalary: apiCoach.baseSalary,
        socialInsurance: apiCoach.socialInsurance,
        classFee: apiCoach.classFee,
        performanceBonus: apiCoach.performanceBonus,
        commission: apiCoach.commission,
        dividend: apiCoach.dividend,
        campusId: apiCoach.campusId
      }));

      setCoaches(mappedCoaches);
    } catch (error) {
      message.error('获取教练列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 添加教练
  const addCoach = async (values: Omit<Coach, 'id'>) => {
    try {
      // 确保campusId非空
      const campusId = values.campusId || localStorage.getItem('currentCampusId') || 1;
      
      // 构建API请求参数
      const apiParams = {
        name: values.name,
        gender: values.gender as CoachGender,
        age: values.age,
        phone: values.phone,
        avatar: values.avatar,
        jobTitle: values.jobTitle,
        certifications: values.certifications,
        experience: values.experience,
        status: values.status as CoachStatus,
        hireDate: values.hireDate,
        baseSalary: values.baseSalary,
        socialInsurance: values.socialInsurance,
        classFee: values.classFee,
        performanceBonus: values.performanceBonus,
        commission: values.commission,
        dividend: values.dividend,
        campusId: campusId,
        // 包含薪资生效日期
        salaryEffectiveDate: values.salaryEffectiveDate
      };

      // 如果values中有salary对象，也添加到请求参数中
      if (values.salary) {
        (apiParams as any).salary = values.salary;
      }

      // 调用API创建教练
      const newId = await API.coach.create(apiParams);

      // 创建成功后刷新列表
      message.success('教练添加成功');

      // 返回新创建的教练对象
      const newCoach: Coach = {
        id: newId.toString(),
        ...values,
        campusId: campusId
      };

      // 更新列表和总数
      setCoaches(prevCoaches => [newCoach, ...prevCoaches]);
      setTotal(prev => prev + 1);

      return newCoach;
    } catch (error) {
      message.error('添加教练失败');
      console.error(error);
      throw error;
    }
  };

  // 更新教练
  const updateCoach = async (id: string, values: Partial<Coach>) => {
    try {
      // 查找当前教练对象
      const currentCoach = coaches.find(coach => coach.id === id);
      if (!currentCoach) {
        throw new Error('教练不存在');
      }

      // 合并当前教练数据和更新值
      const updatedCoach = { ...currentCoach, ...values };
      
      // 确保campusId非空
      const campusId = updatedCoach.campusId || localStorage.getItem('currentCampusId') || 1;

      // 构建API请求参数
      const apiParams = {
        id: id,
        name: updatedCoach.name,
        gender: updatedCoach.gender as CoachGender,
        age: updatedCoach.age,
        phone: updatedCoach.phone,
        avatar: updatedCoach.avatar,
        jobTitle: updatedCoach.jobTitle,
        certifications: updatedCoach.certifications,
        experience: updatedCoach.experience,
        status: updatedCoach.status as CoachStatus,
        hireDate: updatedCoach.hireDate,
        baseSalary: updatedCoach.baseSalary,
        socialInsurance: updatedCoach.socialInsurance,
        classFee: updatedCoach.classFee,
        performanceBonus: updatedCoach.performanceBonus,
        commission: updatedCoach.commission,
        dividend: updatedCoach.dividend,
        campusId: campusId,
        // 包含薪资生效日期
        salaryEffectiveDate: updatedCoach.salaryEffectiveDate
      };

      // 如果updatedCoach中有salary对象，也添加到请求参数中
      if (updatedCoach.salary || values.salary) {
        (apiParams as any).salary = updatedCoach.salary || values.salary;
      }

      // 调用API更新教练
      await API.coach.update(apiParams);

      // 更新成功后更新本地状态
      setCoaches(prevCoaches =>
        prevCoaches.map(coach =>
          coach.id === id
            ? { ...coach, ...values }
            : coach
        )
      );

      message.success('教练信息已更新');
    } catch (error) {
      message.error('更新教练信息失败');
      console.error(error);
      throw error;
    }
  };

  // 删除教练
  const deleteCoach = async (id: string) => {
    try {
      // 调用API删除教练
      await API.coach.delete(id);

      // 删除成功后更新本地状态
      setCoaches(prevCoaches => prevCoaches.filter(coach => coach.id !== id));
      setTotal(prev => prev - 1);

      message.success('教练已删除');
    } catch (error) {
      message.error('删除教练失败');
      console.error(error);
      throw error;
    }
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