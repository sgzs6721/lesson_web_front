import { useState } from 'react';
import { Form } from 'antd';
import { Coach } from '../types/coach';
import dayjs from 'dayjs';

export const useCoachForm = (
  addCoach: (values: Omit<Coach, 'id'>) => Coach,
  updateCoach: (id: string, values: Partial<Coach>) => void
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  // 显示添加教练模态框
  const handleAdd = () => {
    form.resetFields();
    setSelectedAvatar('');
    setEditingCoach(null);
    setVisible(true);
  };
  
  // 显示编辑教练模态框
  const handleEdit = (record: Coach) => {
    // 将逗号分隔的证书转换为多行文本
    const formValues = {
      ...record,
      hireDate: dayjs(record.hireDate),
    };
    
    if (record.certifications) {
      formValues.certifications = record.certifications.split('，').join('\n');
    }
    
    setEditingCoach(record);
    form.setFieldsValue(formValues);
    
    if (record.avatar) {
      setSelectedAvatar(record.avatar);
    }
    
    setVisible(true);
  };

  // 处理模态框确认
  const handleSubmit = () => {
    setLoading(true);
    form.validateFields()
      .then(values => {
        let formattedValues = { ...values };
        
        // 处理日期
        if (values.hireDate) {
          formattedValues.hireDate = values.hireDate.format('YYYY-MM-DD');
        }
        
        // 处理头像
        if (selectedAvatar) {
          formattedValues.avatar = selectedAvatar;
        }
        
        // 处理证书文本，将多行转为逗号分隔的格式存储
        if (values.certifications) {
          formattedValues.certifications = values.certifications
            .split('\n')
            .filter((cert: string) => cert.trim() !== '')
            .join('，');
        }

        if (editingCoach) {
          // 编辑现有教练
          updateCoach(editingCoach.id, formattedValues);
        } else {
          // 添加新教练
          addCoach(formattedValues);
        }

        handleCancel();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 处理模态框取消
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setEditingCoach(null);
    setSelectedAvatar('');
  };

  // 处理头像选择
  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  // 处理性别变化，选择默认头像
  const handleGenderChange = (value: any) => {
    const gender = value.target ? value.target.value : value;
    // 可以在这里添加性别变化时的默认头像逻辑
  };

  return {
    form,
    visible,
    editingCoach,
    selectedAvatar,
    loading,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel,
    handleAvatarSelect,
    handleGenderChange
  };
}; 