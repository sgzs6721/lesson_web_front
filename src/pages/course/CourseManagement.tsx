import React, { useState, useEffect, useRef } from 'react';
import { Typography, Card } from 'antd';
import CourseTable from './components/CourseTable';
import CourseCardList from './components/CourseCardList';
import CourseSearchBar from './components/CourseSearchBar';
import CourseEditModal from './components/CourseEditModal';
import CourseDetailModal from './components/CourseDetailModal';
import CourseDeleteModal from './components/CourseDeleteModal';
import CourseViewToggle from './components/CourseViewToggle';
import { useCourseData } from './hooks/useCourseData';
import { useCourseSearch } from './hooks/useCourseSearch';
import { useCourseForm } from './hooks/useCourseForm';
import { Course } from './types/course';
import { coach as coachAPI } from '@/api/coach';
import { CoachSimple } from '@/api/coach/types';
import './components/CourseManagement.css';

const { Title } = Typography;

const CourseManagement: React.FC = () => {
  // 初始加载引用
  const initialLoadRef = useRef(true);

  // 使用数据管理钩子
  const {
    courses,
    totalCount,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    filterCourses,
    resetFilters
  } = useCourseData();

  // 当前页码和页面大小
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 使用搜索功能钩子
  const {
    searchParams,
    setSearchText,
    setSelectedType,
    setSelectedStatus,
    setSortOrder,
    handleSearch,
    handleReset
  } = useCourseSearch(async (params) => {
    setCurrentPage(1); // 重置到第一页
    return filterCourses(1, pageSize, params);
  })

  // 教练列表状态 - 不再在这里管理教练列表
  const [coaches, setCoaches] = useState<CoachSimple[]>([]);

  // 使用表单管理钩子
  const {
    form,
    visible,
    editingCourse,
    loading: formLoading,
    handleAdd: originalHandleAdd,
    handleEdit: originalHandleEdit,
    handleSubmit,
    handleCancel
  } = useCourseForm(addCourse, updateCourse, coaches);

  // 包装添加和编辑函数
  const handleAdd = () => {
    originalHandleAdd();
  };

  const handleEdit = (record: Course) => {
    originalHandleEdit(record);
  };

  // 视图模式
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  // 详情模态框状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);

  // 删除确认模态框状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<{ id: string; name: string } | null>(null);

  // 加载课程数据
  const loadCourses = async (page = currentPage, size = pageSize) => {
    try {
      console.log('加载课程数据, 页码:', page, '页大小:', size);
      await filterCourses(page, size, searchParams);
    } catch (error) {
      console.error('加载课程数据失败:', error);
    }
  };

  // 首次加载获取数据
  useEffect(() => {
    // 使用setTimeout确保在组件挂载后再加载数据
    const timer = setTimeout(() => {
      if (initialLoadRef.current) {
        console.log('首次加载课程数据');
        loadCourses();
        initialLoadRef.current = false;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 处理分页变化
  const handlePageChange = async (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    loadCourses(page, size);
  };

  // 处理查看详情
  const handleShowDetail = (record: Course) => {
    setDetailCourse(record);
    setDetailModalVisible(true);
  };

  // 处理删除确认
  const showDeleteConfirm = (id: string, name: string) => {
    setDeletingCourse({ id, name });
    setDeleteModalVisible(true);
  };

  // 执行删除
  const handleDelete = async () => {
    if (deletingCourse) {
      try {
        await deleteCourse(deletingCourse.id);
        setDeleteModalVisible(false);
        setDeletingCourse(null);
      } catch (error) {
        // 错误已在 deleteCourse 中处理，这里不需要额外处理
        console.error('删除课程失败:', error);
      }
    }
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingCourse(null);
  };

  return (
    <div className="course-management">
      <Card className="course-management-card">
        <div className="course-header">
          <Title level={4} className="course-title">课程管理</Title>
          <CourseViewToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddCourse={handleAdd}
          />
        </div>
        {/* 搜索栏 */}
        <CourseSearchBar
          params={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          onTextChange={setSearchText}
          onCategoryChange={setSelectedType}
          onStatusChange={setSelectedStatus}
          onSortOrderChange={setSortOrder}
        />

        {/* 数据展示 - 根据视图模式显示表格或卡片 */}
        {viewMode === 'list' ? (
          <CourseTable
            data={courses}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalCount}
            onShowDetail={handleShowDetail}
            onEdit={handleEdit}
            onDelete={showDeleteConfirm}
            onPageChange={handlePageChange}
          />
        ) : (
          <CourseCardList
            data={courses}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalCount}
            onEdit={handleEdit}
            onDelete={showDeleteConfirm}
            onPageChange={handlePageChange}
          />
        )}
      </Card>

      {/* 编辑/添加模态框 */}
      <CourseEditModal
        visible={visible}
        editingCourse={editingCourse}
        loading={formLoading}
        form={form}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      {/* 详情模态框 */}
      <CourseDetailModal
        visible={detailModalVisible}
        course={detailCourse}
        onCancel={() => setDetailModalVisible(false)}
      />

      {/* 删除确认模态框 */}
      <CourseDeleteModal
        visible={deleteModalVisible}
        courseName={deletingCourse?.name || ''}
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default CourseManagement;