import React from 'react';
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
  Divider
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Student, CourseSummary } from '../types/student';
import { 
  courseTypeOptions, 
  paymentTypeOptions, 
  paymentMethodOptions, 
  giftOptions 
} from '../constants/options';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface PaymentModalProps {
  visible: boolean;
  form: FormInstance;
  student: Student | null;
  coursesList: CourseSummary[];
  selectedCourse: string;
  selectedCourseName: string;
  currentClassHours: number;
  newClassHours: number;
  totalClassHours: number;
  newValidUntil: string;
  onCancel: () => void;
  onOk: () => void;
  onCourseChange: (courseId: string) => void;
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
  onCancel,
  onOk,
  onCourseChange,
  onClassHoursChange,
  onValidUntilChange
}) => {
  const selectedGifts = Form.useWatch('gift', form);

  const getGiftLabels = (values: string[] | undefined): string => {
    if (!values || values.length === 0) {
      return '无';
    }
    return values
      .map(value => giftOptions.find(opt => opt.value === value)?.label)
      .filter(label => !!label)
      .join('、');
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
          缴费登记
        </span>
      }
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={900}
      okText="确认提交"
      cancelText="取消"
    >
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
                  >
                    {coursesList.map(course => (
                      <Option key={course.id} value={course.id || ''}>
                        {course.name}
                      </Option>
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
                  <Select placeholder="请选择课程类型" disabled>
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
                  <Select placeholder="请选择缴费类型">
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
                  <Select placeholder="请选择支付方式">
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
              <Col span={12}>
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
              <Col span={12}>
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
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="validUntil"
                  label="有效期至"
                  rules={[{ required: true, message: '请选择有效期' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="YYYY年MM月DD日"
                    onChange={onValidUntilChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gift"
                  label="赠品"
                >
                  <Select 
                    mode="multiple"
                    placeholder="请选择赠品" 
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    allowClear
                  >
                    {giftOptions.map(option => (
                      <Option key={option.value} value={option.value} label={option.label}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
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
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>缴费预览</div>
          </div>
          <div style={{ background: '#f5f5f5', padding: '20px', height: 'calc(100% - 44px)', borderRadius: '4px', overflowY: 'auto' }}>
            <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>报名课程信息</Typography.Title>
            
            {coursesList.map((course: CourseSummary, index: number) => (
              <div key={index} style={{ 
                border: '1px solid #d9d9d9', 
                borderRadius: '4px', 
                padding: '12px', 
                marginBottom: '12px',
                background: course.id === selectedCourse ? '#e6f7ff' : '#fff',
                borderColor: course.id === selectedCourse ? '#1890ff' : '#d9d9d9'
              }}>
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography.Text strong>{course.name}</Typography.Text>
                  <Tag color={
                    course.status === '在学' ? 'green' : 
                    course.status === '停课' ? 'red' : 'orange'
                  }>{course.status}</Tag>
                </div>
                
                <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>课程类型：</span>
                  <span>{course.type}</span>
                </div>
                
                <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>教练：</span>
                  <span>{course.coach}</span>
                </div>
                
                <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>报名日期：</span>
                  <span>{course.enrollDate}</span>
                </div>
                
                <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>有效期至：</span>
                  <span>{course.expireDate}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>剩余课时：</span>
                  <span>{course.remainingClasses}</span>
                </div>
              </div>
            ))}
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Typography.Title level={5} style={{ marginBottom: 8 }}>缴费详情</Typography.Title>
            
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>缴费课程：</div>
              <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                {selectedCourseName}
              </div>
            </div>
            
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次缴费金额：</div>
              <div style={{ color: '#f5222d', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                ¥{form.getFieldValue('amount') || '0.00'}
              </div>
            </div>
            
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>缴费日期：</div>
              <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>
                {form.getFieldValue('transactionDate')?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD')}
              </div>
            </div>
            
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次正课课时：</div>
              <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>
                {form.getFieldValue('regularClasses') || 0} 课时
              </div>
            </div>
            
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次赠送课时：</div>
              <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>
                {form.getFieldValue('bonusClasses') || 0} 课时
              </div>
            </div>
            
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次新增课时：</div>
              <div style={{ color: '#52c41a', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                {newClassHours} 课时
              </div>
            </div>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Typography.Title level={5} style={{ marginBottom: 8 }}>缴费后状态</Typography.Title>
            
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>变更后总课时：</div>
              <div style={{ color: '#1890ff', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                {totalClassHours} 课时
              </div>
            </div>
            
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>新有效期至：</div>
              <div style={{ color: '#1890ff', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                {newValidUntil}
              </div>
            </div>
            
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>赠品：</div>
              <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right', wordBreak: 'break-all' }}>
                {getGiftLabels(selectedGifts)}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default PaymentModal; 