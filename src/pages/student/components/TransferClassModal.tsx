import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  DatePicker,
  Divider,
  Spin
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Student, CourseSummary } from '../types/student';
import { SimpleCourse } from '@/api/course/types';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface TransferClassModalProps {
  visible: boolean;
  form: FormInstance;
  student: Student | null;
  studentCourses: CourseSummary[];
  selectedCourseId?: string;
  selectedCourseName?: string;
  onCancel: () => void;
  onOk: () => void;
  setLoading: (loading: boolean) => void;
  courseList?: SimpleCourse[];
  loading?: boolean;
}

const TransferClassModal: React.FC<TransferClassModalProps> = ({
  visible,
  form,
  student,
  studentCourses,
  selectedCourseId,
  selectedCourseName,
  onCancel,
  onOk,
  setLoading,
  courseList,
  loading
}) => {
  // 添加状态跟踪最大可转课时
  const [maxTransferHours, setMaxTransferHours] = React.useState(0);
  // 在表单字段值变化时触发回调
  const [formInitialized, setFormInitialized] = React.useState(false);
  // 添加有效期类型选项状态
  const [validityPeriodOptions, setValidityPeriodOptions] = useState<Constant[]>([]);
  // 添加加载有效期类型的状态
  const [loadingValidityPeriod, setLoadingValidityPeriod] = useState(false);
  // 添加可选目标课程状态
  const [availableCourses, setAvailableCourses] = useState<SimpleCourse[]>([]);

  React.useEffect(() => {
    if (visible) {
      // 在模态框打开后，设置表单初始化标志
      setFormInitialized(true);
      // 加载有效期类型选项
      fetchValidityPeriodOptions();
    } else {
      setFormInitialized(false);
    }
  }, [visible]);

  // 获取有效期类型选项
  const fetchValidityPeriodOptions = async () => {
    try {
      setLoadingValidityPeriod(true);
      const data = await API.constants.getListByType('VALIDITY_PERIOD');
      setValidityPeriodOptions(data);
    } catch (error) {
      console.error('获取有效期类型选项失败:', error);
    } finally {
      setLoadingValidityPeriod(false);
    }
  };

  // 监听refundClassHours字段变化，自动设置transferClassHours
  React.useEffect(() => {
    if (formInitialized) {
      const refundHours = form.getFieldValue('refundClassHours');
      console.log('检测到表单初始化完成，当前剩余课时为:', refundHours);
      if (refundHours && refundHours > 0) {
        // 更新最大可转课时状态
        setMaxTransferHours(refundHours);
        // 确保转班课时设置为剩余课时
        console.log('设置转班课时为:', refundHours);

        // 强制设置转班课时为剩余课时
        form.setFieldsValue({
          transferClassHours: refundHours
        });

        // 二次确认设置成功
        setTimeout(() => {
          const currentTransferHours = form.getFieldValue('transferClassHours');
          console.log('设置后的转班课时:', currentTransferHours);

          // 如果设置不成功，再次尝试设置
          if (currentTransferHours !== refundHours) {
            console.log('转班课时设置不成功，再次尝试设置');
            form.setFieldsValue({
              transferClassHours: refundHours
            });
          }
        }, 100);
      }
    }
  }, [formInitialized, form]);

  // 监听maxTransferHours变化，自动更新转班课时
  React.useEffect(() => {
    if (maxTransferHours > 0 && formInitialized) {
      console.log('检测到最大可转课时变化，更新转班课时为:', maxTransferHours);
      form.setFieldsValue({
        transferClassHours: maxTransferHours
      });
    }
  }, [maxTransferHours, formInitialized, form]);

  // 监听student和studentCourses变化，更新最大可转课时
  React.useEffect(() => {
    if (visible && student && studentCourses.length > 0) {
      let remainingHours = 0;
      const defaultCourse = studentCourses[0];

      // 尝试从学生课程中获取剩余课时
      if (student.courses && student.courses.length > 0) {
        const coursesInfo = student.courses.find(c => String(c.courseId) === String(defaultCourse.id));
        if (coursesInfo && coursesInfo.remainingHours !== undefined) {
          remainingHours = coursesInfo.remainingHours;
          console.log('从课程信息中获取最大可转课时:', remainingHours);
        }
      }

      // 从课程概要中获取
      if (remainingHours === 0 && defaultCourse.remainingClasses) {
        const parts = defaultCourse.remainingClasses.split('/');
        if (parts.length > 0 && !isNaN(Number(parts[0]))) {
          remainingHours = Number(parts[0]);
          console.log('从课程概要中获取最大可转课时:', remainingHours);
        }
      }

      // 从学生对象获取
      if (remainingHours === 0 && student.remainingClasses) {
        const parts = student.remainingClasses.split('/');
        if (parts.length > 0 && !isNaN(Number(parts[0]))) {
          remainingHours = Number(parts[0]);
          console.log('从学生对象中获取最大可转课时:', remainingHours);
        }
      }

      if (remainingHours > 0) {
        console.log('设置最大可转课时为:', remainingHours);
        setMaxTransferHours(remainingHours);

        // 直接更新表单中的转班课时值
        form.setFieldsValue({
          transferClassHours: remainingHours
        });
      }
    }
  }, [visible, student, studentCourses, form]);

  // 当模态框可见且学生信息存在时，确保表单中的学生姓名和ID被正确设置
  React.useEffect(() => {
    if (visible && student) {
      console.log('TransferClassModal初始化 - 学生:', student.name, 'selectedCourseId:', selectedCourseId, '类型:', typeof selectedCourseId);
      console.log('selectedCourseName:', selectedCourseName);
      console.log('当前学生所有课程:', JSON.stringify(studentCourses, null, 2));
      
      // 获取课程信息
      if (studentCourses && studentCourses.length > 0) {
        // 根据selectedCourseId找到对应的课程，如果没有则使用第一个课程
        const defaultCourse = selectedCourseId 
          ? studentCourses.find(course => {
              const courseIdMatches = String(course.id) === String(selectedCourseId);
              console.log(`匹配课程ID: ${course.id}(${typeof course.id}) vs ${selectedCourseId}(${typeof selectedCourseId}) = ${courseIdMatches}`);
              console.log(`课程名称: ${course.name}`);
              return courseIdMatches;
            })
          : undefined;
      
        // 如果没有找到匹配的课程，使用第一个可用课程
        const selectedCourse = defaultCourse || studentCourses[0];
        
        console.log('最终选择的课程:', selectedCourse ? JSON.stringify(selectedCourse, null, 2) : '无可用课程');
        
        if (!selectedCourse) {
          console.error('无法找到有效的课程进行转班操作!');
          return;
        }

        // 获取剩余课时
        let remainingHours = 0;
        if (student.courses && student.courses.length > 0) {
          const coursesInfo = student.courses.find(c => String(c.courseId) === String(selectedCourse.id));
          if (coursesInfo && coursesInfo.remainingHours !== undefined) {
            remainingHours = coursesInfo.remainingHours;
          }
        }

        // 如果没有找到精确课时，从课程概要中获取
        if (remainingHours === 0 && selectedCourse.remainingClasses) {
          const parts = selectedCourse.remainingClasses.split('/');
          if (parts.length > 0 && !isNaN(Number(parts[0]))) {
            remainingHours = Number(parts[0]);
          }
        }

        // 如果仍未找到，尝试从学生对象直接获取
        if (remainingHours === 0 && student.remainingClasses) {
          const parts = student.remainingClasses.split('/');
          if (parts.length > 0 && !isNaN(Number(parts[0]))) {
            remainingHours = Number(parts[0]);
          }
        }

        // 获取有效期信息
        let expireDate = null;

        // 尝试从selectedCourse获取有效期
        if (selectedCourse.expireDate) {
          console.log('从selectedCourse获取有效期:', selectedCourse.expireDate);
          try {
            expireDate = selectedCourse.expireDate ? dayjs(selectedCourse.expireDate) : null;
            if (expireDate && !expireDate.isValid()) {
              console.log('无效的日期格式:', selectedCourse.expireDate);
              expireDate = null;
            }
          } catch (error) {
            console.error('解析selectedCourse.expireDate失败:', error);
          }
        }

        // 尝试从student.courses获取有效期
        if (!expireDate && student.courses && student.courses.length > 0) {
          const coursesInfo = student.courses.find(c => String(c.courseId) === String(selectedCourse.id));
          if (coursesInfo && coursesInfo.endDate) {
            console.log('从coursesInfo.endDate获取有效期:', coursesInfo.endDate);
            try {
              expireDate = coursesInfo.endDate ? dayjs(coursesInfo.endDate) : null;
              if (expireDate && !expireDate.isValid()) {
                console.log('无效的日期格式:', coursesInfo.endDate);
                expireDate = null;
              }
            } catch (error) {
              console.error('解析coursesInfo.endDate失败:', error);
            }
          }
        }

        // 如果仍未找到，尝试从student对象直接获取
        if (!expireDate && student.expireDate) {
          console.log('从student.expireDate获取有效期:', student.expireDate);
          try {
            expireDate = student.expireDate ? dayjs(student.expireDate) : null;
            if (expireDate && !expireDate.isValid()) {
              console.log('无效的日期格式:', student.expireDate);
              expireDate = null;
            }
          } catch (error) {
            console.error('解析student.expireDate失败:', error);
          }
        }

        // 设置表单值
        const values: Record<string, any> = {
          studentName: student.name,
          studentId: student.id,
          // 优先使用selectedCourseName，其次使用课程实际名称
          fromCourseId: selectedCourseName || selectedCourse.name,
          _courseId: selectedCourse.id,
          refundClassHours: remainingHours,
          operationType: 'transferClass',
          // 确保转班课时默认为剩余课时
          transferClassHours: remainingHours > 0 ? remainingHours : 1
        };

        // 如果有有效期选项，设置默认值
        if (validityPeriodOptions.length > 0) {
          // 默认选择第一个有效期选项
          values.validityPeriodId = validityPeriodOptions[0].id;
        }

        // 如果有有效的过期日期，设置validUntil字段
        if (expireDate && expireDate.isValid()) {
          //values.validUntil = expireDate;
          // 不再设置validUntil，由用户从下拉框中选择
        }

        console.log('设置转班表单值:', values);
        form.setFieldsValue(values);
        setFormInitialized(true);
      } else {
        form.setFieldsValue({
          studentName: student.name,
          studentId: student.id,
          operationType: 'transferClass'
        });
      }
    }
  }, [visible, student, studentCourses, form, validityPeriodOptions]);

  // 过滤转入课程列表，排除当前课程和共享的课程
  const filteredCourseList = useMemo(() => {
    if (!student || !student.courses || !courseList) {
      return courseList || [];
    }

    // 获取当前选中的课程ID
    const currentCourseId = selectedCourseId;
    
    // 获取学员已有的课程ID列表
    const existingCourseIds = student.courses.map(course => String(course.courseId));
    
    // 获取学员已共享的课程ID列表
    const getSharedCourseIds = () => {
      const sharedIds: string[] = [];
      student.courses?.forEach(course => {
        if (course.sharingInfoList && course.sharingInfoList.length > 0) {
          course.sharingInfoList.forEach(sharing => {
            sharedIds.push(String(sharing.targetCourseId));
          });
        }
      });
      return sharedIds;
    };
    
    const sharedCourseIds = getSharedCourseIds();
    
    // 过滤掉当前课程、已有的课程和共享的课程
    return courseList.filter(course => {
      const courseId = String(course.id);
      return courseId !== currentCourseId && 
             !existingCourseIds.includes(courseId) && 
             !sharedCourseIds.includes(courseId);
    });
  }, [courseList, student, selectedCourseId]);

  // 当表单初始化后，更新可选目标课程列表
  React.useEffect(() => {
    if (visible && filteredCourseList && formInitialized) {
      // 使用过滤后的课程列表
      setAvailableCourses(filteredCourseList);
    }
  }, [visible, filteredCourseList, formInitialized]);

  return (
    <Modal
      title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>转班</span>}
      open={visible}
      onOk={() => {
        console.log('确认提交按钮点击');
        // 在调用onOk之前，显式设置loading为true
        setLoading(true);

        // 获取当前转班课时
        const transferHours = form.getFieldValue('transferClassHours');
        console.log('当前转班课时:', transferHours, '最大可转课时:', maxTransferHours);

        // 确保转班课时不超过最大可转课时
        if (transferHours > maxTransferHours) {
          console.log('转班课时超过最大可转课时，自动调整为最大可转课时');
          form.setFieldsValue({
            transferClassHours: maxTransferHours,
            operationType: 'transferClass'
          });
        } else {
          // 在调用onOk之前，确保operationType字段被正确设置
          form.setFieldsValue({ operationType: 'transferClass' });
        }

        try {
          // 调用提交方法
          onOk();
        } catch (error) {
          // 如果提交过程中出错，重置按钮状态
          console.error('提交过程中出错:', error);
        }
      }}
      onCancel={onCancel}
      width={800}
      okText="确认提交"
      cancelText="取消"
      confirmLoading={!!loading}
      okButtonProps={{
        style: {},
        className: 'no-hover-button'
      }}
    >
      <Spin spinning={!!loading}>
        <Form
          form={form}
          layout="vertical"
        >
          {/* 隐藏字段 - 操作类型 */}
          <Form.Item name="operationType" hidden>
            <Input type="hidden" />
          </Form.Item>

          {/* 隐藏字段保存原课程ID */}
          <Form.Item name="_courseId" hidden>
            <Input type="hidden" />
          </Form.Item>

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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fromCourseId"
                label="原课程"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="refundClassHours"
                label="剩余课时"
              >
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {/* 共享课程信息 */}
          {student && student.courses && student.courses.length > 0 && (() => {
            const currentCourseId = form.getFieldValue('_courseId');
            const currentCourse = student.courses.find(c => String(c.courseId) === String(currentCourseId));
            if (currentCourse && currentCourse.sharingInfoList && currentCourse.sharingInfoList.length > 0) {
              return (
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '12px', 
                  backgroundColor: '#f0f9ff', 
                  borderRadius: '4px',
                  border: '1px solid #91d5ff'
                }}>
                  <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)' }}>
                    <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>共享课程：</span>
                    <span style={{ fontWeight: '500', marginRight: '16px' }}>
                      {currentCourse.sharingInfoList[0].targetCourseName || '-'}
                    </span>
                    <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>教练：</span>
                    <span style={{ fontWeight: '500' }}>
                      {currentCourse.sharingInfoList[0].coachName || '-'}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="toCourseId"
                label="转入课程"
                rules={[{ required: true, message: '请选择转班目标课程' }]}
              >
                <Select
                  showSearch
                  placeholder="请选择转班目标课程"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: '100%' }}
                  dropdownStyle={{ zIndex: 1060 }}
                  getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                  listHeight={300}
                >
                  {availableCourses.map(course => (
                    <Option key={course.id} value={course.id}>
                      {course.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="transferClassHours"
                label={<span>转班课时 <span style={{ color: '#999', fontSize: '12px' }}>(剩余课时: {maxTransferHours})</span></span>}
                rules={[
                  { required: true, message: '请输入转班课时' },
                  {
                    validator: (_, value) => {
                      if (value > maxTransferHours) {
                        return Promise.reject(`转班课时不能超过剩余课时 ${maxTransferHours}`);
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <div className="input-with-unit-wrapper">
                  <InputNumber
                    min={1}
                    max={maxTransferHours}
                    style={{ width: '100%' }}
                    disabled={maxTransferHours <= 0}
                    className="select-with-unit"
                  />
                  <div className="input-unit">课时</div>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="validityPeriodId"
                label="有效期时长"
                rules={[{ required: true, message: '请选择有效期时长' }]}
              >
                <div className="input-with-unit-wrapper">
                  <Select
                    placeholder="请选择有效期时长"
                    loading={loadingValidityPeriod}
                    style={{ width: '100%' }}
                    dropdownStyle={{ zIndex: 1060 }}
                    getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                    listHeight={300}
                    suffixIcon={<div style={{ width: '30px' }}></div>}
                    className="select-with-unit"
                  >
                    {validityPeriodOptions.map(option => (
                      <Option key={option.id} value={option.id}>
                        {option.constantValue}
                      </Option>
                    ))}
                  </Select>
                  <div className="input-unit">月</div>
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priceDifference"
                label="补差价"
                initialValue={0}
                tooltip="正数表示学员需要补差价，负数表示需要退还差价"
              >
                <div className="input-with-unit-wrapper">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入补差价金额"
                    precision={2}
                    className="select-with-unit"
                  />
                  <div className="input-unit">元</div>
                </div>
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
        </Form>
      </Spin>
    </Modal>
  );
};

export default TransferClassModal;