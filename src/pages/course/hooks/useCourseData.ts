import { useState } from 'react';
import { message } from 'antd';
import { Course, CourseSearchParams, CourseType, CourseStatus } from '../types/course';
import { course as courseAPI } from '@/api/course';
import { CourseCreateRequest, CourseUpdateRequest } from '@/api/course/types';
import { CoachSimple } from '@/api/coach/types';
import { constants } from '@/api/constants';
import { getTypeNameById } from '../constants/courseOptions';

export const useCourseData = () => {
  // 存储所有课程数据，用于重置过滤器
  const [allCourses, setCourses] = useState<Course[]>([]);
  // 当前展示的过滤后的课程数据
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 添加课程
  const addCourse = async (values: CourseCreateRequest, coaches: CoachSimple[] = []) => {
    setLoading(true);
    try {
      // 确保有校区ID
      const campusId = values.campusId || Number(localStorage.getItem('currentCampusId') || '1');
      
      // 准备创建请求数据，确保包含所有必需字段
      const createData: CourseCreateRequest = {
        ...values,
        campusId: campusId // 确保campusId不为null
      };

      console.log('提交到API的创建数据:', createData);
      
      // 调用API添加课程
      const courseId = await courseAPI.add(createData);

      // 对于教练信息，从教练列表中获取真实姓名
      const courseCoaches = values.coachIds ? values.coachIds.map((id: any) => {
        const coach = coaches.find(c => c.id === Number(id));
        return {
          id: Number(id),
          name: coach ? coach.name : `教练${id}` // 优先使用真实姓名，找不到时使用简单名称
        };
      }) : [];

      // 获取类型名称
      let typeName = getTypeNameById(values.typeId);
      console.log('添加课程使用的类型名称:', typeName);

      // 构造新课程对象，直接使用提交的表单数据
      const newCourse: Course = {
        id: courseId,
        name: values.name,
        type: typeName, // 使用类型名称而不是ID
        status: values.status,
        unitHours: values.unitHours,
        totalHours: values.unitHours, // 默认与单课时相同
        consumedHours: 0, // 新课程消耗课时为0
        price: values.price,
        coachFee: 0, // 设置默认的教练费用
        campusId: campusId, // 使用确保有值的campusId
        institutionId: 1, // 默认机构ID
        description: values.description || '',
        createdTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        coaches: courseCoaches
      };

      // 更新本地状态
      setCourses(prev => [newCourse, ...prev]);
      setFilteredCourses(prev => [newCourse, ...prev]);
      setTotal(prev => prev + 1);

      message.success('课程添加成功');
      return newCourse;
    } catch (error: any) {
      message.error(error.message || '添加课程失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 更新课程
  const updateCourse = async (id: string, values: Omit<CourseUpdateRequest, 'id'>, coaches: CoachSimple[] = []) => {
    setLoading(true);
    try {
      // 确保有校区ID
      const campusId = values.campusId || Number(localStorage.getItem('currentCampusId') || '1');
      
      // 准备更新请求数据，确保包含所有必需字段
      const updateData: CourseUpdateRequest = {
        id,
        ...values,
        campusId: campusId // 确保campusId不为null
      };

      console.log('提交到API的更新数据:', updateData);
      
      // 调用API更新课程
      await courseAPI.update(updateData);

      // 根据更新的数据构造更新后的课程对象
      // 先找到原课程对象
      const originalCourse = filteredCourses.find(course => course.id === id);

      if (!originalCourse) {
        throw new Error('找不到要更新的课程');
      }

      // 处理课程类型显示
      let typeName = originalCourse.type; // 默认保持原来的类型名称
      
      // 如果类型发生变化，尝试查找匹配的名称
      if (values.typeId && Number(values.typeId) !== Number(originalCourse.type)) {
        console.log('类型ID已更改:', `${originalCourse.type} -> ${values.typeId}`);
        
        // 使用辅助函数获取类型名称
        typeName = getTypeNameById(values.typeId);
        console.log('获取到的类型名称:', typeName);
      } else {
        console.log('类型ID未变化，保持原类型名称:', typeName);
      }

      // 使用提交的表单值更新课程，从教练列表中获取真实姓名
      const coachesWithNames = values.coachIds ? values.coachIds.map((id: any) => {
        // 先尝试从原教练信息中获取
        const originalCoach = originalCourse.coaches?.find(coach => coach.id === Number(id));
        if (originalCoach?.name) {
          return originalCoach;
        }
        // 如果找不到，从教练列表中查找
        const coach = coaches.find(c => c.id === Number(id));
        return {
          id: Number(id),
          name: coach ? coach.name : `教练${id}` // 优先使用真实姓名
        };
      }) : (originalCourse.coaches || []);

      // 获取最新的状态值，确保它是正确的格式
      let statusValue = values.status;
      console.log('更新操作的状态值:', statusValue);

      // 构造更新后的课程对象
      const updatedCourse: Course = {
        ...originalCourse,
        name: values.name || originalCourse.name,
        type: typeName, // 使用课程类型名称而不是ID
        status: statusValue, // 使用新的状态值
        unitHours: values.unitHours || originalCourse.unitHours,
        totalHours: values.unitHours || originalCourse.unitHours, // 与单课时相同
        price: values.price || originalCourse.price,
        campusId: campusId, // 更新校区ID
        description: values.description !== undefined ? values.description : originalCourse.description,
        updateTime: new Date().toISOString(),
        coaches: coachesWithNames
      };

      console.log('更新后的课程对象:', updatedCourse);
      console.log('更新后的状态值:', updatedCourse.status);

      // 更新本地状态
      setCourses(prevCourses =>
        prevCourses.map(course => course.id === id ? updatedCourse : course)
      );

      setFilteredCourses(prevFiltered =>
        prevFiltered.map(course => course.id === id ? updatedCourse : course)
      );

      message.success('课程信息已更新');
      return updatedCourse;
    } catch (error: any) {
      message.error(error.message || '更新课程失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 删除课程
  const deleteCourse = async (id: string) => {
    setLoading(true);
    try {
      // 调用API删除课程
      await courseAPI.delete(id);

      // 更新本地状态
      setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
      setFilteredCourses(prevFiltered => prevFiltered.filter(course => course.id !== id));
      setTotal(prev => prev - 1);

      message.success('课程已删除');
    } catch (error: any) {
      message.error(error.message || '删除课程失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 过滤课程数据
  const filterCourses = async (page: number, pageSize: number, params: CourseSearchParams) => {
    setLoading(true);

    try {
      // 构建 API 请求参数
      const apiParams: any = {
        pageNum: page,
        pageSize,
        searchText: params.searchText,
        selectedStatus: params.selectedStatus,
        sortOrder: params.sortOrder,
        campusId: params.campusId
      };

      // 添加课程类型过滤（支持多选）
      if (params.selectedType && params.selectedType.length > 0) {
        apiParams.typeIds = params.selectedType;
      }

      // 添加教练过滤（支持多选）
      if (params.selectedCoach && params.selectedCoach.length > 0) {
        apiParams.coachIds = params.selectedCoach;
      }

      // 调用API获取课程列表
      const result = await courseAPI.getList(apiParams);

      // 更新本地状态
      setFilteredCourses(result.list as unknown as Course[]);
      setTotal(result.total);

      // 如果是第一次加载，也更新全局课程列表
      if (page === 1 && !params.searchText && 
          (!params.selectedType || params.selectedType.length === 0) && 
          !params.selectedStatus) {
        setCourses(result.list as unknown as Course[]);
      }

      return result.list;
    } catch (error: any) {
      message.error(error.message || '获取课程列表失败');
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 重置过滤
  const resetFilters = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // 获取当前校区ID
      const currentCampusId = localStorage.getItem('currentCampusId');
      const campusId = currentCampusId ? Number(currentCampusId) : undefined;

      // 调用API获取课程列表，只带校区ID筛选条件
      const result = await courseAPI.getList({
        pageNum: page,
        pageSize,
        campusId
      });

      // 更新本地状态
      setFilteredCourses(result.list as unknown as Course[]);
      setCourses(result.list as unknown as Course[]);
      setTotal(result.total);

      return result.list;
    } catch (error: any) {
      message.error(error.message || '重置过滤失败');
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    courses: filteredCourses,
    allCourses,  // 返回所有课程数据，可用于高级筛选
    totalCount: total,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    filterCourses,
    resetFilters
  };
};