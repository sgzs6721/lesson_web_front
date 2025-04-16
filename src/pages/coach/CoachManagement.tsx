import React, { useState, useEffect } from 'react';
import { Typography, Card } from 'antd';
import CoachViewToggle from './components/CoachViewToggle';
import CoachSearchBar from './components/CoachSearchBar';
import CoachTable from './components/CoachTable';
import CoachCardView from './components/CoachCardView';
import CoachEditModal from './components/CoachEditModal';
import CoachDetailModal from './components/CoachDetailModal';
import CoachDeleteModal from './components/CoachDeleteModal';
import { useCoachData } from './hooks/useCoachData';
import { useCoachSearch } from './hooks/useCoachSearch';
import { useCoachForm } from './hooks/useCoachForm';
import { useCoachDetail } from './hooks/useCoachDetail';
import { ViewMode } from './types/coach';

const { Title } = Typography;

const CoachManagement: React.FC = () => {
  // 视图模式状态
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 使用数据管理钩子
  const {
    coaches,
    total,
    loading,
    fetchCoaches,
    addCoach,
    updateCoach,
    deleteCoach
  } = useCoachData();

  // 使用搜索钩子
  const {
    searchParams,
    setSearchText,
    setSelectedStatus,
    setSelectedJobTitle,
    setSortField,
    resetSearchParams
  } = useCoachSearch();

  // 使用表单管理钩子
  const {
    form,
    visible,
    editingCoach,
    selectedAvatar,
    loading: formLoading,
    detailLoading: formDetailLoading,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel,
    handleAvatarSelect,
    handleGenderChange
  } = useCoachForm(addCoach, updateCoach, () => fetchCoaches(currentPage, pageSize, searchParams));

  // 使用详情管理钩子
  const {
    detailVisible,
    viewingCoach,
    deleteModalVisible,
    recordToDelete,
    loading: detailLoading,
    showDetail,
    closeDetail,
    showDeleteConfirm,
    cancelDelete
  } = useCoachDetail();

  // 初始加载
  useEffect(() => {
    fetchCoaches(currentPage, pageSize);
  }, []);

  // 处理查询
  const handleSearch = () => {
    setCurrentPage(1);
    fetchCoaches(1, pageSize, searchParams);
  };

  // 处理重置
  const handleReset = () => {
    resetSearchParams();
    setCurrentPage(1);
    fetchCoaches(1, pageSize);
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchCoaches(page, pageSize, searchParams);
  };

  // 处理视图模式变更
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // 处理确认删除
  const handleConfirmDelete = () => {
    if (recordToDelete) {
      deleteCoach(recordToDelete)
        .then(() => {
          cancelDelete();
          // 如果删除后数据不足一页，则回到第一页
          if (coaches.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            fetchCoaches(currentPage - 1, pageSize, searchParams);
          } else {
            fetchCoaches(currentPage, pageSize, searchParams);
          }
        })
        .catch(error => {
          console.error('删除教练失败:', error);
        });
    }
  };

  // 分页配置
  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    onChange: handlePageChange
  };

  return (
    <div className="coach-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4}>教练管理</Title>
        <CoachViewToggle
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onAddCoach={handleAdd}
        />
      </div>

      <Card>
        {/* 搜索栏 */}
        <CoachSearchBar
          params={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          onTextChange={setSearchText}
          onStatusChange={setSelectedStatus}
          onJobTitleChange={setSelectedJobTitle}
          onSortFieldChange={setSortField}
        />

        {/* 表格或卡片视图 */}
        {viewMode === 'table' ? (
          <CoachTable
            data={coaches}
            loading={loading}
            pagination={paginationConfig}
            onEdit={handleEdit}
            onDelete={showDeleteConfirm}
            onViewDetail={showDetail}
          />
        ) : (
          <CoachCardView
            data={coaches}
            loading={loading}
            pagination={paginationConfig}
            onEdit={handleEdit}
            onDelete={showDeleteConfirm}
            onViewDetail={showDetail}
          />
        )}
      </Card>

      {/* 编辑/添加模态框 */}
      <CoachEditModal
        visible={visible}
        loading={formLoading || formDetailLoading}
        form={form}
        editingCoach={editingCoach}
        selectedAvatar={selectedAvatar}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onAvatarSelect={handleAvatarSelect}
        onGenderChange={handleGenderChange}
      />

      {/* 详情模态框 */}
      <CoachDetailModal
        visible={detailVisible}
        coach={viewingCoach}
        loading={detailLoading}
        onCancel={closeDetail}
      />

      {/* 删除确认模态框 */}
      <CoachDeleteModal
        visible={deleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default CoachManagement;