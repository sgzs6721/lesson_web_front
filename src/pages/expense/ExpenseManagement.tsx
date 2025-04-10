import React, { useState } from 'react';
import { Card, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FinanceStatistics from './components/ExpenseStatistics';
import FinanceTable from './components/ExpenseTable';
import FinanceSearchBar from './components/FinanceSearchBar';
import FinanceEditModal from './components/ExpenseEditModal';
import FinanceDetailsModal from './components/ExpenseDetailsModal';
import FinanceDeleteModal from './components/ExpenseDeleteModal';
import { useFinanceData } from './hooks/useExpenseData';
import { useExpenseSearch } from './hooks/useExpenseSearch';
import { useFinanceForm } from './hooks/useExpenseForm';
import { exportToCSV } from './utils/exportData';
import { Expense } from './types/expense';
import './expense.css';

const { Title } = Typography;

const FinanceManagement: React.FC = () => {
  // 使用数据管理钩子
  const {
    data,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterData,

    totalExpense,
    salaryExpense,
    operationExpense,
    otherExpense,
    totalIncome,
    tuitionIncome,
    trainingIncome,
    retailIncome,
    otherIncome
  } = useFinanceData();

  // 使用搜索功能钩子
  const {
    searchParams,
    setSearchText,
    setSearchCategories,
    setSearchType,
    setDateRange,
    handleSearch,
    handleReset
  } = useExpenseSearch(filterData);

  // 使用表单管理钩子
  const {
    form,
    visible,
    editingId,
    loading,
    transactionType,
    handleAddTransaction,
    handleTypeChange,
    handleEdit,
    handleSubmit,
    handleCancel
  } = useFinanceForm(addTransaction, updateTransaction);

  // 删除确认模态框状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // 详情模态框状态
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [recordDetails, setRecordDetails] = useState<Expense | null>(null);

  // 处理删除确认
  const showDeleteConfirm = (id: string) => {
    setRecordToDelete(id);
    setDeleteModalVisible(true);
  };

  // 执行删除
  const handleDelete = () => {
    if (recordToDelete) {
      deleteTransaction(recordToDelete);
      setDeleteModalVisible(false);
      setRecordToDelete(null);
    }
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  // 显示详情
  const showDetails = (record: Expense) => {
    setRecordDetails(record);
    setDetailsModalVisible(true);
  };

  // 关闭详情
  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
    setRecordDetails(null);
  };

  return (
    <div className="expense-management-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>收支管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTransaction}>
          添加收支记录
        </Button>
      </div>

      {/* 统计卡片 */}
      <FinanceStatistics
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        salaryExpense={salaryExpense}
        operationExpense={operationExpense}
        otherExpense={otherExpense}
        tuitionIncome={tuitionIncome}
        trainingIncome={trainingIncome}
        otherIncome={otherIncome + retailIncome}
      />

      {/* 主要内容卡片 */}
      <Card>
        {/* 搜索栏 */}
        <FinanceSearchBar
          params={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          onExport={() => exportToCSV(data)}
          onTextChange={setSearchText}
          onCategoriesChange={setSearchCategories}
          onTypeChange={setSearchType}
          onDateRangeChange={setDateRange}
        />

        {/* 数据表格 */}
        <FinanceTable
          data={data}
          onEdit={handleEdit}
          onDelete={showDeleteConfirm}
          onViewDetails={showDetails}
        />
      </Card>

      {/* 编辑/添加模态框 */}
      <FinanceEditModal
        visible={visible}
        loading={loading}
        form={form}
        editingId={editingId}
        type={transactionType}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        onTypeChange={handleTypeChange}
      />

      {/* 删除确认模态框 */}
      <FinanceDeleteModal
        visible={deleteModalVisible}
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />

      {/* 详情模态框 */}
      <FinanceDetailsModal
        visible={detailsModalVisible}
        record={recordDetails}
        onCancel={handleCloseDetails}
      />
    </div>
  );
};

export default FinanceManagement;