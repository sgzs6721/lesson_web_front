import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CourseTable from './components/CourseTable';
import CourseCardList from './components/CourseCardList';
import CourseSearchBar from './components/CourseSearchBar';
import CourseEditModal from './components/CourseEditModal';
import CourseDetailModal from './components/CourseDetailModal';
import CourseDeleteModal from './components/CourseDeleteModal';
import ViewToggle from './components/ViewToggle';
import { useCourseData } from './hooks/useCourseData';
import { useCourseSearch } from './hooks/useCourseSearch';
import { useCourseForm } from './hooks/useCourseForm';
import { Course } from './types/course';

const { Title } = Typography;

const CourseManagement: React.FC = () => {
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
    setSelectedCategory,
    setSelectedStatus,
    setSortOrder,
    handleSearch,
    handleReset
  } = useCourseSearch((params) => {
    setCurrentPage(1); // 重置到第一页
    filterCourses(1, pageSize, params);
  });
  
  // 使用表单管理钩子
  const {
    form,
    visible,
    editingCourse,
    loading: formLoading,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel
  } = useCourseForm(addCourse, updateCourse);
  
  // 视图模式
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  
  // 详情模态框状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  
  // 删除确认模态框状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<{ id: string; name: string } | null>(null);

  // 首次加载获取数据
  useEffect(() => {
    filterCourses(currentPage, pageSize, searchParams);
  }, []);
  
  // 处理分页变化
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    filterCourses(page, size, searchParams);
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
  const handleDelete = () => {
    if (deletingCourse) {
      deleteCourse(deletingCourse.id);
      setDeleteModalVisible(false);
      setDeletingCourse(null);
    }
  };
  
  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingCourse(null);
  };

  return (
    <div className="course-management">
      {/* 标题和操作按钮区域 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>课程管理</Title>
        </Col>
        <Col>
          <Row gutter={16}>
            <Col>
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAdd}
              >
                添加课程
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 主内容区域 */}
      <Card>
        {/* 搜索栏 */}
        <CourseSearchBar
          params={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          onTextChange={setSearchText}
          onCategoryChange={setSelectedCategory}
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