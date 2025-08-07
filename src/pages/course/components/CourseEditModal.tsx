import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Spin, Button, message, Checkbox, Card, Tag } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { BookOutlined, DollarOutlined, SaveOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Course, CourseStatus } from '../types/course';

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
  // 多教师教学开关
  const [isMultiTeacher, setIsMultiTeacher] = useState(false);
  // 选中的教练列表
  const [selectedCoaches, setSelectedCoaches] = useState<CoachSimple[]>([]);

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

          // 判断是否为多教师教学
          const isMulti = coachIds.length > 1;
          setIsMultiTeacher(isMulti);

          // 设置选中的教练列表
          const selectedCoachList = cachedCoaches.filter(coach => coachIds.includes(coach.id));
          setSelectedCoaches(selectedCoachList);

          // 准备教练课时费数据
          const coachFees: Record<number, number> = {};
          selectedCoachList.forEach(coach => {
            // 使用教练的默认课时费
            coachFees[coach.id] = coach.classFee || 0;
          });
          console.log('编辑模式 - 教练课时费数据:', coachFees);

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
            coachFees: coachFees, // 添加教练课时费数据
            campusId: currentEditingCourse.campusId,
            description: currentEditingCourse.description || '',
            isMultiTeacher: isMulti
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
              coachFee: 100,
              coachIds: [],
              campusId: Number(localStorage.getItem('currentCampusId') || '1'),
              description: '',
              isMultiTeacher: false
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

  // 处理教练选择变化
  const handleCoachChange = async (value: number | number[] | undefined) => {
    // 处理清空的情况
    if (value === undefined || value === null) {
      setSelectedCoaches([]);
      setTimeout(() => {
        form.setFieldsValue({
          coachIds: [],
          coachFee: 0,
          coachFees: {}
        });
        console.log('清空教练选择 - 表单值设置完成');
      }, 0);
      return;
    }

    // 确保值始终是数组格式
    const values = Array.isArray(value) ? value : (value ? [value] : []);
    console.log('教练选择变化:', values);
    console.log('当前缓存的教练列表:', cachedCoaches);
    console.log('教练列表中的课时费信息:', cachedCoaches.map(c => ({ id: c.id, name: c.name, classFee: c.classFee })));

    const selectedCoachList = cachedCoaches.filter(coach => values.includes(coach.id));
    console.log('选中的教练列表:', selectedCoachList);

    // 立即更新状态
    setSelectedCoaches(selectedCoachList);

    if (isMultiTeacher) {
      // 多教师模式：直接从cachedCoaches获取课时费，计算平均值
      const classFees = selectedCoachList.map(coach => coach.classFee || 0);
      const averageFee = classFees.length > 0 ? classFees.reduce((sum, fee) => sum + fee, 0) / classFees.length : 0;
      const roundedAverageFee = Math.round(averageFee * 100) / 100;

      console.log('多教师模式 - 选中教练课时费:', classFees, '平均课时费:', roundedAverageFee);

      // 为多教师模式设置各个教练的课时费
      const coachFees: Record<number, number> = {};
      selectedCoachList.forEach(coach => {
        coachFees[coach.id] = coach.classFee || 0;
      });
      console.log('准备设置的coachFees:', coachFees);

      // 使用setTimeout确保状态更新后再设置表单值
      setTimeout(() => {
        form.setFieldsValue({
          coachIds: values,
          coachFee: roundedAverageFee,
          coachFees: coachFees
        });
        // 强制重新渲染表单
        form.validateFields().catch(() => {});
        console.log('多教师模式 - 表单值设置完成，当前coachFees:', form.getFieldValue('coachFees'));
        console.log('多教师模式 - 表单所有值:', form.getFieldsValue());
      }, 0);

    } else if (values.length === 1) {
      // 单教师模式：直接从cachedCoaches获取课时费
      const selectedCoach = selectedCoachList[0];
      const classFee = selectedCoach?.classFee || 0;

      console.log('单教师模式 - 选中教练:', selectedCoach?.name, '课时费:', classFee);

      const coachFeesObj = { [selectedCoach.id]: classFee };
      console.log('准备设置的coachFees:', coachFeesObj);

      // 使用setTimeout确保状态更新后再设置表单值
      setTimeout(() => {
        form.setFieldsValue({
          coachIds: values,
          coachFee: classFee,
          coachFees: coachFeesObj
        });
        // 强制重新渲染表单
        form.validateFields().catch(() => {});
        console.log('单教师模式 - 表单值设置完成，当前coachFees:', form.getFieldValue('coachFees'));
        console.log('单教师模式 - 表单所有值:', form.getFieldsValue());
      }, 0);
    } else if (values.length === 0) {
      // 清空选择时也要清空课时费
      setTimeout(() => {
        form.setFieldsValue({
          coachIds: values,
          coachFee: 0,
          coachFees: {}
        });
        console.log('清空模式 - 表单值设置完成');
      }, 0);
    }
  };

  // 处理多教师教学开关变化
  const handleMultiTeacherChange = async (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    setIsMultiTeacher(checked);
    form.setFieldValue('isMultiTeacher', checked);

    if (!checked) {
      // 切换到单教师模式，只保留第一个选中的教练
      const currentCoachIds = form.getFieldValue('coachIds') || [];
      console.log('切换到单教师模式 - 当前选中的教练ID:', currentCoachIds);

      if (currentCoachIds.length > 0) {
        const firstCoachId = currentCoachIds[0];

        // 更新选中的教练列表
        const firstCoach = cachedCoaches.find(coach => coach.id === firstCoachId);
        console.log('切换到单教师模式 - 找到的第一个教练:', firstCoach);

        if (firstCoach) {
          setSelectedCoaches([firstCoach]);

          // 直接从cachedCoaches获取课时费
          const classFee = firstCoach.classFee || 0;

          console.log('切换到单教师模式 - 选中教练:', firstCoach.name, '课时费:', classFee);

          // 使用setTimeout确保状态更新后再设置表单值
          setTimeout(() => {
            form.setFieldsValue({
              coachIds: [firstCoachId],
              coachFee: classFee,
              coachFees: { [firstCoach.id]: classFee } // 为单教师也设置coachFees，用于显示卡片
            });

            // 强制重新渲染表单
            form.validateFields().catch(() => {});
            console.log('切换到单教师模式 - 表单值设置完成，当前coachFee:', form.getFieldValue('coachFee'));
            console.log('切换到单教师模式 - 表单所有值:', form.getFieldsValue());
          }, 0);
        }
      } else {
        console.log('切换到单教师模式 - 但没有选中的教练');
      }
    } else {
      // 切换到多教师模式，处理已选中的教练
      const currentCoachIds = form.getFieldValue('coachIds') || [];
      console.log('切换到多教师模式 - 当前选中的教练ID:', currentCoachIds);
      console.log('切换到多教师模式 - 缓存的教练列表:', cachedCoaches);

      if (currentCoachIds.length > 0) {
        // 获取当前选中的教练列表
        const selectedCoachList = cachedCoaches.filter(coach => currentCoachIds.includes(coach.id));
        console.log('切换到多教师模式 - 找到的教练列表:', selectedCoachList);
        setSelectedCoaches(selectedCoachList);

        // 为多教师模式设置各个教练的课时费
        const coachFees: Record<number, number> = {};
        selectedCoachList.forEach(coach => {
          coachFees[coach.id] = coach.classFee || 0;
        });

        // 计算平均课时费
        const classFees = selectedCoachList.map(coach => coach.classFee || 0);
        const averageFee = classFees.length > 0 ? classFees.reduce((sum, fee) => sum + fee, 0) / classFees.length : 0;
        const roundedAverageFee = Math.round(averageFee * 100) / 100;

        console.log('切换到多教师模式 - 选中教练课时费:', classFees, '平均课时费:', roundedAverageFee);
        console.log('切换到多教师模式 - 准备设置的coachFees:', coachFees);

        // 使用setTimeout确保状态更新后再设置表单值
        setTimeout(() => {
          form.setFieldsValue({
            coachFee: roundedAverageFee,
            coachFees: coachFees
          });

          // 强制重新渲染表单
          form.validateFields().catch(() => {});
          console.log('切换到多教师模式 - 表单值设置完成，当前coachFees:', form.getFieldValue('coachFees'));
          console.log('切换到多教师模式 - 表单所有值:', form.getFieldsValue());
        }, 0);
      } else {
        console.log('切换到多教师模式 - 但没有选中的教练');
      }
    }

    setTimeout(() => form.validateFields(['coachIds']), 0);
  };

  const handleCoachFeeChange = (coachId: number, value: any) => {
    // 更新具体某个教练的费用
    const newCoachFees = {
      ...form.getFieldValue('coachFees'),
      [coachId]: value
    };
    form.setFieldValue('coachFees', newCoachFees);

    // 重新计算平均值
    const fees = Object.values(newCoachFees).filter(fee => typeof fee === 'number') as number[];
    if (fees.length > 0) {
      const totalFee = fees.reduce((sum, fee) => sum + fee, 0);
      const averageFee = totalFee / fees.length;
      const roundedAverageFee = parseFloat(averageFee.toFixed(2));

      // 同时更新教练课时费和课程单价
      form.setFieldsValue({
        coachFee: roundedAverageFee,
        price: roundedAverageFee
      });
    } else {
      form.setFieldsValue({
        coachFee: 0,
        price: 0
      });
    }
  };

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
      width={900}
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
            <Col span={8}>
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
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                label="每次消耗课时"
                name="consume"
                rules={[{ required: true, message: '请输入每次消耗课时' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入每次消耗课时" disabled={loading} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={isMultiTeacher ? 16 : 8}>
              <Form.Item
                name="coachIds"
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>上课教练</span>
                    <Checkbox
                      checked={isMultiTeacher}
                      onChange={handleMultiTeacherChange}
                      disabled={loading}
                      style={{ fontSize: '12px', fontWeight: 'normal' }}
                    >
                      多教师教学
                    </Checkbox>
                  </div>
                }
                rules={[{ required: true, message: '请选择上课教练', type: 'array', min: 1 }]}
              >
                <Select
                  mode={isMultiTeacher ? 'multiple' : undefined}
                  placeholder="请选择上课教练"
                  options={cachedCoaches.map(coach => ({
                    label: coach.name,
                    value: coach.id,
                  }))}
                  disabled={loading}
                  onChange={handleCoachChange}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  value={isMultiTeacher ? form.getFieldValue('coachIds') : (form.getFieldValue('coachIds')?.[0] || undefined)}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  popupMatchSelectWidth={true}
                />
              </Form.Item>
            </Col>
            {!isMultiTeacher && (
              <Col span={8}>
                <Form.Item
                  label="教练课时费"
                  name="coachFee"
                  rules={[{ required: true, message: '请输入教练课时费' }]}
                >
                  <InputNumber
                    prefix={<DollarOutlined />}
                    style={{ width: '100%' }}
                    placeholder="请输入教练课时费"
                    disabled={loading}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={8}>
              <Form.Item
                label="课程单价"
                name="price"
                rules={[{ required: true, message: '请输入课程单价' }]}
              >
                <InputNumber
                  prefix={<DollarOutlined />}
                  style={{ width: '100%' }}
                  placeholder="请输入课程单价"
                  disabled={loading}
                />
              </Form.Item>
            </Col>
          </Row>

          {isMultiTeacher && selectedCoaches.length > 0 && (
                          <Card
                size="small"
                title={
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>
                      各个教练课时费
                    </span>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 400 }}>
                      平均课时费: ¥{form.getFieldValue('coachFee') || 0}
                    </span>
                  </div>
                }
                className="coach-fee-card"
              >
              <Row gutter={[16, 16]}>
                {selectedCoaches.map((coach) => (
                  <Col span={8} key={coach.id}>
                    <Form.Item
                      label={`${coach.name}`}
                      name={['coachFees', coach.id]}
                      rules={[{ required: true, message: `请输入${coach.name}的课时费` }]}
                    >
                      <InputNumber
                        prefix={<DollarOutlined />}
                        style={{ width: '100%' }}
                        placeholder="请输入课时费"
                        onChange={(value) => handleCoachFeeChange(coach.id, value)}
                        disabled={loading}
                      />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          <Row gutter={16} style={{ marginTop: '16px' }}>
            <Col span={16}>
              <Form.Item
                name="description"
                label="课程描述"
                rules={[{ max: 200, message: '课程描述不能超过200个字符' }]}
              >
                <Input
                  placeholder="请输入课程描述(选填)"
                  disabled={loading}
                  maxLength={200}
                  showCount
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="课程状态"
                rules={[{ required: true, message: '请选择课程状态' }]}
              >
                <CustomRadioGroup disabled={loading} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CourseEditModal;