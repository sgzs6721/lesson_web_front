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

      // 获取新添加的课程详情
      const newCourse = await courseAPI.getDetail(courseId);

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

      // 获取更新后的课程详情
      const updatedCourse = await courseAPI.getDetail(id);

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
      // 调用API获取课程列表
      const result = await courseAPI.getList({
        page,
        pageSize,
        searchText: params.searchText,
        selectedType: params.selectedType,
        selectedStatus: params.selectedStatus,
        sortOrder: params.sortOrder,
        campusId: params.campusId
      });

      // 更新本地状态
      setFilteredCourses(result.list as unknown as Course[]);
      setTotal(result.total);

      // 如果是第一次加载，也更新全局课程列表
      if (page === 1 && !params.searchText && !params.selectedType && !params.selectedStatus) {
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
        page, 
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