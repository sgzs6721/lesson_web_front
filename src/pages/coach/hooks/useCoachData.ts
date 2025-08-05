import { useState } from 'react';
import { Coach, CoachSearchParams } from '../types/coach';
import { message } from 'antd';
import { generateCoachId } from '../utils/formatters';
import { API } from '@/api';
import { CoachGender, CoachStatus } from '@/api/coach/types';
import { coachDetailCache } from './useCoachDetail';

export const useCoachData = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 获取教练数据
  const fetchCoaches = async (
    currentPage: number,
    pageSize: number,
    params?: CoachSearchParams,
    sortField?: string,
    sortOrder?: 'ascend' | 'descend'
  ) => {
    setLoading(true);
    try {
      // 获取当前选中的校区ID
      const currentCampusId = localStorage.getItem('currentCampusId') || undefined;

      // 构建API请求参数
      const apiParams = {
        pageNum: currentPage,
        pageSize: pageSize,
        keyword: params?.searchText,
        status: params?.selectedStatus as CoachStatus,
        jobTitle: params?.selectedJobTitle,
        sortField: sortField || params?.sortField,
        sortOrder: (sortOrder === 'ascend' ? 'asc' : 'desc') as 'asc' | 'desc',
        campusId: currentCampusId // 添加当前校区ID
      };

      // 调用API获取教练列表
      const response = await API.coach.getList(apiParams);

      // 将API返回的数据映射到组件状态
      setTotal(response.total);

      // 从身份证号计算年龄的函数
      const calculateAgeFromIdNumber = (idNumber: string): number => {
        if (!idNumber || idNumber.length < 6) return 0;
        
        try {
          // 提取出生年份
          const year = parseInt(idNumber.substring(6, 10));
          const currentYear = new Date().getFullYear();
          return currentYear - year;
        } catch (error) {
          console.error('计算年龄失败:', error);
          return 0;
        }
      };

      // 从执教日期计算教龄的函数
      const calculateTeachingExperience = (coachingDate: string): number => {
        if (!coachingDate) return 0;
        
        try {
          const startDate = new Date(coachingDate);
          const currentDate = new Date();
          
          // 计算年份差
          let years = currentDate.getFullYear() - startDate.getFullYear();
          
          // 检查是否已经过了今年的执教日期
          const currentMonth = currentDate.getMonth();
          const currentDay = currentDate.getDate();
          const startMonth = startDate.getMonth();
          const startDay = startDate.getDate();
          
          // 如果还没到今年的执教日期，减1年
          if (currentMonth < startMonth || (currentMonth === startMonth && currentDay < startDay)) {
            years--;
          }
          
          return Math.max(0, years);
        } catch (error) {
          console.error('计算教龄失败:', error);
          return 0;
        }
      };

      // 将API返回的教练数据映射到组件使用的Coach类型
      const mappedCoaches = response.list.map(apiCoach => {
        const idNumber = apiCoach.idNumber || '';
        const coachingDate = apiCoach.coachingDate || apiCoach.hireDate;
        
        return {
          id: apiCoach.id.toString(),
          name: apiCoach.name,
          gender: apiCoach.gender,
          workType: apiCoach.workType || 'FULLTIME',
          idNumber: idNumber,
          phone: apiCoach.phone,
          avatar: apiCoach.avatar,
          jobTitle: apiCoach.jobTitle,
          certifications: apiCoach.certifications,
          coachingDate: coachingDate,
          status: apiCoach.status,
          hireDate: apiCoach.hireDate,
          // 正常情况下从后端API获取年龄和教龄
          age: apiCoach.age,
          experience: apiCoach.experience,
          baseSalary: apiCoach.baseSalary,
          guaranteedHours: apiCoach.guaranteedHours,
          socialInsurance: apiCoach.socialInsurance,
          classFee: apiCoach.classFee,
          performanceBonus: apiCoach.performanceBonus,
          commission: apiCoach.commission,
          dividend: apiCoach.dividend,
          campusId: apiCoach.campusId
        };
      });

      setCoaches(mappedCoaches);
    } catch (error) {
      message.error('获取教练列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 添加教练
  const addCoach = async (values: Omit<Coach, 'id'>): Promise<Coach> => {
    try {
      // 确保有校区ID
      const campusId = values.campusId || localStorage.getItem('currentCampusId') || '';
      if (!campusId) {
        throw new Error('未选择校区');
      }

      // 构建API请求参数
      const apiParams = {
        ...values,
        workType: values.workType || 'FULLTIME',
        idNumber: values.idNumber || '',
        coachingDate: values.coachingDate || values.hireDate,
        campusId: Number(campusId)
      };

      // 调用API创建教练
      const id = await API.coach.create(apiParams);

      // 从身份证号计算年龄的函数
      const calculateAgeFromIdNumber = (idNumber: string): number => {
        if (!idNumber || idNumber.length < 6) return 0;
        
        try {
          // 提取出生年份
          const year = parseInt(idNumber.substring(6, 10));
          const currentYear = new Date().getFullYear();
          return currentYear - year;
        } catch (error) {
          console.error('计算年龄失败:', error);
          return 0;
        }
      };

      // 从执教日期计算教龄的函数
      const calculateTeachingExperience = (coachingDate: string): number => {
        if (!coachingDate) return 0;
        
        try {
          const startDate = new Date(coachingDate);
          const currentDate = new Date();
          
          // 计算年份差
          let years = currentDate.getFullYear() - startDate.getFullYear();
          
          // 检查是否已经过了今年的执教日期
          const currentMonth = currentDate.getMonth();
          const currentDay = currentDate.getDate();
          const startMonth = startDate.getMonth();
          const startDay = startDate.getDate();
          
          // 如果还没到今年的执教日期，减1年
          if (currentMonth < startMonth || (currentMonth === startMonth && currentDay < startDay)) {
            years--;
          }
          
          return Math.max(0, years);
        } catch (error) {
          console.error('计算教龄失败:', error);
          return 0;
        }
      };

      // 创建新教练对象，包含计算出的年龄和教龄
      const newCoach: Coach = {
        ...values,
        id: String(id),
        age: calculateAgeFromIdNumber(values.idNumber || ''),
        experience: calculateTeachingExperience(values.coachingDate || values.hireDate || '')
      };

      // 更新本地状态 - 将新教练添加到列表最前面
      setCoaches(prevCoaches => [newCoach, ...prevCoaches]);
      // 更新总数
      setTotal(prev => prev + 1);

      message.success('教练已成功添加');
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
      const campusId = updatedCoach.campusId || localStorage.getItem('currentCampusId') || '';
      if (!campusId) {
        throw new Error('未选择校区');
      }

      // 构建API请求参数 - 符合后端接口格式
      const apiParams = {
        id: id,
        name: updatedCoach.name,
        gender: updatedCoach.gender as CoachGender,
        workType: updatedCoach.workType || 'FULLTIME',
        idNumber: updatedCoach.idNumber || '',
        phone: updatedCoach.phone,
        avatar: updatedCoach.avatar,
        jobTitle: updatedCoach.jobTitle,
        certifications: updatedCoach.certifications,
        coachingDate: updatedCoach.coachingDate || updatedCoach.hireDate,
        status: updatedCoach.status as CoachStatus,
        hireDate: updatedCoach.hireDate,
        // 薪资相关字段
        baseSalary: updatedCoach.baseSalary || 0,
        guaranteedHours: updatedCoach.guaranteedHours || 0,
        socialInsurance: updatedCoach.socialInsurance || 0,
        classFee: updatedCoach.classFee || 0,
        performanceBonus: updatedCoach.performanceBonus || 0,
        commission: updatedCoach.commission || 0,
        dividend: updatedCoach.dividend || 0,
        // 校区ID
        campusId: Number(campusId)
      };

      // 调用API更新教练
      await API.coach.update(apiParams);

      // 从身份证号计算年龄的函数
      const calculateAgeFromIdNumber = (idNumber: string): number => {
        if (!idNumber || idNumber.length < 6) return 0;
        
        try {
          // 提取出生年份
          const year = parseInt(idNumber.substring(6, 10));
          const currentYear = new Date().getFullYear();
          return currentYear - year;
        } catch (error) {
          console.error('计算年龄失败:', error);
          return 0;
        }
      };

      // 从执教日期计算教龄的函数
      const calculateTeachingExperience = (coachingDate: string): number => {
        if (!coachingDate) return 0;
        
        try {
          const startDate = new Date(coachingDate);
          const currentDate = new Date();
          
          // 计算年份差
          let years = currentDate.getFullYear() - startDate.getFullYear();
          
          // 检查是否已经过了今年的执教日期
          const currentMonth = currentDate.getMonth();
          const currentDay = currentDate.getDate();
          const startMonth = startDate.getMonth();
          const startDay = startDate.getDate();
          
          // 如果还没到今年的执教日期，减1年
          if (currentMonth < startMonth || (currentMonth === startMonth && currentDay < startDay)) {
            years--;
          }
          
          return Math.max(0, years);
        } catch (error) {
          console.error('计算教龄失败:', error);
          return 0;
        }
      };

      // 更新成功后更新本地状态
      // 创建一个完整的更新后的教练对象
      const updatedCoachForList = {
        ...currentCoach,  // 保留原始教练对象中的其他字段
        ...values,       // 更新提交的字段
        id: id,          // 确保 ID 不变
        // 更新后动态计算年龄和教龄（因为不会重新调用列表接口）
        age: calculateAgeFromIdNumber(values.idNumber || currentCoach.idNumber || ''),
        experience: calculateTeachingExperience(values.coachingDate || currentCoach.coachingDate || ''),
        // 确保这些字段存在，即使在 values 中没有提供
        baseSalary: values.baseSalary !== undefined ? values.baseSalary : currentCoach.baseSalary,
        socialInsurance: values.socialInsurance !== undefined ? values.socialInsurance : currentCoach.socialInsurance,
        classFee: values.classFee !== undefined ? values.classFee : currentCoach.classFee,
        performanceBonus: values.performanceBonus !== undefined ? values.performanceBonus : currentCoach.performanceBonus,
        commission: values.commission !== undefined ? values.commission : currentCoach.commission,
        dividend: values.dividend !== undefined ? values.dividend : currentCoach.dividend
      };

      // 将更新后的数据保存到缓存中
      const stringId = String(id);
      if (stringId) {
        // 如果缓存中已有数据，则更新缓存
        if (coachDetailCache[stringId]) {
          coachDetailCache[stringId] = {
            ...coachDetailCache[stringId],
            ...updatedCoachForList
          };
          console.log('在 updateCoach 中更新缓存:', stringId, coachDetailCache[stringId]);
        }
      }

      setCoaches(prevCoaches =>
        prevCoaches.map(coach =>
          coach.id === id
            ? updatedCoachForList
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

  // 更新教练状态
  const updateCoachStatus = async (id: string, newStatus: CoachStatus) => {
    try {
      // 查找当前教练对象
      const currentCoach = coaches.find(coach => coach.id === id);
      if (!currentCoach) {
        throw new Error('教练不存在');
      }

      // 构建 API 请求参数
      const apiParams = {
        id: Number(id), // 确保 ID 是数字类型
        status: newStatus as CoachStatus
      };

      console.log('发送状态更新请求:', apiParams);

      // 调用 API 更新教练状态
      await API.coach.updateStatus(apiParams);

      // 更新成功后更新本地状态
      const updatedCoach = { ...currentCoach, status: newStatus };

      // 更新缓存
      const stringId = String(id);
      if (coachDetailCache[stringId]) {
        coachDetailCache[stringId] = {
          ...coachDetailCache[stringId],
          status: newStatus
        };
        console.log('在 updateCoachStatus 中更新缓存:', stringId, coachDetailCache[stringId]);
      }

      // 更新列表数据
      setCoaches(prevCoaches =>
        prevCoaches.map(coach =>
          coach.id === id
            ? updatedCoach
            : coach
        )
      );

      message.success('教练状态已更新');
      return updatedCoach;
    } catch (error) {
      message.error('更新教练状态失败');
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
    updateCoachStatus,
    deleteCoach,
  };
};