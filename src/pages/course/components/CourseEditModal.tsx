import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Spin } from 'antd';
import { BookOutlined, DollarOutlined } from '@ant-design/icons';
import { Course } from '../types/course';
import { categoryOptions } from '../constants/courseOptions';
import { coach as coachAPI } from '@/api/coach';
import { CoachSimple } from '@/api/coach/types';
import CustomRadioGroup from './CustomRadioGroup';

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
  // 教练列表状态
  const [coaches, setCoaches] = useState<CoachSimple[]>([]);
  const [loadingCoaches, setLoadingCoaches] = useState(false);

  // 当模态框打开时获取教练列表
  useEffect(() => {
    if (visible) {
      fetchCoaches();
    }
  }, [visible]);

  // 获取教练列表
  const fetchCoaches = async () => {
    setLoadingCoaches(true);
    try {
      const coachList = await coachAPI.getSimpleList();
      setCoaches(coachList);
    } catch (error) {
      console.error('获取教练列表失败:', error);
    } finally {
      setLoadingCoaches(false);
    }
  };
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
              <div className="select-wrapper">
                <Select
                  placeholder="请选择课程类型"
                  popupMatchSelectWidth={true}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                >
                  {categoryOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>
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
              <CustomRadioGroup />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="coaches"
              label="上课教练"
              rules={[{ required: true, message: '请选择上课教练' }]}
            >
              <div className="select-wrapper">
                <Select
                  placeholder="请选择上课教练"
                  style={{ width: '100%' }}
                  popupMatchSelectWidth={true}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  loading={loadingCoaches}
                  notFoundContent={loadingCoaches ? <Spin size="small" /> : null}
                >
                  {coaches.map(coach => (
                    <Option key={coach.id} value={coach.id}>
                      {coach.name}
                    </Option>
                  ))}
                </Select>
              </div>
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