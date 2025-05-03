import { useState } from 'react';
import { message } from 'antd';
import { Course, CourseSearchParams, CourseType, CourseStatus } from '../types/course';
import { course as courseAPI } from '@/api/course';
import { CourseCreateRequest, CourseUpdateRequest } from '@/api/course/types';

export const useCourseData = () => {
  // 存储所有课程数据，用于重置过滤器
  const [allCourses, setCourses] = useState<Course[]>([]);
  // 当前展示的过滤后的课程数据
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 添加课程
  const addCourse = async (values: CourseCreateRequest) => {
    setLoading(true);
    try {
      // 调用API添加课程
      const courseId = await courseAPI.add(values);

      // 构造新课程对象，直接使用提交的表单数据
      const newCourse: Course = {
        id: courseId,
        name: values.name,
        type: String(values.typeId), // 前端会在表单中显示实际的课程类型名称
        status: values.status,
        unitHours: values.unitHours,
        totalHours: values.totalHours,
        consumedHours: 0, // 新课程消耗课时为0
        price: values.price,
        coachFee: 0, // 设置默认的教练费用
        campusId: values.campusId,
        institutionId: 1, // 默认机构ID
        description: values.description || '',
        createdTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        coaches: values.coachIds ? values.coachIds.map((id: any) => {
          return {
            id: Number(id),
            name: `教练${id}` // 使用简单名称，下次刷新列表时会自动获取完整信息
          };
        }) : []
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
  const updateCourse = async (id: string, values: Omit<CourseUpdateRequest, 'id'>) => {
    setLoading(true);
    try {
      // 准备更新请求数据
      const updateData: CourseUpdateRequest = {
        id,
        ...values
      };

      // 调用API更新课程
      await courseAPI.update(updateData);

      // 根据更新的数据构造更新后的课程对象
      // 先找到原课程对象
      const originalCourse = filteredCourses.find(course => course.id === id);

      if (!originalCourse) {
        throw new Error('找不到要更新的课程');
      }

      // 获取课程类型名称
      let typeName = originalCourse.type;
      if (values.typeId && values.typeId !== Number(originalCourse.type)) {
        const courseTypeList = await import('@/api/constants').then(module => module.constants.getList('COURSE_TYPE'));
        const courseType = courseTypeList.find(type => type.id === Number(values.typeId));
        if (courseType) {
          typeName = courseType.constantValue;
        }
      }

      // 获取教练名称
      let coachesWithNames = originalCourse.coaches;
      if (values.coachIds) {
        const currentCampusId = values.campusId || originalCourse.campusId || localStorage.getItem('currentCampusId') || '1';
        const coachList = await import('@/api/coach').then(module => module.coach.getSimpleList(currentCampusId));

        coachesWithNames = values.coachIds.map((id: any) => {
          // 尝试保留原教练名称
          const originalCoach = originalCourse.coaches?.find(coach => coach.id === Number(id));
          if (originalCoach?.name) {
            return originalCoach;
          }
          // 从教练列表中查找对应的教练名称
          const coach = coachList.find(coach => coach.id === Number(id));
          return {
            id: Number(id),
            name: coach?.name || `教练${id}` // 如果找不到教练名称，显示默认名称
          };
        });
      }

      // 构造更新后的课程对象
      const updatedCourse: Course = {
        ...originalCourse,
        name: values.name || originalCourse.name,
        type: typeName, // 使用课程类型名称而不是ID
        status: values.status || originalCourse.status,
        unitHours: values.unitHours || originalCourse.unitHours,
        totalHours: values.totalHours || originalCourse.totalHours,
        price: values.price || originalCourse.price,
        description: values.description !== undefined ? values.description : originalCourse.description,
        updateTime: new Date().toISOString(),
        coaches: coachesWithNames
      };

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