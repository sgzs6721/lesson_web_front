import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CampusTable from './components/CampusTable';
import CampusSearchBar from './components/CampusSearchBar';
import CampusEditModal from './components/CampusEditModal';
import CampusDeleteModal from './components/CampusDeleteModal';
import CampusStatusModal from './components/CampusStatusModal';
import { useCampusData } from './hooks/useCampusData';
import { useCampusSearch } from './hooks/useCampusSearch';
import { useCampusForm } from './hooks/useCampusForm';
import { Campus } from './types/campus';

const { Title } = Typography;

const CampusManagement: React.FC = () => {
  // 使用数据管理钩子
  const {
    loading,
    campuses,
    total,
    currentPage,
    pageSize,
    fetchCampuses,
    filterData,
    addCampus,
    updateCampus,
    deleteCampus,
    toggleCampusStatus,
    setCurrentPage,
    setPageSize
  } = useCampusData();

  // 注意: 我们不需要在这里调用fetchCampuses
  // 因为useCampusData中的useEffect已经在组件加载时调用了fetchCampuses

  // 添加调试日志
  React.useEffect(() => {
    console.log('校区管理页面数据状态:', {
      campuses,
      loading,
      total,
      currentPage,
      pageSize
    });
  }, [campuses, loading, total, currentPage, pageSize]);

  // 使用搜索功能钩子
  const {
    searchParams,
    setSearchText,
    setSelectedStatus,
    handleSearch,
    handleReset
  } = useCampusSearch(filterData);

  // 使用表单管理钩子
  const {
    form,
    visible,
    loading: formLoading,
    editingCampus,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel
  } = useCampusForm(addCampus, updateCampus);

  // 删除确认模态框状态
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [campusIdToDelete, setCampusIdToDelete] = React.useState<string>('');
  const [campusNameToDelete, setCampusNameToDelete] = React.useState<string>('');

  // 状态切换确认模态框状态
  const [statusModalVisible, setStatusModalVisible] = React.useState(false);
  const [campusToToggle, setCampusToToggle] = React.useState<Campus | null>(null);

  // 处理分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // 处理删除确认
  const showDeleteConfirm = (id: string, name: string) => {
    setCampusIdToDelete(id);
    setCampusNameToDelete(name);
    setDeleteModalVisible(true);
  };

  // 执行删除
  const handleDelete = () => {
    deleteCampus(campusIdToDelete);
    setDeleteModalVisible(false);
    setCampusIdToDelete('');
    setCampusNameToDelete('');
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setCampusIdToDelete('');
    setCampusNameToDelete('');
  };

  // 显示状态切换确认
  const showStatusConfirm = (record: Campus) => {
    setCampusToToggle(record);
    setStatusModalVisible(true);
  };

  // 执行状态切换
  const handleToggleStatus = () => {
    if (campusToToggle) {
      toggleCampusStatus(campusToToggle);
      setStatusModalVisible(false);
      setCampusToToggle(null);
    }
  };

  // 取消状态切换
  const handleCancelToggle = () => {
    setStatusModalVisible(false);
    setCampusToToggle(null);
  };

  return (
    <div className="campus-management">
      {/* 标题行 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>校区管理</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加校区
          </Button>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card>
        {/* 搜索栏 */}
        <CampusSearchBar
          params={searchParams}
          onTextChange={setSearchText}
          onStatusChange={setSelectedStatus}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* 表格 */}
        <div style={{ marginBottom: 16 }} />
        <CampusTable
          data={campuses}
          loading={loading}
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onToggleStatus={showStatusConfirm}
          onDelete={showDeleteConfirm}
        />
      </Card>

      {/* 编辑/添加模态框 */}
      <CampusEditModal
        visible={visible}
        loading={formLoading}
        form={form}
        editingCampus={editingCampus}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      {/* 删除确认模态框 */}
      <CampusDeleteModal
        visible={deleteModalVisible}
        campusName={campusNameToDelete}
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />

      {/* 状态切换确认模态框 */}
      <CampusStatusModal
        visible={statusModalVisible}
        campus={campusToToggle}
        onConfirm={handleToggleStatus}
        onCancel={handleCancelToggle}
      />
    </div>
  );
};

export default CampusManagement;