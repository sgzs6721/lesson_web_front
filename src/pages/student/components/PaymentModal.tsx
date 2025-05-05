import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  InputNumber,
  Tag,
  Divider,
  Spin,
  message,
  Button
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Student, CourseSummary } from '@/pages/student/types/student';
import {
  courseTypeOptions,
  paymentTypeOptions,
  paymentMethodOptions,
} from '../constants/options';
import dayjs from 'dayjs';
import './PaymentModal.css';
import { request } from '@/api/config';
import { student as studentApi } from '@/api/student';
import { constants } from '@/api/constants';
import { Constant } from '@/api/constants/types';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface PaymentModalProps {
  visible: boolean;
  form: FormInstance;
  student: Student | null;
  coursesList: CourseSummary[];
  selectedCourse: string | number;
  selectedCourseName: string;
  currentClassHours: number;
  newClassHours: number;
  totalClassHours: number;
  newValidUntil: string;
  loading?: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  onCourseChange: (courseId: string | number) => void;
  onClassHoursChange: () => void;
  onValidUntilChange: (date: dayjs.Dayjs | null) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  form,
  student,
  coursesList,
  selectedCourse,
  selectedCourseName,
  currentClassHours,
  newClassHours,
  totalClassHours,
  newValidUntil,
  loading: propLoading,
  onCancel,
  onSuccess,
  onCourseChange,
  onClassHoursChange,
  onValidUntilChange
}) => {
  const selectedGifts = Form.useWatch('giftItems', form);
  const regularClasses = Form.useWatch('regularClasses', form) || 0;
  const bonusClasses = Form.useWatch('bonusClasses', form) || 0;
  const [loading, setLoading] = useState(false);
  const [giftItemsOptions, setGiftItemsOptions] = useState<Constant[]>([]);
  const [loadingGiftItems, setLoadingGiftItems] = useState(false);

  const selectedCourseInfo = useMemo(() => {
    if (!coursesList || coursesList.length === 0 || !selectedCourse) {
      return null;
    }
    
    return coursesList.find(course => String(course.id) === String(selectedCourse)) || null;
  }, [coursesList, selectedCourse]);

  useEffect(() => {
    if (selectedCourseInfo && selectedCourseInfo.type) {
      form.setFieldValue('courseType', selectedCourseInfo.type);
    }
  }, [selectedCourseInfo, form]);

  useEffect(() => {
    if (visible) {
      const fetchGiftItems = async () => {
        setLoadingGiftItems(true);
        try {
          const options = await constants.getList('GIFT_ITEM');
          setGiftItemsOptions(options || []);
        } catch (error) {
          console.error('获取赠品列表失败:', error);
          message.error('获取赠品列表失败');
          setGiftItemsOptions([]);
        } finally {
          setLoadingGiftItems(false);
        }
      };
      fetchGiftItems();
    }
  }, [visible]);

  const getStatusInfo = (status?: string) => {
    if (!status) return { color: 'green', text: '在学' };
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('expire') || statusLower === 'expired') {
      return { color: 'orange', text: '过期' };
    } else if (statusLower.includes('graduate') || statusLower === 'graduated') {
      return { color: 'blue', text: '结业' };
    }
    return { color: 'green', text: '在学' };
  };

  const getGiftLabels = (values: number[] | undefined): React.ReactNode => {
    if (!values || values.length === 0) {
      return '无';
    }
    
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '4px' }}>
        {values.map((value, index) => {
          const option = giftItemsOptions.find(opt => opt.id === value);
          return (
            <Tag key={index} style={{ margin: '2px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {option?.constantValue || `选项${value}`}
            </Tag>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (visible) {
      console.log('[PaymentModal] 监听到props变化:', {
        currentClassHours,
        newClassHours,
        totalClassHours
      });
    }
  }, [visible, currentClassHours, newClassHours, totalClassHours]);

  const calculatedTotalClassHours = useMemo(() => {
    const total = Number(currentClassHours) + Number(regularClasses || 0) + Number(bonusClasses || 0);
    
    console.log('[简化计算] 变更后总课时:', {
      剩余课时: Number(currentClassHours),
      正课: Number(regularClasses || 0),
      赠送: Number(bonusClasses || 0),
      计算结果: total
    });
    
    return total;
  }, [currentClassHours, regularClasses, bonusClasses]);

  const calculatedNewClassHours = useMemo(() => {
    const regular = Number(regularClasses);
    const bonus = Number(bonusClasses);
    return regular + bonus;
  }, [regularClasses, bonusClasses]);

  const handleOk = async () => {
    try {
      console.log('[PaymentModal] handleOk: Starting validation...');
      const values = await form.validateFields();
      console.log('[PaymentModal] handleOk: Validation successful. Values:', values);
      setLoading(true); 

      if (!student) { 
        console.error('[PaymentModal] handleOk: Student data is null!');
        message.error('学员信息丢失，无法提交缴费');
        setLoading(false);
        return;
      }
      console.log('[PaymentModal] handleOk: Student data check passed.');

      const paymentData = {
        studentId: Number(student.id), 
        courseId: Number(values.courseId), 
        paymentType: values.paymentType,
        amount: Number(values.amount), 
        paymentMethod: values.paymentMethod,
        transactionDate: values.transactionDate.format('YYYY-MM-DD'),
        courseHours: Number(values.regularClasses) || 0, 
        giftHours: Number(values.bonusClasses) || 0, 
        validUntil: values.validUntil.format('YYYY-MM-DD'),
        giftItems: values.giftItems || [], 
        notes: values.remarks 
      };

      console.log('[PaymentModal] handleOk: Submitting paymentData:', JSON.stringify(paymentData, null, 2));

      console.log('[PaymentModal] handleOk: Calling studentApi.addPayment...');
      const result = await studentApi.addPayment(paymentData); 
      console.log('[PaymentModal] handleOk: studentApi.addPayment successful.');

      // 处理学生对象中的课程信息，更新剩余课时数据
      if (student.courses && student.courses.length > 0) {
        // 找到当前修改的课程
        const courseIndex = student.courses.findIndex(
          course => String(course.courseId) === String(values.courseId)
        );

        if (courseIndex >= 0) {
          // 更新课程的剩余课时
          const currentRemainingHours = student.courses[courseIndex].remainingHours || 0;
          const newRemainingHours = currentRemainingHours + Number(values.regularClasses || 0) + Number(values.bonusClasses || 0);
          
          // 创建一个更新后的对象
          const updatedCourse = {
            ...student.courses[courseIndex],
            remainingHours: newRemainingHours
          };
          
          console.log('[PaymentModal] 更新剩余课时:', {
            课程ID: values.courseId,
            原剩余课时: currentRemainingHours,
            添加课时: Number(values.regularClasses || 0) + Number(values.bonusClasses || 0),
            新剩余课时: newRemainingHours
          });

          // 更新学生对象中的课程数据
          const updatedCourses = [...student.courses];
          updatedCourses[courseIndex] = updatedCourse;
          
          // 修改学生对象
          if (student) {
            student.courses = updatedCourses;
          }
        }
      }

      message.success('缴费成功');
      
      console.log('[PaymentModal] handleOk: Checking if onSuccess is a function...');
      if (typeof onSuccess === 'function') {
        console.log('[PaymentModal] handleOk: onSuccess is a function, calling it...');
        onSuccess(); 
        console.log('[PaymentModal] handleOk: onSuccess called successfully.');
      } else {
        console.log('[PaymentModal] handleOk: onSuccess is not a function, skipping call.');
        onCancel();
      }

    } catch (error) {
      console.error('[PaymentModal] handleOk: Error caught:', error);
      message.error('缴费失败，请检查表单信息');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
          缴费登记
        </span>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      okText="确认提交"
      cancelText="取消"
      confirmLoading={loading || propLoading}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading || propLoading}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading || propLoading} onClick={handleOk}>
          确认提交
        </Button>,
      ]}
    >
      <Spin spinning={loading || propLoading} tip="正在提交...">
        <Divider style={{ margin: '0 0 24px 0' }} />

        <Row gutter={32}>
          <Col span={15}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                transactionDate: dayjs(),
                validUntil: dayjs().add(180, 'day'),
                regularClasses: 0,
                bonusClasses: 0,
              }}
            >
              <Title level={5} style={{ marginBottom: 16 }}>基本信息</Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="courseId"
                    label="缴费课程"
                    rules={[{ required: true, message: '请选择缴费课程' }]}
                  >
                    <Select
                      placeholder="请选择缴费课程"
                      onChange={onCourseChange}
                      dropdownMatchSelectWidth={true}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                      disabled={true}
                    >
                      {coursesList.map(course => (
                        <Option key={course.id} value={course.id}>{course.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="courseType"
                    label="课程类型"
                    rules={[{ required: true, message: '请选择课程类型' }]}
                  >
                    <Select
                      placeholder="请选择课程类型"
                      disabled
                      dropdownMatchSelectWidth={true}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    >
                      {courseTypeOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: '16px 0' }} />
              <Title level={5} style={{ marginBottom: 16 }}>缴费信息</Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="paymentType"
                    label="缴费类型"
                    rules={[{ required: true, message: '请选择缴费类型' }]}
                  >
                    <Select
                      placeholder="请选择缴费类型"
                      dropdownMatchSelectWidth={true}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    >
                      {paymentTypeOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="paymentMethod"
                    label="支付方式"
                    rules={[{ required: true, message: '请选择支付方式' }]}
                  >
                    <Select
                      placeholder="请选择支付方式"
                      dropdownMatchSelectWidth={true}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    >
                      {paymentMethodOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="amount"
                    label="缴费金额"
                    rules={[{ required: true, message: '请输入金额' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      placeholder="请输入金额"
                      prefix="¥"
                      precision={2}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="transactionDate"
                    label="交易日期"
                    rules={[{ required: true, message: '请选择交易日期' }]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                      placeholder="年/月/日"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: '16px 0' }} />
              <Title level={5} style={{ marginBottom: 16 }}>课时信息</Title>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="regularClasses"
                    label="正课课时"
                    rules={[{ required: true, message: '请输入正课课时数' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      placeholder="请输入课时数"
                      onChange={onClassHoursChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="bonusClasses"
                    label="赠送课时"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      placeholder="请输入赠送课时"
                      onChange={onClassHoursChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="validUntil"
                    label="有效期至"
                    rules={[{ required: true, message: '请选择有效期' }]}
                  >
                    <DatePicker
                      style={{ width: '160px' }}
                      format="YYYY年MM月DD日"
                      onChange={onValidUntilChange}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Form.Item
                    name="giftItems"
                    label="赠品"
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="请选择赠品 (可多选)"
                      loading={loadingGiftItems}
                      options={giftItemsOptions.map(item => ({
                        value: item.id,
                        label: item.constantValue
                      }))}
                      filterOption={(input, option) => 
                        typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())
                      }
                      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement || document.body}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: '16px 0' }} />
              <Title level={5} style={{ marginBottom: 16 }}>备注信息</Title>

              <Form.Item
                name="remarks"
              >
                <TextArea rows={4} placeholder="请输入备注信息" />
              </Form.Item>
            </Form>
          </Col>

          <Col span={9}>
            <div style={{ background: '#f9f9f9', padding: '24px', height: 'calc(100% - 0px)', borderRadius: '4px', overflowY: 'auto' }}>
              <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 16, fontSize: '18px' }}>报名课程信息</Typography.Title>

              <div style={{
                border: '1px solid #91d5ff',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',
                background: '#e6f7ff'
              }}>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography.Text strong style={{ fontSize: '16px' }}>
                    {selectedCourseInfo?.name || selectedCourseName || '-'}
                  </Typography.Text>
                  <Tag color={getStatusInfo(selectedCourseInfo?.status || student?.status).color} style={{ marginLeft: 'auto' }}>
                    {getStatusInfo(selectedCourseInfo?.status || student?.status).text}
                  </Tag>
                </div>

                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>课程类型：</span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{selectedCourseInfo?.type || student?.courseType || '-'}</span>
                </div>

                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>教练：</span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{selectedCourseInfo?.coach || student?.coach || '-'}</span>
                </div>

                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>报名日期：</span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{selectedCourseInfo?.enrollDate || student?.enrollDate || '-'}</span>
                </div>

                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>有效期至：</span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{selectedCourseInfo?.expireDate || student?.expireDate || '-'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>剩余课时：</span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    {currentClassHours} 课时
                  </span>
                </div>
              </div>

              <Divider style={{ margin: '24px 0' }} />

              <Typography.Title level={5} style={{ marginBottom: 16, fontSize: '18px' }}>缴费详情</Typography.Title>

              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>缴费课程：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                  {selectedCourseInfo?.name || selectedCourseName || '-'}
                </div>
              </div>

              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次缴费金额：</div>
                <div style={{ color: '#f5222d', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                  ¥{visible ? (form.getFieldValue('amount') || '0.00') : '0.00'}
                </div>
              </div>

              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>缴费日期：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>
                  {visible && form.getFieldValue('transactionDate') 
                    ? form.getFieldValue('transactionDate').format('YYYY-MM-DD') 
                    : dayjs().format('YYYY-MM-DD')}
                </div>
              </div>

              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次正课课时：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>
                  {visible ? (form.getFieldValue('regularClasses') || 0) : 0} 课时
                </div>
              </div>

              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次赠送课时：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>
                  {visible ? (form.getFieldValue('bonusClasses') || 0) : 0} 课时
                </div>
              </div>

              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次新增课时：</div>
                <div style={{ color: '#52c41a', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                  {calculatedNewClassHours} 课时
                </div>
              </div>

              <Divider style={{ margin: '24px 0' }} />

              <Typography.Title level={5} style={{ marginBottom: 16, fontSize: '18px' }}>缴费后状态</Typography.Title>

              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>变更后总课时：</div>
                <div style={{ color: '#1890ff', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                  {calculatedTotalClassHours} 课时
                </div>
              </div>

              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>新有效期至：</div>
                <div style={{ color: '#1890ff', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                  {newValidUntil}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: '8px' }}>赠品：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', width: '100%', minHeight: '30px' }}>
                  {getGiftLabels(selectedGifts)}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default PaymentModal;