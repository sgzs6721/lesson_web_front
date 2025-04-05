import React, { useEffect } from 'react';
import { Typography, Card, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UserSearchBar from './components/UserSearchBar';
import UserTable from './components/UserTable';
import UserEditModal from './components/UserEditModal';
import UserDeleteModal from './components/UserDeleteModal';
import { useUserData } from './hooks/useUserData';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserForm } from './hooks/useUserForm';
import { useUserDelete } from './hooks/useUserDelete';
import { message } from 'antd';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  // 使用数据管理钩子
  const {
    users,
    total,
    loading,
    addUser,
    updateUser,
    deleteUser,
    filterUsers,
    resetData
  } = useUserData();
  
  // 使用搜索功能钩子
  const {
    searchParams,
    pagination,
    setSearchText,
    setSelectedRole,
    setSelectedCampus,
    setSelectedStatus,
    handleSearch,
    handleReset
  } = useUserSearch((params, page, pageSize) => {
    // 如果所有筛选条件都为空，则调用resetData重置到初始状态
    if (
      !params.searchText && 
      params.selectedRole.length === 0 && 
      params.selectedCampus.length === 0 && 
      params.selectedStatus.length === 0
    ) {
      resetData(page, pageSize);
    } else {
      // 否则使用筛选条件查询
      filterUsers(params, page, pageSize);
    }
  });
  
  // 页面加载时初始化数据
  useEffect(() => {
    resetData(1, pagination.pageSize);
  }, []);
  
  // 使用表单管理钩子
  const {
    form,
    isModalVisible,
    editingUser,
    loading: formLoading,
    showAddModal,
    showEditModal,
    handleModalOk,
    handleModalCancel,
    handleResetPassword
  } = useUserForm(addUser, updateUser);
  
  // 使用删除管理钩子
  const {
    isDeleteModalVisible,
    userToDelete,
    showDeleteConfirm,
    handleDeleteUser,
    handleDeleteCancel
  } = useUserDelete(deleteUser);
  
  // 处理重置密码
  const onResetPassword = () => {
    if (editingUser) {
      message.success(`已将用户"${editingUser.name}"的密码重置为与电话号码相同`);
    }
  };

  return (
    <div className="user-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>用户管理</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            添加用户
          </Button>
        </Col>
      </Row>

      {/* 主卡片容器 */}
      <Card>
        {/* 搜索栏 */}
        <UserSearchBar
          params={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          onTextChange={setSearchText}
          onRoleChange={setSelectedRole}
          onCampusChange={setSelectedCampus}
          onStatusChange={setSelectedStatus}
        />
        
        {/* 用户表格 */}
        <UserTable
          users={users}
          loading={loading}
          total={total}
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          onEdit={showEditModal}
          onDelete={showDeleteConfirm}
          onPageChange={pagination.handlePageChange}
        />
      </Card>
      
      {/* 编辑/添加模态框 */}
      <UserEditModal
        visible={isModalVisible}
        loading={formLoading}
        form={form}
        editingUser={editingUser}
        onCancel={handleModalCancel}
        onSubmit={handleModalOk}
        onResetPassword={onResetPassword}
      />
      
      {/* 删除确认模态框 */}
      <UserDeleteModal
        visible={isDeleteModalVisible}
        user={userToDelete}
        onConfirm={handleDeleteUser}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default UserManagement; 