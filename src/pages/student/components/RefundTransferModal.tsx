import React from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Row, 
  Col, 
  Typography,
  DatePicker,
  Divider,
  Button,
  message
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Student, CourseSummary } from '../types/student';
import { courseOptions } from '../constants/options';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import QuickAddStudentModal from './QuickAddStudentModal';

const { Option, OptGroup } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface RefundTransferModalProps {
  visible: boolean;
  form: FormInstance;
  operationType: 'refund' | 'transfer' | 'transferClass';
  student: Student | null;
  studentCourses: CourseSummary[];
  transferStudentSearchResults: Student[];
  isSearchingTransferStudent: boolean;
  selectedTransferStudent: Student | null;
  onCancel: () => void;
  onOk: () => void;
  onSearchTransferStudent: (value: string) => void;
  onSelectTransferStudent: (student: Student) => void;
  students: Student[];
  isQuickAddStudentModalVisible: boolean;
  quickAddStudentForm: FormInstance;
  showQuickAddStudentModal: () => void;
  handleQuickAddStudentOk: () => void;
  handleQuickAddStudentCancel: () => void;
}

const RefundTransferModal: React.FC<RefundTransferModalProps> = ({
  visible,
  form,
  operationType,
  student,
  studentCourses,
  transferStudentSearchResults,
  isSearchingTransferStudent,
  selectedTransferStudent,
  onCancel,
  onOk,
  onSearchTransferStudent,
  onSelectTransferStudent,
  students,
  isQuickAddStudentModalVisible,
  quickAddStudentForm,
  showQuickAddStudentModal,
  handleQuickAddStudentOk,
  handleQuickAddStudentCancel
}) => {

  // 计算去重后的学员列表，用于下拉选择
  const uniqueStudents = React.useMemo(() => {
    const allStudentsMap = new Map<string, Student>();

    // 优先添加搜索结果
    transferStudentSearchResults.forEach(s => allStudentsMap.set(s.id, s));

    // 添加当前选中的学员（如果不在 Map 中）
    if (selectedTransferStudent && !allStudentsMap.has(selectedTransferStudent.id)) {
      allStudentsMap.set(selectedTransferStudent.id, selectedTransferStudent);
    }

    // 添加所有学员（排除当前转出学员，且不在 Map 中）
    students
      .filter(s => s.id !== student?.id) // 排除转出学员
      .forEach(s => {
        if (!allStudentsMap.has(s.id)) { // 避免重复添加
          allStudentsMap.set(s.id, s);
        }
      });

    // 确保当前选中的学员一定在列表里，即使他是转出学员（虽然逻辑上不应该，但做个保护）
    if (selectedTransferStudent && !allStudentsMap.has(selectedTransferStudent.id)) {
       allStudentsMap.set(selectedTransferStudent.id, selectedTransferStudent);
    }

    return Array.from(allStudentsMap.values());
  }, [transferStudentSearchResults, selectedTransferStudent, students, student]);


  // 获取标题文本
  const getTitleText = () => {
    switch (operationType) {
      case 'refund':
        return '退费';
      case 'transfer':
        return '转课';
      case 'transferClass':
        return '转班';
      default:
        return '操作';
    }
  };

  return (
    <>
      <Modal
        title={
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {getTitleText()}
          </span>
        }
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        width={800}
        okText="确认提交"
        cancelText="取消"
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        
        <Form
          form={form}
          layout="vertical"
        >
          {/* 退费模块 */}
          {operationType === 'refund' && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="studentName"
                    label="学员姓名"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="studentId"
                    label="学员ID"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider style={{ margin: '12px 0' }} />
              <Title level={5} style={{ marginBottom: 16 }}>退费信息</Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fromCourseId"
                    label="原课程"
                    rules={[{ required: true, message: '请选择原课程' }]}
                  >
                    <Select placeholder="请选择原课程">
                      {studentCourses.map(course => (
                        <Option key={course.id} value={course.id || ''}>
                          {course.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="refundClassHours"
                    label="退课课时"
                    rules={[{ required: true, message: '请输入退课课时' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="refundAmount"
                    label="退款金额"
                    rules={[{ required: true, message: '请输入退款金额' }]}
                  >
                    <InputNumber 
                      min={0}
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
                      onChange={() => {
                        setTimeout(() => {
                          const refundAmount = form.getFieldValue('refundAmount') || 0;
                          const serviceFee = form.getFieldValue('serviceFee') || 0;
                          const otherFee = form.getFieldValue('otherFee') || 0;
                          const actualRefund = refundAmount - serviceFee - otherFee;
                          form.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                        }, 0);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="serviceFee"
                    label="手续费"
                    initialValue={0}
                    rules={[{ required: true, message: '请输入手续费' }]}
                  >
                    <InputNumber 
                      min={0} 
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
                      onChange={() => {
                        setTimeout(() => {
                          const refundAmount = form.getFieldValue('refundAmount') || 0;
                          const serviceFee = form.getFieldValue('serviceFee') || 0;
                          const otherFee = form.getFieldValue('otherFee') || 0;
                          const actualRefund = refundAmount - serviceFee - otherFee;
                          form.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                        }, 0);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="otherFee"
                    label="其它费用扣除"
                    initialValue={0}
                    rules={[{ required: true, message: '请输入其它费用' }]}
                    tooltip="如教材费、器材费等不予退还的费用"
                  >
                    <InputNumber 
                      min={0} 
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
                      onChange={() => {
                        setTimeout(() => {
                          const refundAmount = form.getFieldValue('refundAmount') || 0;
                          const serviceFee = form.getFieldValue('serviceFee') || 0;
                          const otherFee = form.getFieldValue('otherFee') || 0;
                          const actualRefund = refundAmount - serviceFee - otherFee;
                          form.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                        }, 0);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="actualRefund"
                    label="实际退费金额"
                    initialValue={0}
                    tooltip="实际退费金额 = 退款金额 - 手续费 - 其它费用扣除"
                  >
                    <InputNumber 
                      min={0}
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="reason"
                label="退费原因"
                rules={[{ required: true, message: '请输入退费原因' }]}
              >
                <TextArea rows={4} placeholder="请输入退费原因" />
              </Form.Item>
            </>
          )}
          
          {/* 转课模块 */}
          {operationType === 'transfer' && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="studentName"
                    label="转出学员"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="studentId"
                    label="学员ID"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider style={{ margin: '12px 0' }} />
              <Title level={5} style={{ marginBottom: 16 }}>转入学员信息</Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="targetStudentId"
                    label="转入学员"
                    rules={[{ required: true, message: '请选择要转课给哪个学员' }]}
                  >
                    <Select
                      showSearch
                      placeholder="请输入学员姓名/ID/电话搜索"
                      optionFilterProp="children"
                      filterOption={false}
                      onSearch={onSearchTransferStudent}
                      loading={isSearchingTransferStudent}
                      value={selectedTransferStudent?.id}
                      onChange={(value) => {
                        const selected = students.find(s => s.id === value);
                        if (selected) {
                          onSelectTransferStudent(selected);
                          form.setFieldsValue({ targetStudentId: selected.id });
                        }
                      }}
                      style={{ width: '100%' }}
                      notFoundContent={ 
                        isSearchingTransferStudent ? (
                          <div style={{ textAlign: 'center', padding: '8px 0' }}>
                            <span>搜索中...</span>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '8px 0' }}>
                            <span>未找到匹配学员</span>
                            <div style={{ marginTop: 8 }}>
                              <Button 
                                size="small" 
                                type="primary"
                                onClick={showQuickAddStudentModal}
                              >
                                添加新学员
                              </Button>
                            </div>
                          </div>
                        )
                      }
                      dropdownRender={menu => (
                        <div>
                          {menu}
                          <Divider style={{ margin: '4px 0' }} />
                          <div style={{ padding: '8px', textAlign: 'center' }}>
                            <Button 
                              type="link" 
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={showQuickAddStudentModal}
                            >
                              添加新学员
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {/* 使用去重后的学员列表渲染选项 */}
                      {uniqueStudents.map(s => (
                        <Option key={s.id} value={s.id}>
                          {s.name} ({s.id}) - {s.phone}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="toCourseId"
                    label="课程名称"
                    rules={[{ required: true, message: '请选择课程名称' }]}
                  >
                    <Select placeholder="请选择课程名称">
                      {courseOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="transferClassHours"
                    label="转课课时"
                    rules={[{ required: true, message: '请输入转课课时' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="priceDifference"
                    label="补差价"
                    tooltip="负数表示退还差价，正数表示需要补交差价"
                    initialValue={0}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.-]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
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
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="reason"
                label="转课原因"
                rules={[{ required: true, message: '请输入转课原因' }]}
              >
                <TextArea rows={4} placeholder="请输入转课原因" />
              </Form.Item>
            </>
          )}
          
          {/* 转班模块 */}
          {operationType === 'transferClass' && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="studentName"
                    label="学员姓名"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="studentId"
                    label="学员ID"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider style={{ margin: '12px 0' }} />
              <Title level={5} style={{ marginBottom: 16 }}>转班信息</Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fromCourseId"
                    label="原课程"
                    rules={[{ required: true, message: '请选择原课程' }]}
                  >
                    <Select placeholder="请选择原课程">
                      {studentCourses.map(course => (
                        <Option key={course.id} value={course.id || ''}>
                          {course.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="toCourseId"
                    label="新课程名称"
                    rules={[{ required: true, message: '请选择新课程名称' }]}
                  >
                    <Select placeholder="请选择新课程名称">
                      {courseOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="transferClassHours"
                    label="转班课时"
                    rules={[{ required: true, message: '请输入转班课时' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="priceDifference"
                    label="补差价"
                    tooltip="负数表示退还差价，正数表示需要补交差价"
                    initialValue={0}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.-]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
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
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="reason"
                label="转班原因"
                rules={[{ required: true, message: '请输入转班原因' }]}
              >
                <TextArea rows={4} placeholder="请输入转班原因" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      <QuickAddStudentModal
        visible={isQuickAddStudentModalVisible}
        form={quickAddStudentForm}
        onOk={handleQuickAddStudentOk}
        onCancel={handleQuickAddStudentCancel}
      />
    </>
  );
};

export default RefundTransferModal; 