import { useState } from 'react';
import { Form } from 'antd';
import { Coach } from '../types/coach';
import dayjs from 'dayjs';
import { API } from '@/api';
import { message } from 'antd';
import { convertApiCoachToCoach, coachDetailCache } from './useCoachDetail';
import { avatarOptions } from '../constants/avatarOptions';

export const useCoachForm = (
  addCoach: (values: Omit<Coach, 'id'>) => Promise<Coach>,
  updateCoach: (id: string, values: Partial<Coach>) => Promise<void>,
  onSuccess?: () => void
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // 获取教练详情
  const fetchCoachDetail = async (id: string | number) => {
    setDetailLoading(true);
    try {
      // 检查缓存中是否已有此教练数据
      const stringId = String(id);
      if (coachDetailCache[stringId]) {
        console.log('编辑表单：使用缓存的教练详情数据:', stringId);
        return coachDetailCache[stringId];
      }

      // 如果缓存中没有，则调用API获取
      const apiCoachDetail = await API.coach.getDetail(id);
      if (apiCoachDetail) {
        // 转换为页面使用的Coach类型
        const coach = convertApiCoachToCoach(apiCoachDetail);
        // 存入缓存
        coachDetailCache[stringId] = coach;
        return coach;
      }
      return null;
    } catch (error) {
      message.error('获取教练详情失败');
      console.error('获取教练详情失败:', error);
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  // 显示添加教练模态框
  const handleAdd = () => {
    form.resetFields();
    // 设置默认值
    form.setFieldsValue({
      status: 'ACTIVE',
      gender: 'MALE', // 设置默认性别
      experience: 1,
      age: 25,
      // campusId 从 banner 组件获取
      baseSalary: 0,
      socialInsurance: 0, // 修正字段名
      classFee: 0, // 修正字段名
      performanceBonus: 0,
      commission: 0,
      dividend: 0,
    });
    // 打印默认值
    console.log('设置默认值:', form.getFieldsValue());
    
    // 设置默认头像
    const defaultMaleAvatar = avatarOptions.MALE?.[0]?.url || avatarOptions.male?.[0]?.url;
    setSelectedAvatar(defaultMaleAvatar || '');
    
    setEditingCoach(null);
    setVisible(true);
  };

  // 显示编辑教练模态框
  const handleEdit = async (record: Coach) => {
    // 先显示模态框和加载状态
    setVisible(true);
    setDetailLoading(true);
    form.resetFields(); // 先重置表单，避免显示上一次的数据

    try {
      // 检查缓存中是否已有此教练详情
      const stringId = String(record.id);
      let coachDetail;
      
      if (coachDetailCache[stringId]) {
        console.log('编辑表单：使用缓存的教练详情数据:', stringId);
        coachDetail = coachDetailCache[stringId];
      } else {
        // 通过API获取最新的教练详情
        coachDetail = await fetchCoachDetail(record.id);
      }
      
      if (!coachDetail) {
        message.error('无法获取教练信息，请重试');
        setVisible(false);
        return;
      }
      
      // 使用API返回的最新数据或缓存数据
      const formValues = {
        ...coachDetail,
        hireDate: dayjs(coachDetail.hireDate),
        // 设置校区ID
        campusId: coachDetail.campusId || localStorage.getItem('currentCampusId') || 1,
      };

      // 处理证书数据
      if (coachDetail.certifications) {
        if (Array.isArray(coachDetail.certifications)) {
          formValues.certifications = coachDetail.certifications.join('\n');
        } else if (typeof coachDetail.certifications === 'string') {
          formValues.certifications = coachDetail.certifications.split('，').join('\n');
        }
      }

      // 打印获取到的详情数据
      console.log('教练详情数据:', coachDetail);

      setEditingCoach(coachDetail);
      form.setFieldsValue(formValues);

      if (coachDetail.avatar) {
        setSelectedAvatar(coachDetail.avatar);
      }
    } catch (error) {
      console.error('加载教练编辑信息失败:', error);
      message.error('加载教练信息失败');
      setVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // 处理模态框确认
  const handleSubmit = () => {
    setLoading(true);
    form.validateFields()
      .then(values => {
        // 直接使用硬编码的完整数据对象
        // 根据实际API要求设置字段名
        const formattedValues = {
          name: values.name,
          gender: values.gender,
          age: Number(values.age),
          phone: values.phone,
          avatar: selectedAvatar || values.avatar,
          jobTitle: values.jobTitle,
          hireDate: values.hireDate ? values.hireDate.format('YYYY-MM-DD') : '',
          experience: Number(values.experience),
          certifications: values.certifications ? values.certifications.split('\n').filter((cert: string) => cert.trim() !== '') : [],
          status: values.status,
          campusId: Number(values.campusId || localStorage.getItem('currentCampusId') || 1),
          // 这些字段必须使用正确的名称
          baseSalary: Number(values.baseSalary || 0),
          socialInsurance: Number(values.socialInsurance || 0),
          classFee: Number(values.classFee || 0),
          performanceBonus: Number(values.performanceBonus || 0),
          commission: Number(values.commission || 0),
          dividend: Number(values.dividend || 0),
          // 保留institutionId
          institutionId: editingCoach?.institutionId || 0
        };

        // 打印所有字段名称以便调试
        console.log('所有字段名称:', Object.keys(formattedValues));

        // 打印最终数据以确认所有字段都存在
        console.log('最终提交的数据:', formattedValues);

        // 再次确认必要字段存在
        const requiredFields = ['name', 'gender', 'age', 'phone', 'jobTitle', 'hireDate', 'experience', 'status', 'campusId', 'baseSalary', 'socialInsurance', 'classFee', 'performanceBonus', 'commission', 'dividend'];
        let missingFields: string[] = [];

        requiredFields.forEach(field => {
          if ((formattedValues as any)[field] === undefined || (formattedValues as any)[field] === null) {
            missingFields.push(field);
          }
        });

        if (missingFields.length > 0) {
          console.error('缺失必要字段:', missingFields);
          throw new Error(`缺失必要字段: ${missingFields.join(', ')}`);
        }

        if (editingCoach) {
          // 编辑现有教练
          updateCoach(editingCoach.id, formattedValues)
            .then(() => {
              // 在成功更新后更新缓存
              if (editingCoach.id) {
                // 更新缓存中的数据
                coachDetailCache[editingCoach.id] = {
                  ...coachDetailCache[editingCoach.id],
                  ...formattedValues,
                  id: editingCoach.id
                };
                console.log('教练数据已更新到缓存:', editingCoach.id);
              }
              handleCancel();
              if (onSuccess) onSuccess();
            })
            .catch(error => {
              console.error('更新教练失败:', error);
            });
        } else {
          // 添加新教练
          addCoach(formattedValues)
            .then((newCoach) => {
              // 将新添加的教练添加到缓存
              if (newCoach && newCoach.id) {
                coachDetailCache[newCoach.id] = newCoach;
                console.log('新教练数据已添加到缓存:', newCoach.id);
              }
              handleCancel();
              if (onSuccess) onSuccess();
            })
            .catch(error => {
              console.error('添加教练失败:', error);
            });
        }
      })
      .catch(info => {
        console.error('Form validation failed:', info);
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
    console.log('Gender changed to:', gender);
    
    // 确保性别值为大写的MALE或FEMALE
    if (gender === 'male') {
      form.setFieldsValue({ gender: 'MALE' });
    } else if (gender === 'female') {
      form.setFieldsValue({ gender: 'FEMALE' });
    }
    
    // 如果用户还没有选择头像，则根据性别设置默认头像
    if (!selectedAvatar || selectedAvatar === '') {
      if (gender === 'MALE' || gender === 'male') {
        // 选择第一个男性头像
        const defaultMaleAvatar = avatarOptions.MALE?.[0]?.url || avatarOptions.male?.[0]?.url;
        if (defaultMaleAvatar) {
          setSelectedAvatar(defaultMaleAvatar);
        }
      } else if (gender === 'FEMALE' || gender === 'female') {
        // 选择第一个女性头像
        const defaultFemaleAvatar = avatarOptions.FEMALE?.[0]?.url || avatarOptions.female?.[0]?.url;
        if (defaultFemaleAvatar) {
          setSelectedAvatar(defaultFemaleAvatar);
        }
      }
    }
  };

  return {
    form,
    visible,
    editingCoach,
    selectedAvatar,
    loading,
    detailLoading,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel,
    handleAvatarSelect,
    handleGenderChange
  };
};