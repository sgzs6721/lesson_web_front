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

  // 表单是否已初始化
  const [formInitialized, setFormInitialized] = useState(false);

  // 当模态框打开时加载数据并初始化表单
  useEffect(() => {
    // 只在模态框可见时执行
    if (!visible) return;

    // 设置加载状态
    setFormInitialized(false);

    // 保存当前的编辑课程和类型列表，避免循环引用
    const currentEditingCourse = editingCourse;
    const currentCachedTypes = cachedTypes;

    // 定义异步函数来加载数据
    const loadData = async () => {
      try {
        // 1. 加载教练列表
        setLoadingCoaches(true);
        const campusId = currentEditingCourse?.campusId || localStorage.getItem('currentCampusId') || '1';
        const coachList = await coachAPI.getSimpleList(campusId);
        console.log('获取到教练列表:', coachList);
        setCoaches(coachList);

        // 2. 准备表单数据
        if (currentEditingCourse) {
          // 编辑模式
          console.log('编辑课程数据:', JSON.stringify(currentEditingCourse, null, 2));

          // 从 coaches 数组提取教练 ID (确保在获取教练列表后再提取ID)
          const coachIds = currentEditingCourse.coaches?.map(coach => coach.id) || [];
          console.log('解析后的教练ID列表:', coachIds);

          // 查找匹配的课程类型 ID
          let typeId = null;
          if (currentCachedTypes.length > 0) {
            // 在缓存的课程类型中查找匹配的类型
            const matchedType = currentCachedTypes.find(type =>
              type.constantValue === currentEditingCourse.type
            );

            if (matchedType) {
              typeId = matchedType.id;
              console.log('找到匹配的课程类型:', matchedType.constantValue, '对应ID:', typeId);
            } else {
              console.log('未找到匹配的课程类型:', currentEditingCourse.type);
              // 如果没有找到匹配的类型，则使用第一个类型
              if (currentCachedTypes.length > 0) {
                typeId = currentCachedTypes[0].id;
              }
            }
          }

          // 准备表单数据
          const formValues = {
            name: currentEditingCourse.name,
            typeId: typeId, // 使用找到的类型 ID
            status: currentEditingCourse.status,
            unitHours: currentEditingCourse.unitHours,
            totalHours: currentEditingCourse.totalHours,
            price: currentEditingCourse.price,
            coachIds: coachIds,
            campusId: currentEditingCourse.campusId,
            description: currentEditingCourse.description || ''
          };

          console.log('设置表单初始值:', JSON.stringify(formValues, null, 2));
          console.log('coachIds值:', formValues.coachIds);
          console.log('typeId值:', formValues.typeId);

          // 设置表单值 (在获取教练列表后设置表单值)
          form.setFieldsValue(formValues);
          
          // 立即刷新表单以确保设置的值生效
          setTimeout(() => {
            // 获取并输出当前表单值，以确认设置是否成功
            const currentValues = form.getFieldsValue();
            console.log('设置后的表单实际值:', JSON.stringify(currentValues, null, 2));
            console.log('表单中的coachIds实际值:', currentValues.coachIds);
            console.log('表单中的typeId实际值:', currentValues.typeId);
            // 教练列表和表单值都设置完成后，再将初始化状态设为完成
            setFormInitialized(true);
          }, 100);

        } else {
          // 添加模式
          if (currentCachedTypes.length > 0) {
            form.setFieldsValue({
              typeId: currentCachedTypes[0].id,
              status: CourseStatus.PUBLISHED,
              unitHours: 1,
              totalHours: 10,
              price: 100,
              coachIds: [],
              campusId: Number(localStorage.getItem('currentCampusId') || '1'),
              description: ''
            });
            // 添加模式下直接设置初始化完成
            setFormInitialized(true);
          }
        }

        // 不再需要额外的确认过程，已在上面设置初始化状态
      } catch (error) {
        console.error('加载数据出错:', error);
        message.error('加载课程数据失败');
        setFormInitialized(true); // 即使出错也要设置为已初始化，避免一直显示加载中
      } finally {
        setLoadingCoaches(false);
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
      title={editingCourse ? '编辑课程' : '添加课程'}
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
          initialValues={editingCourse ? {
            name: editingCourse.name,
            status: editingCourse.status,
            unitHours: editingCourse.unitHours,
            totalHours: editingCourse.totalHours,
            price: editingCourse.price,
            description: editingCourse.description || '',
            coachIds: editingCourse?.coaches?.map(coach => coach.id) || [],
            campusId: editingCourse.campusId
          } : undefined}
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
                    showSearch
                    optionFilterProp="children"
                    value={form.getFieldValue('typeId')}
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
                    showSearch
                    onChange={(values) => {
                      console.log('选中教练IDs:', values);
                      // 将选中的教练ID设置到表单中
                      form.setFieldsValue({ coachIds: values });
                    }}
                    disabled={loading}
                    value={form.getFieldValue('coachIds')}
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