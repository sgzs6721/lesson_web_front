import { useState } from 'react';
import { Form } from 'antd';
import { Coach, CoachSalary } from '../types/coach';
import dayjs, { Dayjs } from 'dayjs';
import { API } from '@/api';
import { message } from 'antd';
import { convertApiCoachToCoach, coachDetailCache } from './useCoachDetail';
import { avatarOptions } from '../constants/avatarOptions';
import { safeDayjs } from '@/utils/date';

// 拓展表单值的接口，包含Dayjs类型
interface CoachFormValues extends Omit<Coach, 'hireDate'> {
  hireDate?: Dayjs;
  // 其他可能是Dayjs类型的字段
}

export const useCoachForm = (
  addCoach: (values: Omit<Coach, 'id'>) => Promise<Coach>,
  updateCoach: (id: string, values: Partial<Coach>) => Promise<void>
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
      const currentCampusId = localStorage.getItem('currentCampusId');
      const apiCoachDetail = await API.coach.getDetail(id, currentCampusId ? Number(currentCampusId) : undefined);
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
    // 打开模态框
    setVisible(true);

    // 预设默认值
    const currentCampusId = localStorage.getItem('currentCampusId') || '1';

    // 重置表单并预填充默认值
    form.resetFields();
    form.setFieldsValue({
      status: 'ACTIVE',
      gender: 'MALE',
      experience: 1,
      age: 25,
      campusId: currentCampusId,
      baseSalary: 0,
      socialInsurance: 0,
      classFee: 0,
      performanceBonus: 0,
      commission: 0,
      dividend: 0,
      hireDate: dayjs(),
    });

    // 清除编辑状态和头像
    setEditingCoach(null);
    setSelectedAvatar('');
  };

  // 显示编辑教练模态框
  const handleEdit = async (record: Coach) => {
    // 先显示模态框和加载状态
    setVisible(true);
    setDetailLoading(true);
    form.resetFields(); // 先重置表单，避免显示上一次的数据

    // 预设默认值，以便在加载时显示表单结构
    const currentCampusId = localStorage.getItem('currentCampusId') || '1';
    form.setFieldsValue({
      status: 'ACTIVE',
      gender: 'MALE',
      experience: 1,
      age: 25,
      campusId: currentCampusId,
      baseSalary: 0,
      socialInsurance: 0,
      classFee: 0,
      performanceBonus: 0,
      commission: 0,
      dividend: 0,
      hireDate: dayjs(),
    })

    try {
      // 获取教练ID
      const stringId = String(record.id);
      let coachDetail;

      // 强制从缓存中获取最新数据，如果缓存中有的话
      if (coachDetailCache[stringId]) {
        console.log('编辑表单：使用缓存的教练详情数据:', stringId);
        coachDetail = coachDetailCache[stringId];

        // 打印缓存中的数据，用于调试
        console.log('缓存中的教练数据:', coachDetail);
      } else {
        // 只有在缓存中没有数据时才通过API获取
        console.log('缓存中没有数据，调用API获取教练详情:', stringId);
        coachDetail = await fetchCoachDetail(record.id);
      }

      if (!coachDetail) {
        message.error('无法获取教练信息，请重试');
        setVisible(false);
        return;
      }

      // 确保使用当前校区ID
      const currentCampusId = coachDetail.campusId || localStorage.getItem('currentCampusId') || '1';

      // 使用API返回的最新数据或缓存数据
      const formValues: any = {
        ...coachDetail,
        hireDate: safeDayjs(coachDetail.hireDate),
        // 设置校区ID
        campusId: currentCampusId,
      };

      // 处理嵌套的salary对象中的字段
      if (coachDetail.salary) {
        console.log('发现嵌套的salary对象:', coachDetail.salary);

        // 直接从salary对象中提取各个薪资字段
        formValues.baseSalary = coachDetail.salary.baseSalary;
        formValues.socialInsurance = coachDetail.salary.socialInsurance;
        formValues.classFee = coachDetail.salary.classFee;
        formValues.performanceBonus = coachDetail.salary.performanceBonus;
        formValues.commission = coachDetail.salary.commission;
        formValues.dividend = coachDetail.salary.dividend;

        // 打印提取的薪资信息，用于调试
        console.log('从salary对象中提取的薪资信息:', {
          baseSalary: formValues.baseSalary,
          socialInsurance: formValues.socialInsurance,
          classFee: formValues.classFee,
          performanceBonus: formValues.performanceBonus,
          commission: formValues.commission,
          dividend: formValues.dividend
        });
      } else {
        // 如果没有salary对象，但可能有直接的薪资字段
        console.log('没有嵌套的salary对象，检查直接字段');

        // 确保基本薪资字段有值，如果没有则使用默认值
        formValues.baseSalary = coachDetail.baseSalary || 0;
        formValues.socialInsurance = coachDetail.socialInsurance || 0;
        formValues.classFee = coachDetail.classFee || 0;
        formValues.performanceBonus = coachDetail.performanceBonus || 0;
        formValues.commission = coachDetail.commission || 0;
        formValues.dividend = coachDetail.dividend || 0;

        // 打印直接字段的薪资信息，用于调试
        console.log('直接字段中的薪资信息:', {
          baseSalary: formValues.baseSalary,
          socialInsurance: formValues.socialInsurance,
          classFee: formValues.classFee,
          performanceBonus: formValues.performanceBonus,
          commission: formValues.commission,
          dividend: formValues.dividend
        });
      }

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
    // 设置加载状态为 true，显示蒙板
    setLoading(true);
    console.log('点击保存/添加按钮，设置加载状态为 true');

    // 先进行额外的Date类型验证，处理dayjs对象可能存在的问题
    const validateDates = () => {
      try {
        const hireDateValue = form.getFieldValue('hireDate');

        // 使用安全日期函数重新设置表单值
        form.setFieldsValue({
          hireDate: safeDayjs(hireDateValue)
        });

        return true;
      } catch (error) {
        console.error('日期验证失败:', error);
        return false;
      }
    };

    // 执行日期验证
    const datesValid = validateDates();
    if (!datesValid) {
      message.warning('日期格式有误，已自动修正');
    }

    form.validateFields()
      .then(values => {
        // 根据后端API要求构造数据对象
        const formattedValues: any = {
          name: values.name,
          gender: values.gender,
          age: Number(values.age),
          phone: values.phone,
          avatar: selectedAvatar || values.avatar,
          jobTitle: values.jobTitle,
          hireDate: safeDayjs(values.hireDate).format('YYYY-MM-DD'),
          experience: Number(values.experience),
          certifications: values.certifications ? values.certifications.split('\n').filter((cert: string) => cert.trim() !== '') : [],
          status: values.status,
          campusId: Number(values.campusId || localStorage.getItem('currentCampusId') || 1),
          // 直接添加薪资字段
          baseSalary: Number(values.baseSalary || 0),
          socialInsurance: Number(values.socialInsurance || 0),
          classFee: Number(values.classFee || 0),
          performanceBonus: Number(values.performanceBonus || 0),
          commission: Number(values.commission || 0),
          dividend: Number(values.dividend || 0),
          // 保留institutionId如果存在
          institutionId: editingCoach?.institutionId
        };

        // 打印最终数据以确认所有字段都存在
        console.log('最终提交的数据:', formattedValues);

        // 再次确认必要字段存在
        const requiredFields = ['name', 'gender', 'age', 'phone', 'jobTitle', 'hireDate', 'experience', 'status', 'campusId'];
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
          formattedValues.id = editingCoach.id;
          updateCoach(editingCoach.id, formattedValues)
            .then(() => {
              // 在成功更新后更新缓存
              if (editingCoach.id) {
                // 创建一个完整的更新后的教练对象
                const updatedCoach: Coach = {
                  // 保留原始教练对象中的其他字段
                  ...coachDetailCache[editingCoach.id],
                  // 更新所有提交的字段
                  id: editingCoach.id,
                  name: formattedValues.name,
                  gender: formattedValues.gender,
                  age: formattedValues.age,
                  phone: formattedValues.phone,
                  avatar: formattedValues.avatar,
                  jobTitle: formattedValues.jobTitle,
                  hireDate: formattedValues.hireDate,
                  experience: formattedValues.experience,
                  certifications: formattedValues.certifications,
                  status: formattedValues.status,
                  campusId: formattedValues.campusId,
                  // 薪资相关字段
                  baseSalary: formattedValues.baseSalary,
                  socialInsurance: formattedValues.socialInsurance,
                  classFee: formattedValues.classFee,
                  performanceBonus: formattedValues.performanceBonus,
                  commission: formattedValues.commission,
                  dividend: formattedValues.dividend,
                  // 保留其他可能的字段
                  institutionId: formattedValues.institutionId || coachDetailCache[editingCoach.id].institutionId,
                  institutionName: coachDetailCache[editingCoach.id].institutionName,
                  campusName: coachDetailCache[editingCoach.id].campusName
                };

                // 更新缓存
                coachDetailCache[editingCoach.id] = updatedCoach;

                // 将更新后的数据保存到当前编辑的教练对象中，确保当前组件状态也是最新的
                setEditingCoach(updatedCoach);

                // 打印日志，确认缓存已更新
                console.log('教练数据已完整更新到缓存和组件状态:', editingCoach.id, updatedCoach);

                // 打印缓存中的数据，用于调试
                console.log('更新后的缓存数据:', coachDetailCache[editingCoach.id]);
              }

              // 延迟关闭加载状态，确保蒙板显示足够时间
              setTimeout(() => {
                // 关闭加载状态
                setLoading(false);
                console.log('更新教练成功，关闭加载状态');

                // 关闭模态框
                handleCancel();
              }, 1000); // 至少显示 1 秒的加载效果
            })
            .catch(error => {
              console.error('更新教练失败:', error);
              // 在失败时关闭加载状态
              setLoading(false);
              console.log('更新教练失败，关闭加载状态');
            });
        } else {
          // 添加新教练
          addCoach(formattedValues)
            .then((newCoach) => {
              // 将新添加的教练添加到缓存
              if (newCoach && newCoach.id) {
                coachDetailCache[newCoach.id] = newCoach;
                console.log('新教练数据已添加到缓存:', newCoach.id);

                // 触发一个自定义事件，通知父组件新教练已添加
                const event = new CustomEvent('coachAdded', { detail: newCoach });
                window.dispatchEvent(event);
              }

              // 延迟关闭加载状态，确保蒙板显示足够时间
              setTimeout(() => {
                // 关闭加载状态
                setLoading(false);
                console.log('添加教练成功，关闭加载状态');

                // 关闭模态框
                handleCancel();
              }, 1000); // 至少显示 1 秒的加载效果
            })
            .catch(error => {
              console.error('添加教练失败:', error);
              // 在失败时关闭加载状态
              setLoading(false);
              console.log('添加教练失败，关闭加载状态');
            });
        }
      })
      .catch(info => {
        console.error('Form validation failed:', info);
        // 验证失败时重置loading状态
        setLoading(false);
      })
  };

  // 处理模态框取消
  const handleCancel = () => {
    // 如果当前处于加载状态，不允许关闭模态框
    if (loading) {
      console.log('当前处于加载状态，不允许关闭模态框');
      return;
    }

    // 重置表单并关闭模态框
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