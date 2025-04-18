import React, { useState, useEffect, useRef } from 'react';
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
import { useCoachDetail, coachDetailCache } from './hooks/useCoachDetail';
import { ViewMode } from './types/coach';
import './components/CoachManagement.css';

const { Title } = Typography;

const CoachManagement: React.FC = () => {
  // 初始加载引用
  const initialLoadRef = useRef(true);

  // 视图模式状态
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 数据相关钩子
  const { coaches, total, loading, fetchCoaches, addCoach, updateCoach, updateCoachStatus, deleteCoach } = useCoachData();

  // 搜索相关钩子
  const {
    searchParams,
    setSearchText,
    setSelectedStatus,
    setSelectedJobTitle,
    setSortField,
    resetSearchParams
  } = useCoachSearch();

  // 表单相关钩子
  const { form, visible, editingCoach, loading: formLoading, detailLoading: formDetailLoading, selectedAvatar, handleAdd, handleEdit, handleSubmit, handleCancel, handleAvatarSelect, handleGenderChange } = useCoachForm(addCoach, updateCoach);

  // 详情相关
  const { detailVisible, viewingCoach, deleteModalVisible, recordToDelete, loading: detailLoading, fetchCoachDetail, showDetail, closeDetail, showDeleteConfirm, cancelDelete } = useCoachDetail();

  // 预加载教练详情数据
  const preloadCoachDetails = async () => {
    // 对列表中的每个教练，如果详情缓存中没有，则加载详情
    coaches.forEach(async (coach) => {
      if (!coachDetailCache[coach.id]) {
        try {
          // 静默加载教练详情，不显示加载状态
          await fetchCoachDetail(coach.id);
          console.log(`预加载教练 ${coach.id} 详情成功`);
        } catch (error) {
          console.error(`预加载教练 ${coach.id} 详情失败:`, error);
        }
      }
    });
  };

  // 加载教练列表
  const loadCoaches = async (page = currentPage, size = pageSize) => {
    await fetchCoaches(page, size, searchParams);

    // 如果当前是卡片视图模式，预加载所有教练的详情数据
    if (viewMode === 'card') {
      preloadCoachDetails();
    }
  };

  // 页码变更处理
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    loadCoaches(page, size);
  };

  // 分页配置
  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    onChange: handlePageChange
  };

  // 处理搜索
  const handleSearch = async () => {
    setCurrentPage(1);
    loadCoaches(1, pageSize);
  };

  // 重置搜索
  const handleReset = () => {
    resetSearchParams();
    setCurrentPage(1);
    loadCoaches(1, pageSize);
  };

  // 处理视图模式变更
  const handleViewModeChange = (newMode: ViewMode) => {
    setViewMode(newMode);

    // 如果切换到卡片视图，预加载教练详情
    if (newMode === 'card') {
      preloadCoachDetails();
    }
  };

  // 状态变更加载状态
  const [statusLoading, setStatusLoading] = useState<Record<string, boolean>>({});

  // 处理状态变更
  const handleStatusChange = (id: string, newStatus: string) => {
    // 设置对应教练的状态变更加载状态为 true
    setStatusLoading(prev => ({ ...prev, [id]: true }));

    // 确保传递给 API 的是正确的类型
    updateCoachStatus(id, newStatus as any)
      .then(() => {
        console.log('教练状态更新成功:', id, newStatus);
      })
      .catch(error => {
        console.error('更新教练状态失败:', error);
      })
      .finally(() => {
        // 无论成功还是失败，都将加载状态设置为 false
        setTimeout(() => {
          setStatusLoading(prev => ({ ...prev, [id]: false }));
        }, 500); // 延迟500毫秒，确保用户能看到状态变化
      });
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
            loadCoaches(currentPage - 1, pageSize);
          } else {
            loadCoaches(currentPage, pageSize);
          }
        })
        .catch(error => {
          console.error('删除教练失败:', error);
        });
    }
  };

  // 初始加载教练列表
  useEffect(() => {
    if (initialLoadRef.current) {
      loadCoaches();
      initialLoadRef.current = false;
    }
  }, []);

  return (
    <div className="coach-management">
      <Card className="coach-management-card">
        <div className="coach-header">
          <Title level={4} className="coach-title">教练管理</Title>
          <CoachViewToggle
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onAddCoach={handleAdd}
          />
        </div>

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
            onStatusChange={handleStatusChange}
            rowLoading={statusLoading}
          />
        ) : (
          <CoachCardView
            data={coaches.map(coach => coachDetailCache[coach.id] || coach)} // 优先使用缓存中的详情数据
            loading={loading}
            pagination={paginationConfig}
            onEdit={handleEdit}
            onDelete={showDeleteConfirm}
            onViewDetail={showDetail}
            onStatusChange={handleStatusChange}
            rowLoading={statusLoading}
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
        detailLoading={formDetailLoading}
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