import { useState } from 'react';
import { Form, message } from 'antd';
import { Campus } from '../types/campus';
import { campus as campusAPI } from '@/api/campus';

type AddFunction = (values: Partial<Campus>) => Promise<Campus>;
type UpdateFunction = (id: string, values: Partial<Campus>) => Promise<void>;

export const useCampusForm = (
  addCampus: AddFunction,
  updateCampus: UpdateFunction
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);

  // 显示添加校区模态框
  const handleAdd = () => {
    form.resetFields();
    setEditingCampus(null);
    setVisible(true);
  };

  // 显示编辑校区模态框
  const handleEdit = (record: Campus) => {
    // 先设置初始编辑状态
    setEditingCampus(record);

    // 打印记录中的状态值，用于调试
    console.log('编辑校区时的原始状态值:', record.status);

    // 先用记录中的数据填充表单，以便立即显示
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      status: record.status, // 确保使用记录中的状态值
      monthlyRent: record.monthlyRent || 0,
      propertyFee: record.propertyFee || 0,
      utilityFee: record.utilityFee || 0,
      contactPerson: record.contactPerson || '',
      phone: record.phone || ''
    });

    // 再次确认状态值已正确设置
    setTimeout(() => {
      const currentStatus = form.getFieldValue('status');
      console.log('表单设置后的状态值:', currentStatus);
    }, 0);

    // 立即显示模态框
    setVisible(true);

    // 设置加载状态
    setLoading(true);

    // 异步调用接口获取校区详情
    campusAPI.getDetail(String(record.id))
      .then(detailData => {
        console.log('获取校区详情成功:', detailData);

        // 处理管理员信息
        let managerName = '';
        let managerPhone = '';

        // 如果有 manager 对象
        if (detailData.manager) {
          managerName = detailData.manager.name || '';
          managerPhone = detailData.manager.phone || '';
        }
        // 如果有 managerName 和 managerPhone 字段
        else if (detailData.managerName || detailData.managerPhone) {
          managerName = detailData.managerName || '';
          managerPhone = detailData.managerPhone || '';
        }

        console.log('管理员信息:', { managerName, managerPhone });

        // 处理水电费字段名称不一致的问题
        let utilityFeeValue = 0;
        if (detailData.utilityFee !== undefined) {
          utilityFeeValue = detailData.utilityFee;
        } else if ((detailData as any).utilitiesFee !== undefined) {
          // 如果后端返回的是 utilitiesFee 而不是 utilityFee
          utilityFeeValue = (detailData as any).utilitiesFee;
        }

        // 打印详情中的状态值，用于调试
        console.log('校区详情中的状态值:', detailData.status);

        // 设置表单字段值
        const formValues = {
          name: detailData.name,
          address: detailData.address,
          status: detailData.status, // 确保使用详情中的状态值
          monthlyRent: detailData.monthlyRent || 0,
          propertyFee: detailData.propertyFee || 0,
          utilityFee: utilityFeeValue,
          contactPerson: managerName, // 使用管理员名称作为联系人
          phone: managerPhone // 使用管理员电话作为联系电话
        };

        console.log('设置表单字段值:', formValues);
        form.setFieldsValue(formValues);

        // 再次确认状态值已正确设置
        setTimeout(() => {
          const currentStatus = form.getFieldValue('status');
          console.log('详情加载后的状态值:', currentStatus);
        }, 0);
      })
      .catch(error => {
        console.error('获取校区详情失败:', error);
        message.error('获取校区详情失败');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (editingCampus) {
        // 编辑现有校区
        try {
          // 提取表单字段值
          const { contactPerson, phone, utilityFee, ...otherValues } = values;

          // 准备校区更新数据，不包含 contactPerson 和 phone
          const updateData = {
            ...otherValues,
            utilityFee, // 保存固定水电费字段
            utilitiesFee: utilityFee, // 同时保存 utilitiesFee 字段，以兼容后端
          };

          // 尝试更新校区
          await updateCampus(String(editingCampus.id), updateData);
          message.success('校区信息已更新');

          // 只有在更新成功时才重置表单并关闭模态框
          form.resetFields();
          setVisible(false);
        } catch (updateError) {
          // 更新失败时，不关闭模态框，允许用户修改输入
          console.error('更新校区失败:', updateError);
          message.error('更新校区失败，请检查输入并重试');
        }
      } else {
        // 添加新校区
        try {
          // 提取表单字段值
          const { contactPerson, phone, utilityFee, ...otherValues } = values;

          // 打印表单中的状态值，用于调试
          console.log('表单提交时的状态值:', otherValues.status);

          // 确保状态值正确
          const status = otherValues.status || 'OPERATING';
          console.log('最终使用的状态值:', status);

          // 准备校区创建数据，不包含 contactPerson、phone、area 和 facilities
          const createData = {
            ...otherValues,
            status, // 确保状态值正确
            utilityFee, // 保存固定水电费字段
            utilitiesFee: utilityFee, // 同时保存 utilitiesFee 字段，以兼容后端
          };

          await addCampus(createData);
          message.success('校区添加成功');

          // 只有在添加成功时才重置表单并关闭模态框
          form.resetFields();
          setVisible(false);
        } catch (addError) {
          // 添加失败时，不关闭模态框，允许用户修改输入
          console.error('添加校区失败:', addError);
          message.error('添加校区失败，请检查输入并重试');
        }
      }
    } catch (error: any) {
      // 表单验证错误
      if (error.errorFields) {
        message.error('请正确填写所有必填字段');
      } else {
        message.error('操作失败，请稍后重试');
        console.error('Form submit failed:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // 取消表单
  const handleCancel = () => {
    // 如果正在加载中，不允许关闭模态框
    if (loading) {
      return;
    }
    form.resetFields();
    setVisible(false);
  };

  return {
    form,
    visible,
    loading,
    editingCampus,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel
  };
};