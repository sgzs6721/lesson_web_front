import React from 'react';
import { Modal, Form, Input, Select, Radio, InputNumber, Row, Col } from 'antd';
import { BookOutlined, DollarOutlined } from '@ant-design/icons';
import { Course } from '../types/course';
import { categoryOptions, coachOptions } from '../constants/courseOptions';

const { TextArea } = Input;
const { Option } = Select;

interface CourseEditModalProps {
  visible: boolean;
  editingCourse: Course | null;
  loading: boolean;
  form: any;
  onCancel: () => void;
  onSubmit: () => void;
}

const CourseEditModal: React.FC<CourseEditModalProps> = ({
  visible,
  editingCourse,
  loading,
  form,
  onCancel,
  onSubmit
}) => {
  return (
    <Modal
      title={editingCourse ? '编辑课程' : '添加课程'}
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      width={800}
      okText={editingCourse ? '保存' : '添加'}
      cancelText="取消"
      confirmLoading={loading}
    >
      <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 16, paddingBottom: 8 }}></div>
      <Form
        form={form}
        layout="vertical"
        name="courseForm"
        initialValues={{
          level: 'beginner',
          status: 'active',
          hoursPerClass: 1,
          unitPrice: 100
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="课程名称"
              rules={[{ required: true, message: '请输入课程名称' }]}
            >
              <Input prefix={<BookOutlined />} placeholder="请输入课程名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="课程类型"
              rules={[{ required: true, message: '请选择课程类型' }]}
            >
              <Select placeholder="请选择课程类型">
                {categoryOptions.map(option => (
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
              name="status"
              label="课程状态"
              rules={[{ required: true, message: '请选择课程状态' }]}
            >
              <Radio.Group>
                <Radio value="active">开课中</Radio>
                <Radio value="inactive">已停课</Radio>
                <Radio value="pending">待开课</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="coaches"
              label="上课教练"
              rules={[{ required: true, message: '请选择上课教练' }]}
            >
              <Select 
                placeholder="请选择上课教练"
                style={{ width: '100%' }}
              >
                {coachOptions.map(option => (
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
              name="hoursPerClass"
              label="每次消耗课时"
              rules={[{ required: true, message: '请输入每次消耗课时' }]}
            >
              <InputNumber
                min={0.5}
                step={0.5}
                style={{ width: '100%' }}
                placeholder="请输入每次消耗课时"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="unitPrice"
              label="课筹单价(元)"
              rules={[{ required: false, message: '请输入课筹单价' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                prefix={<DollarOutlined />}
                placeholder="请输入课筹单价"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="课程描述"
          rules={[{ required: false, message: '请输入课程描述' }]}
        >
          <TextArea rows={4} placeholder="请输入课程描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseEditModal; 