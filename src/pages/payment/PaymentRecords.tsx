import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Table, Input, Select, Row, Col, message, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import PaymentStatistics from './components/PaymentStatistics';
import PaymentTable from './components/PaymentTable';
import PaymentSearchBar from './components/PaymentSearchBar';
import PaymentReceiptModal from './components/PaymentReceiptModal';
import PaymentDeleteModal from './components/PaymentDeleteModal';
import { usePaymentData } from './hooks/usePaymentData';
import { usePaymentSearch } from './hooks/usePaymentSearch';
import { Payment } from './types/payment';
import { exportToCSV } from './utils/exportData';
import { getCourseSimpleList } from '@/api/course';
import type { SimpleCourse } from '@/api/course/types';
import './payment.css';
import './PaymentRecords.css';

const { Title } = Typography;

const PaymentRecords: React.FC = () => {
  // 课程列表状态
  const [courses, setCourses] = useState<SimpleCourse[]>([]);

  // 使用数据管理钩子
  const {
    data,
    loading,
    statisticsLoading,
    statistics,
    total,
    currentPage,
    pageSize,
    deletePayment,
    filterData,
    resetData,
    handlePageChange,
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
    setSearchPaymentMethod,
    setSelectedCourse,
    setDateRange,
    handleSearch,
    handleReset
  } = usePaymentSearch(filterData);
  
  // 详情模态框状态
  const [receiptVisible, setReceiptVisible] = React.useState(false);
  const [currentPayment, setCurrentPayment] = React.useState<Payment | null>(null);
  
  // 删除确认模态框状态
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<string | null>(null);

  // 获取课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await getCourseSimpleList();
        setCourses(courseList);
      } catch (error) {
        message.error('获取课程列表失败');
      }
    };
    fetchCourses();
  }, []);
  
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
          <Title level={4} className="page-title">缴费记录</Title>
        </div>

        <PaymentSearchBar
          params={searchParams}
          courses={courses}
          onSearch={handleSearch}
          onReset={handleReset}
          onExport={() => exportToCSV(data)}
          onTextChange={setSearchText}
          onStatusChange={setSearchStatus}
          onPaymentMethodChange={setSearchPaymentMethod}
          onCourseChange={setSelectedCourse}
          onDateRangeChange={setDateRange}
        />

        <PaymentStatistics
          paymentCount={paymentCount}
          paymentAmount={paymentAmount}
          refundCount={refundCount}
          refundAmount={refundAmount}
          loading={statisticsLoading}
        />
        
        <PaymentTable
          data={data}
          loading={loading}
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onViewReceipt={handleReceipt}
          onDelete={showDeleteConfirm}
          onPageChange={handlePageChange}
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