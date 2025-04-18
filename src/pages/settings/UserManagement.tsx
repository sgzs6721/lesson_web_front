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
    resetPassword,
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
    // 无论是否有筛选条件，都使用 filterUsers 函数来处理
    // 这样可以避免重复调用 API
    filterUsers(params, page, pageSize);
  });

  // 页面加载时初始化数据
  // 使用引用标记来跟踪是否已经初始化
  const isInitializedRef = React.useRef(false);

  useEffect(() => {
    // 只在组件首次挂载时执行初始化
    if (!isInitializedRef.current) {
      // 首次加载时触发搜索，使用空的搜索参数
      const emptyParams = {
        searchText: '',
        selectedRole: [],
        selectedCampus: [],
        selectedStatus: undefined
      };
      filterUsers(emptyParams, 1, pagination.pageSize);
      isInitializedRef.current = true;
    }
  }, [filterUsers, pagination.pageSize]); // 添加依赖项

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
  } = useUserForm(addUser, updateUser, resetPassword);

  // 使用删除管理钩子
  const {
    isDeleteModalVisible,
    userToDelete,
    showDeleteConfirm,
    handleDeleteUser,
    handleDeleteCancel
  } = useUserDelete(deleteUser);

  // 处理重置密码
  const onResetPassword = async () => {
    if (editingUser) {
      const success = await handleResetPassword();
      if (success) {
        message.success('密码已重置成功，新密码已设置为手机号后8位');
      }
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