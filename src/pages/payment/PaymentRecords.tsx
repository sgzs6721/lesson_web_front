import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Table, Input, Select, Row, Col, message, Modal, Form, InputNumber, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import PaymentStatistics from './components/PaymentStatistics';
import PaymentTable from './components/PaymentTable';
import FilterForm, { PaymentFilterParams } from './components/FilterForm';
import PaymentReceiptModal from './components/PaymentReceiptModal';
import PaymentDeleteModal from './components/PaymentDeleteModal';
import { usePaymentData } from './hooks/usePaymentData';
import { Payment, PaymentSearchParams } from './types/payment';
import { exportToCSV } from './utils/exportData';
import { getCourseSimpleList } from '@/api/course';
import type { SimpleCourse } from '@/api/course/types';
import { constants } from '@/api/constants';
import type { Constant } from '@/api/constants/types';
import { updatePaymentRecord as updatePaymentRecordApi, UpdatePaymentRecordRequest } from '@/api/payment';
import dayjs, { Dayjs } from 'dayjs';
import './payment.css';
import './PaymentRecords.css';
import { paymentTypeOptions } from '@/pages/student/constants/options';

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
    handlePageChange,
    updatePaymentRecord,
    paymentCount,
    paymentAmount,
    refundCount,
    refundAmount
  } = usePaymentData();
  
  // 详情模态框状态
  const [receiptVisible, setReceiptVisible] = React.useState(false);
  const [currentPayment, setCurrentPayment] = React.useState<Payment | null>(null);
  
  // 删除确认模态框状态
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<string | null>(null);

  // 编辑模态框
  const [editVisible, setEditVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [validityOptions, setValidityOptions] = useState<Constant[]>([]);
  const [giftItemsOptions, setGiftItemsOptions] = useState<Constant[]>([]);

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

  useEffect(() => {
    const fetchValidity = async () => {
      try {
        const options = await constants.getListByType('VALIDITY_PERIOD');
        setValidityOptions(options || []);
      } catch (e) {
        setValidityOptions([]);
      }
    };
    fetchValidity();
  }, []);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const options = await constants.getListByType('GIFT_ITEM');
        setGiftItemsOptions(options || []);
      } catch (e) {
        setGiftItemsOptions([]);
      }
    };
    fetchGifts();
  }, []);
  
  const handleFilter = (params: PaymentFilterParams) => {
    const apiParams: PaymentSearchParams = {
      searchText: params.searchText || '',
      selectedCourse: params.courseIds || [],
      searchPaymentMethod: params.paymentTypes || [],
      dateRange: params.dateRange ? [dayjs(params.dateRange[0]), dayjs(params.dateRange[1])] as [Dayjs, Dayjs] : null, // 正确传递日期范围
      searchStatus: '', // not in new filter
      searchPaymentType: '', // not in new filter
    };
    filterData(apiParams);
  };
  
  const handleReset = () => {
    const emptyParams: PaymentSearchParams = {
      searchText: '',
      selectedCourse: [],
      searchPaymentMethod: [],
      dateRange: null,
      searchStatus: '',
      searchPaymentType: '',
    };
    filterData(emptyParams);
  };
  
  // 处理查看详情
  const handleReceipt = (record: Payment) => {
    setCurrentPayment(record);
    setReceiptVisible(true);
  };
  
  // 打开编辑
  const handleEdit = (record: Payment) => {
    setCurrentPayment(record);
    const parsedHours = (record as any).hours ?? (parseFloat(String(record.lessonChange || '').replace(/[^\d.-]/g, '')) || 0);
    const rawType = (record.paymentType || '').toUpperCase();
    const allowedTypes = paymentTypeOptions.map(o => o.value);
    const normalizedType = allowedTypes.includes(rawType) ? rawType : allowedTypes[0];
    
    // 从记录中获取validityPeriodId，优先使用validityPeriodId字段
    const validityPeriodId = (record as any).validityPeriodId || undefined;
    
    // 确保validityPeriodId是数字类型
    const normalizedValidityPeriodId = validityPeriodId ? Number(validityPeriodId) : undefined;
    
    editForm.setFieldsValue({
      paymentType: normalizedType,
      paymentMethod: (record as any).payType || (record.paymentMethod || '').toUpperCase(),
      amount: record.amount,
      transactionDate: (record as any).date ? dayjs((record as any).date) : ((record as any).transactionDate ? dayjs((record as any).transactionDate) : undefined),
      courseHours: parsedHours > 0 ? parsedHours : 0,
      giftHours: record.giftHours || 0,
      validityPeriodId: normalizedValidityPeriodId,
      giftItems: [],
      notes: (record as any).remark || ''
    });
    setEditVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      
      // 使用id作为记录ID
      const recordId = currentPayment?.id;
      if (!recordId) {
        message.error('无法获取记录ID，请刷新页面后重试');
        return;
      }
      
      // 构建API请求参数
      const payload: UpdatePaymentRecordRequest = {
        id: parseInt(recordId),
        paymentType: values.paymentType,
        amount: values.amount,
        courseHours: values.courseHours,
        validityPeriodId: values.validityPeriodId,
        paymentMethod: values.paymentMethod,
        transactionDate: values.transactionDate ? dayjs(values.transactionDate).format('YYYY-MM-DD') : '',
        giftedHours: values.giftHours || 0,
        giftIds: values.giftItems || [],
        remarks: values.notes || '',
      };
      
      // 调用更新API
      await updatePaymentRecordApi(payload);
      
      message.success('缴费记录修改成功');
      setEditVisible(false);
      
      // 直接更新本地数据，不重新调用接口
      if (currentPayment) {
        const updatedRecord = {
          // 更新红框中的信息
          date: values.transactionDate ? dayjs(values.transactionDate).format('YYYY-MM-DD') : currentPayment.date,
          amount: values.amount,
          paymentType: values.paymentType,
          paymentMethod: values.paymentMethod,
          payType: values.paymentMethod,
          lessonChange: `${values.courseHours}课时`,
          giftHours: values.giftHours || 0,
        };
        
        // 使用hook中的更新方法
        updatePaymentRecord(recordId, updatedRecord);
      }
    } catch (error) {
      console.error('更新缴费记录失败:', error);
      message.error('缴费记录修改失败，请重试');
    }
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

        <FilterForm
          courses={courses}
          onFilter={handleFilter}
          onReset={handleReset}
          onExport={() => exportToCSV(data)}
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
          onEdit={handleEdit}
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

        <Modal
          open={editVisible}
          title="编辑缴费记录"
          onOk={handleEditOk}
          onCancel={() => setEditVisible(false)}
          className="payment-edit-modal"
        >
          <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
            {/* 缴费信息 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="paymentType" label={<span style={{ fontWeight: 600 }}>缴费类型</span>} rules={[{ required: true, message: '请选择缴费类型' }]}>
                  <Select placeholder="请选择缴费类型" dropdownMatchSelectWidth getPopupContainer={(trigger) => (trigger?.parentElement as HTMLElement) || document.body}>
                    {paymentTypeOptions.map(opt => (
                      <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="paymentMethod" label={<span style={{ fontWeight: 600 }}>支付方式</span>} rules={[{ required: true, message: '请选择支付方式' }]}>
                  <Select placeholder="请选择支付方式" dropdownMatchSelectWidth getPopupContainer={(trigger) => (trigger?.parentElement as HTMLElement) || document.body}>
                    <Select.Option value="WECHAT">微信支付</Select.Option>
                    <Select.Option value="ALIPAY">支付宝</Select.Option>
                    <Select.Option value="CASH">现金</Select.Option>
                    <Select.Option value="CARD">银行卡</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="amount" label={<span style={{ fontWeight: 600 }}>缴费金额</span>} rules={[{ required: true, message: '请输入金额' }]}>
                  <InputNumber style={{ width: '100%' }} min={0} prefix="¥" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="transactionDate" label={<span style={{ fontWeight: 600 }}>交易日期</span>} rules={[{ required: true, message: '请选择交易日期' }]}>
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>

            {/* 课时信息 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="courseHours" label={<span style={{ fontWeight: 600 }}>正课课时</span>} rules={[{ required: true, message: '请输入正课课时' }]}>
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="giftHours" label={<span style={{ fontWeight: 600 }}>赠送课时</span>} rules={[{ required: true, message: '请输入赠送课时' }]}>
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="validityPeriodId" label={<span style={{ fontWeight: 600 }}>有效期(月)</span>} rules={[{ required: true, message: '请选择有效期(月)' }]}>
                  <Select placeholder="请选择有效期(月)" dropdownMatchSelectWidth getPopupContainer={(trigger) => (trigger?.parentElement as HTMLElement) || document.body}>
                    {validityOptions.map(opt => (
                      <Select.Option key={opt.id} value={opt.id}>{opt.constantValue}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="giftItems" label={<span style={{ fontWeight: 600 }}>赠品</span>}>
                  <Select
                    mode="multiple"
                    placeholder="请选择赠品(可多选)"
                    dropdownMatchSelectWidth
                    getPopupContainer={(trigger) => (trigger?.parentElement as HTMLElement) || document.body}
                    className="single-line-select"
                    maxTagCount={3}
                  >
                    {giftItemsOptions.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.constantValue}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 备注 */}
            <Form.Item name="notes" label={<span style={{ fontWeight: 600 }}>备注信息</span>}>
              <Input.TextArea rows={3} placeholder="请输入备注信息" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default PaymentRecords;