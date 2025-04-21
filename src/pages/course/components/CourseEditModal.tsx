import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Spin } from 'antd';
import { BookOutlined, DollarOutlined } from '@ant-design/icons';
import { Course, CourseType, CourseStatus } from '../types/course';
import { categoryOptions, statusOptions } from '../constants/courseOptions';
import { coach as coachAPI } from '@/api/coach';
import { CoachSimple } from '@/api/coach/types';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';
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

  // 课程类型列表状态
  const [courseTypes, setCourseTypes] = useState<Constant[]>([]);
  const [loadingCourseTypes, setLoadingCourseTypes] = useState(false);

  // 当模态框打开时获取教练列表和课程类型
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

      // 模态框打开时获取课程类型列表
      const fetchCourseTypes = async () => {
        try {
          setLoadingCourseTypes(true);
          console.log('CourseEditModal: 获取课程类型列表');
          const typeList = await API.constants.getList('COURSE_TYPE');
          console.log('CourseEditModal: 获取到课程类型列表:', typeList);
          setCourseTypes(typeList);

          // 如果是编辑模式，需要根据课程类型设置 typeId
          if (editingCourse) {
            // 如果编辑的课程已有 typeId，直接使用
            if (editingCourse.typeId) {
              console.log('编辑课程时使用现有 typeId:', editingCourse.typeId);
              form.setFieldsValue({ typeId: editingCourse.typeId });
            }
            // 如果没有 typeId 但有 type，需要根据 type 找到对应的 id
            else if (editingCourse.type) {
              // 尝试根据 type 字段找到对应的课程类型
              const matchedType = typeList.find(t => t.constantKey === editingCourse.type);
              if (matchedType) {
                console.log('根据 type 找到对应的课程类型 ID:', matchedType.id);
                form.setFieldsValue({ typeId: matchedType.id });
              }
            }
          } else {
            // 如果是添加模式，默认选择第一个课程类型
            if (typeList.length > 0) {
              console.log('添加课程时默认选择第一个课程类型 ID:', typeList[0].id);
              form.setFieldsValue({ typeId: typeList[0].id });
            }
          }
        } catch (error) {
          console.error('获取课程类型列表失败:', error);
        } finally {
          setLoadingCourseTypes(false);
        }
      };

      // 并行调用两个API
      fetchCoaches();
      fetchCourseTypes();
    }
  }, [visible]);
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
          typeId: 1, // 私教课
          status: CourseStatus.PUBLISHED,
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
              <Input prefix={<BookOutlined />} placeholder="请输入课程名称" />
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
                  loading={loadingCourseTypes}
                  notFoundContent={loadingCourseTypes ? <Spin size="small" /> : null}
                  onChange={(value) => {
                    console.log('选中的课程类型 ID:', value);
                    // 将选中的 ID 设置到表单的 typeId 字段
                    form.setFieldsValue({ typeId: value });
                  }}
                >
                  {/* 如果有从 API 获取的课程类型，则使用这些类型 */}
                  {courseTypes.length > 0 ? (
                    courseTypes.map(type => (
                      <Option key={type.id} value={type.id}>
                        {type.constantValue}
                      </Option>
                    ))
                  ) : (
                    // 否则使用默认的类型选项
                    categoryOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))
                  )}
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
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="price"
              label="课筹单价(元)"
              rules={[{ required: true, message: '请输入课筹单价' }]}
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

        {/* 隐藏的校区ID字段 */}
        <Form.Item
          name="campusId"
          style={{ display: 'none' }}
        >
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseEditModal;