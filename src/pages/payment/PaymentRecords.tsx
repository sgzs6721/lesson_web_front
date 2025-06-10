import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Table, Input, Select, Row, Col, message, Modal } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import PaymentStatistics from './components/PaymentStatistics';
import PaymentTable from './components/PaymentTable';
import PaymentSearchBar from './components/PaymentSearchBar';
import PaymentEditModal from './components/PaymentEditModal';
import PaymentReceiptModal from './components/PaymentReceiptModal';
import PaymentDeleteModal from './components/PaymentDeleteModal';
import { usePaymentData } from './hooks/usePaymentData';
import { usePaymentSearch } from './hooks/usePaymentSearch';
import { usePaymentForm } from './hooks/usePaymentForm';
import { Payment } from './types/payment';
import { exportToCSV } from './utils/exportData';
import './payment.css';
import './PaymentRecords.css';

const { Title } = Typography;

const PaymentRecords: React.FC = () => {
  // 使用数据管理钩子
  const {
    data,
    addPayment,
    updatePayment,
    deletePayment,
    filterData,
    resetData,
    paymentCount,
    paymentAmount,
    refundCount,
    refundAmount
  } = usePaymentData();
  
  // 使用搜索功能钩子
  const {
    searchParams,
    setSearchText,
    setSearchStatus,
    setSearchPaymentType,
    setSearchPaymentMethod,
    setDateRange,
    handleSearch,
    handleReset
  } = usePaymentSearch(filterData);
  
  // 使用表单管理钩子
  const {
    form,
    visible,
    editingId,
    loading,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel
  } = usePaymentForm(addPayment, updatePayment);
  
  // 详情模态框状态
  const [receiptVisible, setReceiptVisible] = React.useState(false);
  const [currentPayment, setCurrentPayment] = React.useState<Payment | null>(null);
  
  // 删除确认模态框状态
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<string | null>(null);
  
  // 处理查看详情
  const handleReceipt = (record: Payment) => {
    setCurrentPayment(record);
    setReceiptVisible(true);
  };
  
  // 处理删除确认
  const showDeleteConfirm = (id: string) => {
    setRecordToDelete(id);
    setDeleteModalVisible(true);
  };
  
  // 执行删除
  const handleDelete = () => {
    if (recordToDelete) {
      deletePayment(recordToDelete);
      setDeleteModalVisible(false);
      setRecordToDelete(null);
    }
  };
  
  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  
  return (
    <div className="payment-management">
      <Card className="payment-management-card">
        <div className="payment-header">
          <h1 className="payment-title">缴费记录</h1>
          <div className="payment-actions">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
              className="add-payment-button"
            >
              添加收款记录
            </Button>
          </div>
        </div>

        <PaymentStatistics
          paymentCount={paymentCount}
          paymentAmount={paymentAmount}
          refundCount={refundCount}
          refundAmount={refundAmount}
        />
        
        <PaymentSearchBar
          params={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          onExport={() => exportToCSV(data)}
          onTextChange={setSearchText}
          onStatusChange={setSearchStatus}
          onPaymentTypeChange={setSearchPaymentType}
          onPaymentMethodChange={setSearchPaymentMethod}
          onDateRangeChange={setDateRange}
        />
        
        <PaymentTable
          data={data}
          onViewReceipt={handleReceipt}
          onDelete={showDeleteConfirm}
        />

        <PaymentEditModal
          visible={visible}
          loading={loading}
          form={form}
          editingId={editingId}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
        
        <PaymentReceiptModal
          visible={receiptVisible}
          payment={currentPayment}
          onCancel={() => setReceiptVisible(false)}
        />
        
        <PaymentDeleteModal
          visible={deleteModalVisible}
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      </Card>
    </div>
  );
};

export default PaymentRecords;