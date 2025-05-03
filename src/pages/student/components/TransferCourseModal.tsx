import React from 'react';
import { Modal, Form, Input, Select, Spin, InputNumber, DatePicker, Row, Col, Typography, Divider, Button } from 'antd';
import { Student } from '../types/student';
import { SimpleCourse } from '@/api/course/types';
import { PlusOutlined } from '@ant-design/icons';
import QuickAddStudentModal from './QuickAddStudentModal';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface TransferCourseModalProps {
  visible: boolean;
  loading: boolean;
  form: any; // antd Form instance
  currentStudent: Student | null;
  availableCourses: SimpleCourse[];
  onOk: () => void;
  onCancel: () => void;

  // 转课特定 props
  students?: Student[]; // 所有学生列表
  transferStudentSearchResults?: Student[];
  isSearchingTransferStudent?: boolean;
  selectedTransferStudent?: Student | null;
  onSearchTransferStudent?: (value: string) => void;
  onSelectTransferStudent?: (studentId: string | number) => void;

  // 快速添加学员 props (如果 QuickAddStudentModal 可用)
  isQuickAddStudentModalVisible?: boolean;
  quickAddStudentForm?: any; // FormInstance
  showQuickAddStudentModal?: () => void;
  handleQuickAddStudentOk?: () => void;
  handleQuickAddStudentCancel?: () => void;
}

export const TransferCourseModal: React.FC<TransferCourseModalProps> = ({
  visible,
  loading,
  form,
  currentStudent,
  availableCourses,
  onOk,
  onCancel,
  // 转课 props
  students = [],
  transferStudentSearchResults = [],
  isSearchingTransferStudent = false,
  selectedTransferStudent,
  onSearchTransferStudent,
  onSelectTransferStudent,
  // 快速添加 props (如果可用)
  isQuickAddStudentModalVisible = false,
  quickAddStudentForm,
  showQuickAddStudentModal,
  handleQuickAddStudentOk,
  handleQuickAddStudentCancel,
}) => {

  // 合并搜索结果和完整列表，用于 Select 下拉框，并去重，排除自己
  const uniqueStudentsForSelect = React.useMemo(() => {
    const allStudentsMap = new Map<string | number, Student>();
    transferStudentSearchResults.forEach(s => allStudentsMap.set(s.id, s));
    if (selectedTransferStudent && !allStudentsMap.has(selectedTransferStudent.id)) {
      allStudentsMap.set(selectedTransferStudent.id, selectedTransferStudent);
    }
    students
      .filter(s => s.id !== currentStudent?.id) // 排除转出学员自己
      .forEach(s => {
        if (!allStudentsMap.has(s.id)) {
          allStudentsMap.set(s.id, s);
        }
      });
    // 确保选中的学员在列表的最前面，以便 Select 显示
    const studentArray = Array.from(allStudentsMap.values());
    if (selectedTransferStudent) {
        const index = studentArray.findIndex(s => s.id === selectedTransferStudent.id);
        if (index > 0) {
            const [selected] = studentArray.splice(index, 1);
            studentArray.unshift(selected);
        }
    }
    return studentArray;
  }, [transferStudentSearchResults, selectedTransferStudent, students, currentStudent]);

  return (
    <>
      <Modal
        title="学员转课"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
        destroyOnClose
        width={800}
        okText="确认转课"
        cancelText="取消"
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" name="transferCourseForm">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="studentName" label="转出学员">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="studentId" label="学员ID">
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
                    onChange={onSelectTransferStudent}
                    style={{ width: '100%' }}
                    dropdownStyle={{ zIndex: 1060 }}
                    getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                    notFoundContent={
                      isSearchingTransferStudent ? (
                        <div style={{ textAlign: 'center', padding: '8px 0' }}><span>搜索中...</span></div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '8px 0' }}>
                          <span>未找到匹配学员</span>
                        </div>
                      )
                    }
                    dropdownRender={menu => (
                      <div>
                        {menu}
                      </div>
                    )}
                  >
                    {uniqueStudentsForSelect.map(s => (
                      <Option key={String(s.id)} value={s.id}>
                        {s.name} ({s.id}) - {s.phone}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="toCourseId"
                  label="转入课程"
                  rules={[{ required: true, message: '请选择要转入的课程' }]}
                >
                  <Select placeholder="请选择课程名称" showSearch optionFilterProp="children">
                    {availableCourses.map((course) => (
                      <Option key={String(course.id)} value={course.id}>
                        {course.name}
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
                  initialValue={1}
                >
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="要转出多少课时" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="priceDifference"
                  label="补差价"
                  tooltip="负数表示退还差价"
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value ? parseFloat(value.replace(/[^\d.-]/g, '')) : 0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
               <Col span={12}>
                <Form.Item
                  name="validUntil"
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="请选择新课程有效期" />
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
          </Form>
        </Spin>
      </Modal>

      {quickAddStudentForm && showQuickAddStudentModal && handleQuickAddStudentOk && handleQuickAddStudentCancel && (
        <QuickAddStudentModal
          visible={isQuickAddStudentModalVisible}
          form={quickAddStudentForm}
          onOk={handleQuickAddStudentOk}
          onCancel={handleQuickAddStudentCancel}
        />
      )}
    </>
  );
}; 