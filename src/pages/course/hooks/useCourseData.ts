import { useState } from 'react';
import { message } from 'antd';
import { Course, CourseSearchParams } from '../types/course';
import { mockCourses } from '../constants/mockData';
import dayjs from 'dayjs';

export const useCourseData = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [total, setTotal] = useState(mockCourses.length);
  const [loading, setLoading] = useState(false);
  
  // 添加课程
  const addCourse = (values: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'consumedHours'>) => {
    const newCourse: Course = {
      id: `C${10000 + Math.floor(Math.random() * 90000)}`,
      ...values,
      consumedHours: 0,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      coaches: values.coaches || []
    };
    
    setCourses([newCourse, ...courses]);
    setFilteredCourses(prev => [newCourse, ...prev]);
    setTotal(prev => prev + 1);
    message.success('课程添加成功');
    return newCourse;
  };

  // 更新课程
  const updateCourse = (id: string, values: Partial<Course>) => {
    const updatedCourses = courses.map(course => 
      course.id === id 
        ? { 
            ...course, 
            ...values,
            updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          } 
        : course
    );
    
    setCourses(updatedCourses);
    setFilteredCourses(prevFiltered => 
      prevFiltered.map(course => 
        course.id === id 
          ? { 
              ...course, 
              ...values,
              updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            } 
          : course
      )
    );
    
    message.success('课程信息已更新');
  };

  // 删除课程
  const deleteCourse = (id: string) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
    setFilteredCourses(prevFiltered => prevFiltered.filter(course => course.id !== id));
    setTotal(prev => prev - 1);
    message.success('课程已删除');
  };

  // 过滤课程数据
  const filterCourses = (page: number, pageSize: number, params: CourseSearchParams) => {
    setLoading(true);
    
    try {
      // 模拟API调用
      setTimeout(() => {
        let result = [...courses];
        const { searchText, selectedCategory, selectedStatus, sortOrder } = params;

        // 搜索文本过滤
        if (searchText) {
          result = result.filter(
            course =>
              course.name.toLowerCase().includes(searchText.toLowerCase()) ||
              course.id.toLowerCase().includes(searchText.toLowerCase())
          );
        }

        // 分类过滤
        if (selectedCategory) {
          result = result.filter(course => course.category === selectedCategory);
        }

        // 状态过滤
        if (selectedStatus) {
          result = result.filter(course => course.status === selectedStatus);
        }
        
        // 排序
        if (sortOrder) {
          switch (sortOrder) {
            case 'priceAsc':
              result.sort((a, b) => a.unitPrice - b.unitPrice);
              break;
            case 'priceDesc':
              result.sort((a, b) => b.unitPrice - a.unitPrice);
              break;
            case 'hoursAsc':
              result.sort((a, b) => a.totalHours - b.totalHours);
              break;
            case 'hoursDesc':
              result.sort((a, b) => b.totalHours - a.totalHours);
              break;
            case 'consumedHoursAsc':
              result.sort((a, b) => a.consumedHours - b.consumedHours);
              break;
            case 'consumedHoursDesc':
              result.sort((a, b) => b.consumedHours - a.consumedHours);
              break;
            case 'latestUpdate':
              result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
              break;
            default:
              break;
          }
        }

        // 计算总数并分页
        setTotal(result.length);
        
        // 分页
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = result.slice(start, end);
        
        setFilteredCourses(paginatedData);
        setLoading(false);
      }, 500); // 模拟加载延迟
    } catch (error) {
      message.error('获取课程列表失败');
      console.error(error);
      setLoading(false);
    }
  };

  // 重置过滤
  const resetFilters = () => {
    setFilteredCourses(courses.slice(0, 10)); // 重置为第一页数据
    setTotal(courses.length);
  };

  return {
    courses: filteredCourses,
    totalCount: total,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    filterCourses,
    resetFilters
  };
}; 