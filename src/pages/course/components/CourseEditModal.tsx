import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Spin, Button, Divider, message } from 'antd';
import { BookOutlined, DollarOutlined, SaveOutlined } from '@ant-design/icons';
import { Course, CourseStatus } from '../types/course';
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
  cachedCoaches?: CoachSimple[];
  typesLoading?: boolean;
  coachesLoading?: boolean;
}

const CourseEditModal: React.FC<CourseEditModalProps> = ({
  visible,
  editingCourse,
  loading,
  form,
  onCancel,
  onSubmit,
  cachedTypes = [],
  cachedCoaches = [],
  typesLoading = false,
  coachesLoading = false
}) => {
  // 表单是否已初始化
  const [formInitialized, setFormInitialized] = useState(false);

  // 当模态框打开时加载数据并初始化表单
  useEffect(() => {
    // 只在模态框可见时执行
    if (!visible) return;

    // 设置加载状态
    setFormInitialized(false);
    
    // 先清空表单，避免显示上一次的数据
    form.resetFields();

    // 强制清空选择器（防止之前的值残留）
    form.setFieldsValue({
      coachIds: [],
      typeId: undefined
    });

    // 保存当前的编辑课程和类型列表，避免循环引用
    const currentEditingCourse = editingCourse;
    const currentCachedTypes = cachedTypes;

    // 定义异步函数来加载数据
    const loadData = async () => {
      try {
        // 准备表单数据
        if (currentEditingCourse) {
          // 编辑模式
          console.log('编辑课程数据:', JSON.stringify(currentEditingCourse, null, 2));

          // 处理状态值，确保它始终为预期的格式
          let statusValue = currentEditingCourse.status;
          console.log('原始状态值:', statusValue, '类型:', typeof statusValue);
          
          // 如果状态值不是 CourseStatus 枚举中定义的值，尝试转换
          const statusStr = String(statusValue).toUpperCase();
          if (statusStr === '1' || statusStr === 'PUBLISHED') {
            statusValue = CourseStatus.PUBLISHED;
          } else if (statusStr === 'SUSPENDED') {
            statusValue = CourseStatus.SUSPENDED;
          } else if (statusStr === 'TERMINATED') {
            statusValue = CourseStatus.TERMINATED;
          }
          
          console.log('处理后的状态值:', statusValue);

          // 从 coaches 数组提取教练 ID
          const coachIds = currentEditingCourse.coaches?.map(coach => Number(coach.id)) || [];
          console.log('解析后的教练ID列表:', coachIds);

          // 查找匹配的课程类型 ID
          let typeId = null;
          if (currentCachedTypes.length > 0) {
            console.log('当前课程类型:', currentEditingCourse.type);
            console.log('可用的课程类型列表:', JSON.stringify(currentCachedTypes.map(t => ({ id: t.id, value: t.constantValue })), null, 2));
            
            // 在缓存的课程类型中查找匹配的类型
            const matchedType = currentCachedTypes.find(type => {
              // 尝试多种匹配方式
              return (
                type.constantValue === currentEditingCourse.type || 
                type.constantKey === currentEditingCourse.type ||
                String(type.id) === String(currentEditingCourse.type)
              );
            });

            if (matchedType) {
              typeId = Number(matchedType.id);
              console.log('找到匹配的课程类型:', matchedType.constantValue, '对应ID:', typeId);
            } else {
              console.log('未找到匹配的课程类型:', currentEditingCourse.type);
              // 如果没有找到匹配的类型，则使用第一个类型
              if (currentCachedTypes.length > 0) {
                typeId = Number(currentCachedTypes[0].id);
                console.log('使用默认类型:', currentCachedTypes[0].constantValue, '对应ID:', typeId);
              }
            }
          } else {
            console.log('没有可用的课程类型列表');
          }

          // 准备表单数据
          const formValues = {
            name: currentEditingCourse.name,
            typeId: typeId, // 使用找到的类型 ID
            status: statusValue, // 使用处理后的状态值
            unitHours: currentEditingCourse.unitHours,
            price: currentEditingCourse.price,
            coachFee: currentEditingCourse.coachFee,
            coachIds: coachIds,
            campusId: currentEditingCourse.campusId,
            description: currentEditingCourse.description || ''
          };

          console.log('设置表单初始值:', JSON.stringify(formValues, null, 2));
          console.log('coachIds值:', formValues.coachIds);
          console.log('typeId值:', formValues.typeId);
          console.log('status值:', formValues.status, '类型:', typeof formValues.status);

          // 设置表单值
          form.setFieldsValue(formValues);
          
          // 获取并输出当前表单值，以确认设置是否成功
          const currentValues = form.getFieldsValue();
          console.log('设置后的表单实际值:', JSON.stringify(currentValues, null, 2));
          console.log('表单中的coachIds实际值:', currentValues.coachIds);
          console.log('表单中的typeId实际值:', currentValues.typeId);
          console.log('表单中的status实际值:', currentValues.status, '类型:', typeof currentValues.status);
          
          // 强制设置状态值
          setTimeout(() => {
            console.log('强制设置状态值:', statusValue);
            
            // 先使用setFields直接设置
            form.setFields([
              {
                name: 'status',
                value: statusValue
              }
            ]);
            
            // 然后使用setFieldValue再次设置
            form.setFieldValue('status', statusValue);
            
            // 再次获取状态值，检查是否设置成功
            const updatedStatus = form.getFieldValue('status');
            console.log('强制设置后的状态值:', updatedStatus);
            
            // 标记表单为初始化完成
            setFormInitialized(true);
          }, 200);
        } else {
          // 添加模式
          if (currentCachedTypes.length > 0) {
            const defaultStatus = CourseStatus.PUBLISHED;
            console.log('添加模式，设置默认状态:', defaultStatus);
            
            form.setFieldsValue({
              status: defaultStatus,
              unitHours: 1,
              price: 100,
              coachFee: 50,
              coachIds: [],
              campusId: Number(localStorage.getItem('currentCampusId') || '1'),
              description: ''
            });
            
            // 强制设置状态值
            setTimeout(() => {
              console.log('强制设置默认状态值:', defaultStatus);
              
              // 先使用setFields直接设置
              form.setFields([
                {
                  name: 'status',
                  value: defaultStatus
                }
              ]);
              
              // 然后使用setFieldValue再次设置
              form.setFieldValue('status', defaultStatus);
              
              // 再次获取状态值，检查是否设置成功
              const updatedStatus = form.getFieldValue('status');
              console.log('强制设置后的默认状态值:', updatedStatus);
              
              // 添加模式下直接设置初始化完成
              setFormInitialized(true);
            }, 200);
          }
        }
      } catch (error) {
        console.error('加载数据出错:', error);
        message.error('加载课程数据失败');
        setFormInitialized(true); // 即使出错也要设置为已初始化，避免一直显示加载中
      }
    };

    // 执行数据加载
    loadData();

  // 仅依赖 visible 变化，避免循环引用
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // 根据是编辑还是添加模式获取对应的加载提示文字
  const getLoadingTip = () => {
    return editingCourse ? "正在保存" : "正在添加";
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px' }}>
          {editingCourse ? '编辑课程' : '添加课程'}
        </div>
      }
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      width={800}
      okText={editingCourse ? '保存' : '添加'}
      cancelText="取消"
      confirmLoading={loading}
      maskClosable={!loading}
      keyboard={!loading}
      closable={!loading}
      destroyOnClose={false}
      forceRender={true}
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

      <Spin spinning={loading || !formInitialized} tip={formInitialized ? getLoadingTip() : "加载数据中..."}>
        <Form
          form={form}
          layout="vertical"
          name="courseForm"
          preserve={false}
          initialValues={{ status: CourseStatus.PUBLISHED }}
          onValuesChange={(changedValues) => {
            if ('status' in changedValues) {
              console.log('状态值变更为:', changedValues.status);
            }
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
                  showSearch
                  optionFilterProp="children"
                  value={form.getFieldValue('typeId')}
                  defaultValue={undefined}
                  defaultActiveFirstOption={false}
                >
                  {cachedTypes.map(type => (
                    <Option key={type.id} value={type.id}>
                      {type.constantValue}
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
                <CustomRadioGroup disabled={loading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="coachIds"
                label="上课教练"
                rules={[{ required: true, message: '请选择上课教练', type: 'array' }]}
              >
                <Select
                  placeholder="请选择上课教练"
                  style={{ width: '100%' }}
                  popupMatchSelectWidth={true}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  loading={coachesLoading}
                  notFoundContent={coachesLoading ? <Spin size="small" /> : null}
                  maxTagCount="responsive"
                  allowClear
                  optionFilterProp="children"
                  mode="multiple"
                  showSearch
                  onChange={(values) => {
                    console.log('选中教练IDs:', values);
                    // 将选中的教练ID设置到表单中
                    form.setFieldsValue({ coachIds: values });
                  }}
                  disabled={loading}
                  value={form.getFieldValue('coachIds')}
                  tagRender={(props) => {
                    const { label, closable, onClose } = props;
                    return (
                      <span 
                        style={{ 
                          display: 'inline-block', 
                          marginRight: '4px', 
                          backgroundColor: '#f0f0f0',
                          padding: '0 4px',
                          borderRadius: '2px',
                          fontSize: '12px'
                        }}
                      >
                        {label}
                        {closable && (
                          <span onClick={onClose} style={{ marginLeft: '2px', cursor: 'pointer' }}>×</span>
                        )}
                      </span>
                    );
                  }}
                >
                  {cachedCoaches.map(coach => (
                    <Option key={coach.id} value={coach.id}>
                      {coach.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
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
            <Col span={6}>
              <Form.Item
                name="price"
                label="课程单价"
                rules={[{ required: true, message: '请输入课程单价' }]}
              >
                <InputNumber
                  min={0}
                  step={10}
                  style={{ width: '100%' }}
                  prefix={<DollarOutlined />}
                  placeholder="请输入课程单价"
                  disabled={loading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="coachFee"
                label="教练课时费"
                rules={[{ required: true, message: '请输入教练课时费' }]}
              >
                <InputNumber
                  min={0}
                  step={10}
                  style={{ width: '100%' }}
                  prefix={<DollarOutlined />}
                  placeholder="请输入教练课时费"
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