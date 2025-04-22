import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Spin, Button, Divider } from 'antd';
import { BookOutlined, DollarOutlined, SaveOutlined } from '@ant-design/icons';
import { Course, CourseType, CourseStatus } from '../types/course';
import { statusOptions } from '../constants/courseOptions';
import { coach as coachAPI } from '@/api/coach';
import { CoachSimple } from '@/api/coach/types';
import { Constant } from '@/api/constants/types';
import CustomRadioGroup from './CustomRadioGroup';
import './CourseEditModal.css';

const { TextArea } = Input;
const { Option } = Select;

interface CourseEditModalProps {
  visible: boolean;
  editingCourse: Course | null;
  loading: boolean;
  form: any;
  onCancel: () => void;
  onSubmit: () => void;
  cachedTypes?: Constant[];
  typesLoading?: boolean;
}

const CourseEditModal: React.FC<CourseEditModalProps> = ({
  visible,
  editingCourse,
  loading,
  form,
  onCancel,
  onSubmit,
  cachedTypes = [],
  typesLoading = false
}) => {
  // 教练列表状态
  const [coaches, setCoaches] = useState<CoachSimple[]>([]);
  const [loadingCoaches, setLoadingCoaches] = useState(false);

  // 当模态框打开时，设置表单初始值
  useEffect(() => {
    if (visible && editingCourse && cachedTypes.length > 0) {
      // 如果是编辑模式，设置typeId字段
      const matchedType = cachedTypes.find(t => t.constantKey === editingCourse.type);
      if (matchedType) {
        console.log('根据 type 找到对应的课程类型 ID:', matchedType.id);
        form.setFieldsValue({ typeId: matchedType.id });
      }
    } else if (visible && !editingCourse && cachedTypes.length > 0) {
      // 如果是添加模式，默认选择第一个课程类型
      console.log('添加课程时默认选择第一个课程类型 ID:', cachedTypes[0].id);
      form.setFieldsValue({ typeId: cachedTypes[0].id });
    }
  }, [visible, editingCourse, cachedTypes, form]);

  // 当模态框打开时获取教练列表
  useEffect(() => {
    if (visible) {
      // 模态框打开时获取教练列表
      const fetchCoaches = async () => {
        try {
          setLoadingCoaches(true);
          console.log('CourseEditModal: 获取教练列表');
          // 获取当前校区ID
          const currentCampusId = form.getFieldValue('campusId') || localStorage.getItem('currentCampusId') || '1';
          const coachList = await coachAPI.getSimpleList(currentCampusId);
          console.log('CourseEditModal: 获取到教练列表:', coachList);
          setCoaches(coachList);
        } catch (error) {
          console.error('获取教练列表失败:', error);
        } finally {
          setLoadingCoaches(false);
        }
      };

      // 调用API获取教练列表
      fetchCoaches();
    }
  }, [visible, form]);

  // 根据是编辑还是添加模式获取对应的加载提示文字
  const getLoadingTip = () => {
    return editingCourse ? "正在保存" : "正在添加";
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
      maskClosable={!loading} // 禁用蒙层点击关闭
      keyboard={!loading} // 禁用ESC键关闭
      closable={!loading} // 禁用右上角关闭按钮
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={onSubmit}
          icon={<SaveOutlined />}
        >
          {editingCourse ? '保存' : '添加'}
        </Button>
      ]}
      className="course-edit-modal"
    >
      <Divider style={{ margin: '0 0 16px 0' }} />
      
      <Spin spinning={loading} tip={getLoadingTip()}>
        <Form
          form={form}
          layout="vertical"
          name="courseForm"
          initialValues={{
            typeId: null, // 默认不选择，等待API返回后设置
            status: CourseStatus.PUBLISHED, // 默认已发布状态
            unitHours: 1,
            totalHours: 10,
            price: 100,
            coachIds: [],
            campusId: Number(localStorage.getItem('currentCampusId') || '1'),
            description: ''
          }}
          onValuesChange={(changedValues, allValues) => {
            console.log('表单值变化:', changedValues, '所有值:', allValues);
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="课程名称"
                rules={[{ required: true, message: '请输入课程名称' }]}
              >
                <Input 
                  prefix={<BookOutlined />} 
                  placeholder="请输入课程名称" 
                  disabled={loading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="typeId"
                label="课程类型"
                rules={[{ required: true, message: '请选择课程类型' }]}
              >
                <div className="select-wrapper">
                  <Select
                    placeholder="请选择课程类型"
                    popupMatchSelectWidth={true}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    loading={typesLoading}
                    notFoundContent={typesLoading ? <Spin size="small" /> : null}
                    onChange={(value) => {
                      console.log('选中的课程类型 ID:', value);
                      // 将选中的 ID 设置到表单的 typeId 字段
                      form.setFieldsValue({ typeId: value });
                    }}
                    disabled={loading}
                  >
                    {cachedTypes.map(type => (
                      <Option key={type.id} value={type.id}>
                        {type.constantValue}
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
                <CustomRadioGroup disabled={loading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="coachIds"
                label="上课教练"
                rules={[{ required: true, message: '请选择上课教练', type: 'array' }]}
              >
                <div className="select-wrapper">
                  <Select
                    placeholder="请选择上课教练"
                    style={{ width: '100%' }}
                    popupMatchSelectWidth={true}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    loading={loadingCoaches}
                    notFoundContent={loadingCoaches ? <Spin size="small" /> : null}
                    maxTagCount={3}
                    maxTagTextLength={4}
                    allowClear
                    optionFilterProp="children"
                    mode="multiple"
                    onChange={(values) => {
                      console.log('选中教练IDs:', values);
                      // 将选中的教练ID设置到表单中
                      form.setFieldsValue({ coachIds: values });
                    }}
                    disabled={loading}
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
            <Col span={8}>
              <Form.Item
                name="unitHours"
                label="每次消耗课时"
                rules={[{ required: true, message: '请输入每次消耗课时' }]}
              >
                <InputNumber
                  min={0.5}
                  step={0.5}
                  style={{ width: '100%' }}
                  placeholder="请输入每次消耗课时"
                  disabled={loading}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalHours"
                label="总课时"
                rules={[{ required: true, message: '请输入总课时' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="请输入总课时"
                  disabled={loading}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="课程价格(元)"
                rules={[{ required: true, message: '请输入课程价格' }]}
              >
                <InputNumber
                  min={0}
                  step={10}
                  style={{ width: '100%' }}
                  prefix={<DollarOutlined />}
                  placeholder="请输入课程价格"
                  disabled={loading}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="课程描述"
              >
                <TextArea
                  rows={4}
                  placeholder="请输入课程描述（选填）"
                  maxLength={200}
                  showCount
                  disabled={loading}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CourseEditModal;