import React, { useEffect, useMemo, useRef } from 'react';
import { Modal, Form, Select, Typography, Row, Col, Tag, Input } from 'antd';
import { Student } from '@/pages/student/types/student';
import { SimpleCourse } from '@/api/course/types';
import './ShareModal.css';

interface ShareModalProps {
  visible: boolean;
  form: any;
  loading?: boolean;
  student: (Student & { selectedCourseId?: string; selectedCourseName?: string }) | null;
  courseList: SimpleCourse[];
  onCancel: () => void;
  onOk: () => void;
}

const { Text } = Typography;

// 课程类型标签样式（轻量版，与列表风格一致）
const getCourseTypeTagStyle = (typeName?: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    '大课': { bg: '#e6f7ff', color: '#1890ff', border: '#91d5ff' },
    '一对一': { bg: '#f0f5ff', color: '#2f54eb', border: '#adc6ff' },
    '试听课': { bg: '#fff2e8', color: '#fa8c16', border: '#ffd591' },
    '赠课': { bg: '#f9f0ff', color: '#722ed1', border: '#d3adf7' },
  };
  const c = (typeName && map[typeName]) || map['大课'];
  return {
    backgroundColor: c.bg,
    color: c.color,
    border: `1px solid ${c.border}`,
    borderRadius: 4,
    padding: '0 6px',
    height: 20,
    lineHeight: '18px',
    fontSize: 12,
  };
};

const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  form,
  loading = false,
  student,
  courseList,
  onCancel,
  onOk,
}) => {
  const selectWrapperRef = useRef<HTMLDivElement | null>(null);

  // 源课程ID与类型名称
  const sourceCourseId = useMemo(() => String((student as any)?.selectedCourseId ?? ''), [student]);
  const sourceTypeName = useMemo(() => {
    try {
      const sid = (student as any)?.selectedCourseId;
      const courses = (student as any)?.courses || [];
      const matched = courses.find((c: any) => String(c.courseId) === String(sid));
      return matched?.courseTypeName as string | undefined;
    } catch {
      return undefined;
    }
  }, [student]);

  // 仅展示同类型课程，并排除源课程本身；若无法判定类型则展示全部但同样排除源课程
  const filteredCourseList = useMemo(() => {
    const excludeSelf = (c: SimpleCourse) => String(c.id) !== sourceCourseId;
    if (!sourceTypeName) return courseList.filter(excludeSelf);
    return courseList.filter(c => c.typeName === sourceTypeName && excludeSelf(c));
  }, [courseList, sourceTypeName, sourceCourseId]);

  // 将弹层宽度与选择器对齐
  useEffect(() => {
    if (!visible) return;
    const wrapper = document.querySelector('.share-modal');
    const trigger = wrapper?.querySelector('.ant-select-selector') as HTMLElement | null;
    if (wrapper && trigger) {
      const width = trigger.getBoundingClientRect().width;
      (wrapper as HTMLElement).style.setProperty('--share-select-width', `${width}px`);
    }
  }, [visible]);

  // 选择课程时把教练名写入表单
  const handleCourseChange = (val: string) => {
    const target = filteredCourseList.find(c => String(c.id) === String(val));
    const coachNames = target?.coaches?.map(c => c.name).join('、')
      || (target as any)?.coachNames
      || (target as any)?.teacherNames
      || '';
    // 同步设置两个字段，并主动触发该字段的重新校验，清除红框
    form.setFieldsValue({ targetCourseId: val, coachNames });
    try { form.validateFields(['targetCourseId']); } catch {}
  };

  return (
    <Modal
      className="share-modal"
      open={visible}
      title={<span style={{ fontSize: 20, fontWeight: 600 }}>学员共享</span>}
      okText="确定共享"
      cancelText="取消"
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={loading}
      destroyOnHidden
      style={{ zIndex: 1000 }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="学员">
              <Text>{student?.name || '-'}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="源课程">
              <Text>{(student as any)?.selectedCourseName || '-'}</Text>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="targetCourseId"
              label="共享给的课程"
              rules={[{ required: true, message: '请选择共享目标课程' }]}> 
              <div ref={selectWrapperRef}>
                <Select
                  placeholder="请选择课程"
                  onChange={handleCourseChange}
                  getPopupContainer={(trigger) => trigger.parentElement || document.body}
                  placement="bottomLeft"
                >
                  {filteredCourseList.map(c => (
                    <Select.Option key={String(c.id)} value={String(c.id)}>
                      <span className="option-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span className="course-name" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                        <Tag className="course-type-tag" style={{ ...getCourseTypeTagStyle(c.typeName), marginLeft: 8 }}>{c.typeName}</Tag>
                      </span>
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="coachNames" label="教练">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ShareModal; 