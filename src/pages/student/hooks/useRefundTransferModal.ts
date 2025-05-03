import React, { useState, useCallback, useEffect } from 'react';
import { Form, message } from 'antd';
import { Student, CourseInfo } from '@/pages/student/types/student';
import { getStudentAllCourses, searchStudentsByKeyword } from '@/pages/student/utils/student';
import { courseOptions } from '@/pages/student/constants/options';
import dayjs from 'dayjs'; // 引入 dayjs
import { API } from '@/api';

/**
 * 退费转课模态框相关的hook
 * @param students 所有学生列表
 * @param onAddStudent 外部添加学生的回调函数
 * @param onRefresh 外部刷新列表的回调函数
 * @returns 退费转课模态框相关的状态和函数
 */
export const useRefundTransferModal = (
  students: Student[],
  // 新增：接收外部添加学生的回调
  onAddStudent?: (student: Omit<Student, 'id'> & { remainingClasses?: string; lastClassDate?: string }) => Student,
  // 新增：接收外部刷新列表的回调
  onRefresh?: () => void
) => {
  const [visible, setVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  // 使用 Form.useForm() 创建表单实例，并确保在组件挂载后才使用
  const [refundTransferForm] = Form.useForm();

  // 确保表单在组件挂载后初始化
  useEffect(() => {
    if (visible) {
      // 如果模态框可见，确保表单已初始化
      refundTransferForm.resetFields();
      
      // 如果当前有选中的学生，确保学生信息被设置到表单中
      if (currentStudent) {
        console.log('模态框可见，设置学生信息:', currentStudent.name, currentStudent.id);
        refundTransferForm.setFieldsValue({
          studentId: currentStudent.id,
          studentName: currentStudent.name,
        });
      }
    }
  }, [visible, currentStudent, refundTransferForm]);

  const [transferStudentSearchResults, setTransferStudentSearchResults] = useState<Student[]>([]);
  const [isSearchingTransferStudent, setIsSearchingTransferStudent] = useState<boolean>(false);
  const [selectedTransferStudent, setSelectedTransferStudent] = useState<Student | null>(null);
  const [transferStudentSearchText, setTransferStudentSearchText] = useState<string>('');

  // 新增：快速添加学员模态框状态
  const [isQuickAddStudentModalVisible, setIsQuickAddStudentModalVisible] = useState(false);
  const [quickAddStudentForm] = Form.useForm();

  // 同样为quickAddStudentForm添加清理
  useEffect(() => {
    return () => {
      quickAddStudentForm.resetFields();
    };
  }, [quickAddStudentForm]);

  // 重置表单和状态
  const resetFormAndState = () => {
    refundTransferForm.resetFields();
    setSelectedTransferStudent(null);
    setTransferStudentSearchResults([]);
  };

  // 处理退费
  const handleRefund = (student: Student) => {
    setCurrentStudent(student);
    refundTransferForm.resetFields();

    // 获取学生所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );

    // 获取第一个课程作为默认值
    const defaultCourse = courses.length > 0 ? courses[0] : null;
    const courseName = defaultCourse ? defaultCourse.name : '';
    const courseId = defaultCourse ? defaultCourse.id : '';
    
    // 获取剩余课时数
    let remainingHours = 0;
    if (defaultCourse) {
      // 尝试从courses数组中获取精确的剩余课时
      if (student.courses && student.courses.length > 0) {
        const coursesInfo = student.courses.find(c => String(c.courseId) === String(defaultCourse.id));
        if (coursesInfo && coursesInfo.remainingHours !== undefined) {
          remainingHours = coursesInfo.remainingHours;
          console.log('从学生courses数组中获取剩余课时:', remainingHours);
        }
      }
      
      // 如果没有找到精确课时，从课程概要中获取
      if (remainingHours === 0 && defaultCourse.remainingClasses) {
        const parts = defaultCourse.remainingClasses.split('/');
        if (parts.length > 0 && !isNaN(Number(parts[0]))) {
          remainingHours = Number(parts[0]);
          console.log('从课程概要中获取剩余课时:', remainingHours);
        }
      }
    }
    
    // 如果仍未找到，尝试从学生对象直接获取
    if (remainingHours === 0 && student.remainingClasses) {
      const parts = student.remainingClasses.split('/');
      if (parts.length > 0 && !isNaN(Number(parts[0]))) {
        remainingHours = Number(parts[0]);
        console.log('从学生对象中获取剩余课时:', remainingHours);
      }
    }

    console.log('设置退费表单值:', {
      studentName: student.name,
      studentId: student.id,
      fromCourseId: courseName, // 显示课程名称
      refundClassHours: remainingHours,
    });

    // 设置初始值 - 确保学生姓名和ID从传入的student对象中获取
    refundTransferForm.setFieldsValue({
      studentId: student.id,
      studentName: student.name,
      fromCourseId: courseName, // 显示课程名称，而不是ID
      _courseId: courseId, // 保存课程ID到隐藏字段，以便提交时使用
      refundClassHours: remainingHours,
      operationType: 'refund', // 设置为退费
      refundAmount: 0,
      serviceFee: 0,
      otherFee: 0,
      actualRefund: 0,
      refundMethod: 'BANK_TRANSFER',
    });

    setVisible(true);
  };

  // 处理转课
  const handleTransfer = (student: Student) => {
    setCurrentStudent(student);
    refundTransferForm.resetFields();
    setSelectedTransferStudent(null);
    setTransferStudentSearchText('');

    // 获取学生所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );

    // 设置初始值 - 确保学生姓名和ID从传入的student对象中获取
    refundTransferForm.setFieldsValue({
      studentId: student.id,
      studentName: student.name,
      fromCourseId: courses.length > 0 ? courses[0].id : '',
      operationType: 'transfer', // 设置为转课
      transferClassHours: 1, // 默认转课课时为1
      priceDifference: 0,
    });

    setVisible(true);
  };

  // 处理转班
  const handleTransferClass = (student: Student) => {
    // 清除之前可能存在的全局变量和观察器
    if ((window as any)._originalCourseId) {
      delete (window as any)._originalCourseId;
    }
    
    // 清理可能存在的旧观察器
    if ((window as any)._courseObserver) {
      (window as any)._courseObserver.disconnect();
      delete (window as any)._courseObserver;
    }
    
    setCurrentStudent(student);
    refundTransferForm.resetFields();

    console.log('开始处理转班:', student.name, student.id);

    // 获取学生所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );

    console.log('学生的课程列表:', courses);

    // 获取第一个课程作为默认值
    const defaultCourse = courses.length > 0 ? courses[0] : null;
    const courseName = defaultCourse ? defaultCourse.name : '';
    const courseId = defaultCourse ? defaultCourse.id : '';

    console.log('选择的原课程信息:', {
      courseId,
      courseName,
      courseObject: defaultCourse
    });
    
    if (!courseId) {
      console.error('错误: 无法获取原课程ID');
      message.error('无法获取课程信息');
      return;
    }
    
    // 在全局设置原课程ID，方便在其他地方访问
    (window as any)._originalCourseId = courseId;
    console.log('设置全局原课程ID:', (window as any)._originalCourseId);
    
    // 添加事件监听，确保课程ID不会丢失
    const handleDOMChange = () => {
      // 先检查原课程ID是否存在
      if (!(window as any)._originalCourseId) {
        return; // 避免循环引用
      }
      
      // 避免频繁调用form.getFieldValue
      const formValue = refundTransferForm?.getFieldValue('_courseId');
      if (formValue === (window as any)._originalCourseId) {
        return; // 如果值相同，不进行操作
      }
      
      // 限制更新频率，使用防抖
      if ((window as any)._updateTimerId) {
        clearTimeout((window as any)._updateTimerId);
      }
      
      (window as any)._updateTimerId = setTimeout(() => {
        console.log('检测到原课程ID改变或不存在，重新设置:', (window as any)._originalCourseId);
        
        // 仅当form实例存在且表单打开时才更新
        if (refundTransferForm && visible) {
          // 首先检查字段是否存在
          try {
            refundTransferForm.setFieldValue('_courseId', (window as any)._originalCourseId);
            console.log('已更新表单原课程ID字段');
          } catch (e) {
            console.warn('无法设置表单字段，可能表单已关闭', e);
          }
        }
        
        delete (window as any)._updateTimerId;
      }, 100); // 100ms防抖
    };
    
    // 仅观察特定元素，而不是整个document.body
    const modalFormElement = document.querySelector('.ant-modal-content');
    if (modalFormElement) {
      // 创建观察器并保存在全局变量
      const observer = new MutationObserver(handleDOMChange);
      (window as any)._courseObserver = observer;
      
      // 限制观察范围，减少不必要的回调
      observer.observe(modalFormElement, { 
        childList: true,
        subtree: true,
        attributes: false, // 不观察属性变化
        characterData: false // 不观察文本变化
      });
      
      // 设置自动清理
      setTimeout(() => {
        if ((window as any)._courseObserver) {
          (window as any)._courseObserver.disconnect();
          delete (window as any)._courseObserver;
          console.log('自动清理MutationObserver');
        }
      }, 30000); // 30秒后自动清理
    } else {
      console.warn('无法找到模态框内容元素，跳过MutationObserver');
    }
    
    // 获取剩余课时数
    let remainingHours = 0;
    // 获取有效期
    let expireDate = '';
    
    if (defaultCourse) {
      // 获取有效期
      expireDate = defaultCourse.expireDate || '';
      console.log('从defaultCourse获取有效期:', expireDate);
      
      // 尝试从courses数组中获取精确的剩余课时
      if (student.courses && student.courses.length > 0) {
        console.log('尝试从student.courses中获取剩余课时，courses=', student.courses);
        const coursesInfo = student.courses.find(c => String(c.courseId) === String(defaultCourse.id));
        if (coursesInfo && coursesInfo.remainingHours !== undefined) {
          remainingHours = coursesInfo.remainingHours;
          console.log('从学生courses数组中获取剩余课时:', remainingHours);
          
          // 如果从coursesInfo中能获取到剩余课时，也尝试获取有效期
          if (!expireDate && coursesInfo.endDate) {
            expireDate = coursesInfo.endDate;
            console.log('从coursesInfo获取有效期:', expireDate);
          }
        }
      }
      
      // 如果没有找到精确课时，从课程概要中获取
      if (remainingHours === 0 && defaultCourse.remainingClasses) {
        console.log('尝试从defaultCourse.remainingClasses中获取剩余课时:', defaultCourse.remainingClasses);
        const parts = defaultCourse.remainingClasses.split('/');
        if (parts.length > 0 && !isNaN(Number(parts[0]))) {
          remainingHours = Number(parts[0]);
          console.log('从课程概要中获取剩余课时:', remainingHours);
        }
      }
    }
    
    // 如果仍未找到有效期，尝试从学生对象获取
    if (!expireDate && student.expireDate) {
      expireDate = student.expireDate;
      console.log('从student.expireDate获取有效期:', expireDate);
    }
    
    // 如果仍未找到剩余课时，尝试从学生对象直接获取
    if (remainingHours === 0 && student.remainingClasses) {
      console.log('尝试从student.remainingClasses中获取剩余课时:', student.remainingClasses);
      const parts = student.remainingClasses.split('/');
      if (parts.length > 0 && !isNaN(Number(parts[0]))) {
        remainingHours = Number(parts[0]);
        console.log('从学生对象中获取剩余课时:', remainingHours);
      }
    }
    
    // 准备表单值
    const formValues: any = {
      studentId: student.id,
      studentName: student.name,
      fromCourseId: courseName, // 显示课程名称，而不是ID
      _courseId: courseId, // 保存课程ID到隐藏字段，以便提交时使用
      operationType: 'transferClass', // 设置为转班
      transferClassHours: remainingHours > 0 ? remainingHours : 1,
      refundClassHours: remainingHours > 0 ? remainingHours : 1,
      priceDifference: 0,
    };
    
    // 如果有有效期，添加到表单值中
    if (expireDate) {
      try {
        const dateObj = dayjs(expireDate);
        if (dateObj.isValid()) {
          formValues.validUntil = dateObj;
        }
      } catch (error) {
        console.error('设置有效期失败:', error);
      }
    }
    
    // 设置表单值
    refundTransferForm.setFieldsValue(formValues);
    
    // 设置模态框为可见
    setVisible(true);
    
    // 组件卸载时清理
    return () => {
      if ((window as any)._courseObserver) {
        (window as any)._courseObserver.disconnect();
        delete (window as any)._courseObserver;
      }
      if ((window as any)._updateTimerId) {
        clearTimeout((window as any)._updateTimerId);
        delete (window as any)._updateTimerId;
      }
    };
  };

  // 处理退费转课提交
  const handleRefundTransferOk = () => {
    console.log('开始提交表单...');
    // 检查API对象是否正确加载
    console.log('API对象检查:', {
      API: typeof API,
      'API.student': API.student ? '已加载' : '未加载',
      'API.student.refund': API.student && (API.student as any).refund ? '已加载' : '未加载',
    });
    
    // 查找模态框中的蒙板元素并控制它的显示
    const spinElement = document.querySelector('.ant-modal-content .ant-spin');
    const showSpin = () => {
      if (spinElement) {
        // 添加spinning类，显示蒙板
        spinElement.classList.add('ant-spin-spinning');
        const spinContainers = document.querySelectorAll('.ant-spin-container');
        spinContainers.forEach(container => {
          container.classList.add('ant-spin-blur');
        });
      }
    };
    const hideSpin = () => {
      if (spinElement) {
        // 移除spinning类，隐藏蒙板
        spinElement.classList.remove('ant-spin-spinning');
        const spinContainers = document.querySelectorAll('.ant-spin-container');
        spinContainers.forEach(container => {
          container.classList.remove('ant-spin-blur');
        });
      }
    };
    
    refundTransferForm.validateFields()
      .then(async values => {
        try {
          console.log('表单验证通过，准备提交数据:', values);
          console.log('表单操作类型:', values.operationType);
          
          if (values.operationType === 'refund') {
            console.log('进入退费处理流程');
            const fromCourseId = values._courseId; 
            const refundClassHours = values.refundClassHours;
            const courseName = values.fromCourseId; 
            
            console.log('退费关键字段检查:', {
              fromCourseId,
              refundClassHours,
              courseName,
              studentId: currentStudent?.id,
              operationType: values.operationType
            });

            // 查找对应的 studentCourse 记录 (假设 CourseInfo 有一个主键 id，如果没有则需要后端接口支持通过 studentId+courseId 查询)
            // 如果 CourseInfo 没有主键 id，我们需要传递 studentId 和 courseId 给后端
            // 暂时假设 CourseInfo 有 id，如果实际没有，需要调整这里的逻辑和API调用
            const studentCourseRecord = currentStudent?.courses?.find((c: CourseInfo) => String(c.courseId) === String(fromCourseId));
            const studentCourseId = (studentCourseRecord as any)?.id; // 尝试获取 id，如果类型定义没有，使用 any 绕过检查

            if (!studentCourseId && !currentStudent?.id) { // 如果没有记录ID，至少需要学生ID
              message.error('无法确定退费目标（缺少学员ID或课程记录ID）');
              return;
            }
            
            const refundData = {
              // 如果有 studentCourseId，优先使用它，否则可能需要 studentId + courseId
              sourceCourseId: studentCourseId ? String(studentCourseId) : undefined,
              studentId: currentStudent?.id, // 确保 studentId 传递
              courseId: studentCourseId ? undefined : fromCourseId, // 如果没有 studentCourseId，则传递 courseId
              refundClassHours: refundClassHours,
              refundAmount: values.refundAmount,
              serviceFee: values.serviceFee,
              otherFee: values.otherFee,
              actualRefund: values.actualRefund,
              reason: values.reason,
              refundMethod: values.refundMethod || 'BANK_TRANSFER', 
              operatorId: 1, 
              operatorName: '管理员' 
            };
            
            console.log('退费数据准备完成:', refundData);
            
            try {
              // 检查API是否存在退费方法
              const studentAPI = API.student as any;
              
              // 准备退费请求数据，匹配正确的API接口参数格式
              const refundRequestData = {
                studentId: Number(currentStudent?.id),
                courseId: Number(fromCourseId),
                refundHours: Number(refundClassHours),
                refundAmount: values.refundAmount, // 总退款金额
                handlingFee: values.serviceFee, // 手续费
                deductionAmount: values.otherFee, // 扣除金额
                refundMethod: values.refundMethod || "BANK_TRANSFER", // 退款方式
                reason: values.reason // 退费原因
              };
              
              console.log('调用退费API:', refundRequestData);
              
              // 显示加载指示器
              const hide = message.loading('正在处理退费请求...', 0);
              // 显示蒙板
              showSpin();
              
              try {
                // 调用接口 - 只调用一次
                const response = await fetch('/lesson/api/student/refund', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                  },
                  body: JSON.stringify(refundRequestData)
                });
                
                // 关闭加载指示器
                hide();
                // 隐藏蒙板
                hideSpin();
                
                if (!response.ok) {
                  throw new Error(`退费请求失败: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('退费接口调用成功:', data);
                
                // 成功处理
                message.success(`退费处理成功: ${courseName}, 退课 ${refundClassHours} 课时, 退款 ¥${values.actualRefund}`);
                setVisible(false);
                setCurrentStudent(null);
                refundTransferForm.resetFields();
                
                // 刷新学员列表
                if (onRefresh) {
                  onRefresh();
                }
              } catch (error) {
                // 关闭加载指示器
                hide();
                // 隐藏蒙板
                hideSpin();
                
                console.error('退费API调用失败:', error);
                message.error(`退费处理失败: ${error instanceof Error ? error.message : '请稍后重试'}`);
              }
            } catch (error) {
              // 隐藏蒙板，确保错误情况下也能关闭
              hideSpin();
              
              console.error('退费处理准备失败:', error);
              message.error(`退费处理失败: ${error instanceof Error ? error.message : '请稍后重试'}`);
            }

          } else if (values.operationType === 'transfer') {
            // ... 转课逻辑 (模拟) ...
            console.warn('转课API未确定，使用模拟延迟');
            
            // 显示加载指示器
            const hide = message.loading('正在处理转课请求...', 0);
            // 显示蒙板
            showSpin();
            
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // 关闭加载指示器
              hide();
              // 隐藏蒙板
              hideSpin();
              
              message.success(`模拟转课处理成功`);
              setVisible(false);
              setCurrentStudent(null);
              setSelectedTransferStudent(null);
              refundTransferForm.resetFields();
            } catch (error) {
              // 关闭加载指示器
              hide();
              // 隐藏蒙板
              hideSpin();
              
              console.error('转课处理失败:', error);
              message.error(`转课处理失败: ${error instanceof Error ? error.message : '请稍后重试'}`);
            }

          } else if (values.operationType === 'transferClass') {
            if (!currentStudent?.id) {
              message.error('未找到学员信息');
              return; 
            }
            
            const fromCourseId = values._courseId; 
            const fromCourseName = values.fromCourseId;
            const toCourseId = values.toCourseId; 

            // 查找原课程的 studentCourse 记录 ID
            const studentCourseRecord = currentStudent?.courses?.find((c: CourseInfo) => String(c.courseId) === String(fromCourseId));
            const studentCourseId = (studentCourseRecord as any)?.id; // 尝试获取 id

            if (!studentCourseId) {
              message.error('无法找到原学员课程记录ID，无法转班');
              return;
            }
            
            // 显示加载指示器
            const hide = message.loading('正在处理转班请求...', 0);
            // 显示蒙板
            showSpin();
            
            let toCourseName = `课程${toCourseId}`;
            try {
              // @ts-ignore
              const course = await new Promise<{name: string}>(resolve => setTimeout(() => resolve({ name: `课程${toCourseId}` }), 100));
              toCourseName = course.name;
            } catch (e) { console.error('获取课程名称失败', e); }
            
            const transferClassData = {
              sourceCourseId: String(studentCourseId), // 使用学员课程记录ID作为源
              studentId: currentStudent.id,
              // fromCourseId: fromCourseId, // 可能不需要
              targetCourseId: toCourseId, // 目标课程ID
              targetClassName: toCourseName, // 目标课程名称 (或班级名称)
              transferClassHours: values.transferClassHours,
              priceDifference: values.priceDifference,
              validUntil: values.validUntil ? values.validUntil.format('YYYY-MM-DD') : '',
              reason: values.reason, // 确保字段名与后端一致
              operatorId: 1, 
              operatorName: '管理员' 
            };
            
            console.log('转班数据准备完成:', transferClassData);
            
            try {
              // 使用类型断言绕过TypeScript检查
              // 检查API是否存在转班方法，如果不存在给出友好提示
              const studentAPI = API.student as any;
              if (!studentAPI?.transferClass) {
                throw new Error('转班API方法未定义，请先确认正确的API路径');
              }
              
              console.log('尝试调用转班API:', transferClassData);
              // 使用类型断言调用API
              const response = await studentAPI.transferClass(transferClassData);
              console.log('转班API调用成功:', response);
              
              const priceDifferenceInfo = values.priceDifference > 0 ?
                `, 补差价: ¥${values.priceDifference}` :
                (values.priceDifference < 0 ?
                  `, 退差价: ¥${Math.abs(values.priceDifference)}` :
                  '');
              
              // 关闭加载指示器
              hide();
              // 隐藏蒙板
              hideSpin();
              
              message.success(`转班处理成功: ${fromCourseName} -> ${toCourseName}${priceDifferenceInfo}`);
              setVisible(false);
              setCurrentStudent(null);
              refundTransferForm.resetFields();
            } catch (apiError: any) { // 添加 : any 类型注解
              // 关闭加载指示器
              hide();
              // 隐藏蒙板
              hideSpin();
              
              console.error('转班API调用失败:', apiError);
              message.error(`转班处理失败: ${apiError?.message || '请稍后重试'}`);
            }
          }
          
          setTransferStudentSearchResults([]);
          setTransferStudentSearchText('');
        } catch (error) { 
          console.error('提交过程中意外出错:', error);
          message.error('处理失败，请检查控制台日志');
        }
      })
      .catch(info => {
        console.log('表单验证失败:', info);
        message.error('请检查表单填写是否完整');
      });
  };

  // 关闭退费转课模态框
  const handleRefundTransferCancel = () => {
    setVisible(false);
    setCurrentStudent(null);
    setSelectedTransferStudent(null);
    refundTransferForm.resetFields();
    setTransferStudentSearchResults([]);
    setTransferStudentSearchText('');
  };

  // 搜索学员
  const handleSearchTransferStudent = (value: string) => {
    setTransferStudentSearchText(value);

    if (value.trim() === '') {
      setTransferStudentSearchResults([]);
      setIsSearchingTransferStudent(false);
      return;
    }

    setIsSearchingTransferStudent(true);

    // 模拟异步搜索
    setTimeout(() => {
      const results = searchStudentsByKeyword(students, value, currentStudent?.id);
      setTransferStudentSearchResults(results);
      setIsSearchingTransferStudent(false);
    }, 300);
  };

  // 选择学员 (只更新状态，不设置表单值)
  const handleSelectTransferStudent = (record: Student) => {
    setSelectedTransferStudent(record);
    // 清空搜索，以便下拉列表关闭
    setTransferStudentSearchText('');
    setTransferStudentSearchResults([]);
    
    // 确保operationType保持为'transfer'
    const currentType = refundTransferForm.getFieldValue('operationType');
    if (currentType !== 'transfer') {
      console.log('选择转入学员后，将操作类型从', currentType, '设置为 transfer');
      refundTransferForm.setFieldsValue({ operationType: 'transfer' });
    }
    
    // 表单值的设置应在组件中完成，例如在 Select 的 onChange 中
  };

  // 新增：显示快速添加学员模态框
  const showQuickAddStudentModal = () => {
    quickAddStudentForm.resetFields();
    setIsQuickAddStudentModalVisible(true);
  };

  // 新增：处理快速添加学员提交
  const handleQuickAddStudentOk = () => {
    quickAddStudentForm.validateFields()
      .then(values => {
        if (!onAddStudent) {
          message.error('添加学员功能未配置');
          return;
        }

        // 创建新学员对象
        const newStudentData: Omit<Student, 'id'> = {
          name: values.name,
          gender: values.gender,
          age: values.age,
          phone: values.phone,
          // 设置默认值或空值
          courseType: '',
          course: [],
          coach: '',
          lastClassDate: '',
          enrollDate: dayjs().format('YYYY-MM-DD'),
          expireDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
          remainingClasses: '0/0',
          status: 'normal',
          payments: [],
          courseGroups: [],
          campusId: 1,
        };

        // 调用外部传入的 addStudent 函数添加学员
        const newStudent = onAddStudent(newStudentData);

        // 选中新添加的学员并设置到转课表单中
        setSelectedTransferStudent(newStudent);
        refundTransferForm.setFieldsValue({
          targetStudentId: newStudent.id,
        });

        // 清空搜索结果和搜索文本
        setTransferStudentSearchResults([]);
        setTransferStudentSearchText('');

        // 关闭模态框
        setIsQuickAddStudentModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // 新增：处理快速添加学员取消
  const handleQuickAddStudentCancel = () => {
    setIsQuickAddStudentModalVisible(false);
  };

  return {
    isRefundTransferModalVisible: visible,
    refundTransferForm,
    currentStudent,
    transferStudentSearchResults,
    isSearchingTransferStudent,
    selectedTransferStudent,
    transferStudentSearchText,
    handleRefund,
    handleTransfer,
    handleTransferClass,
    handleRefundTransferOk,
    handleRefundTransferCancel,
    handleSearchTransferStudent,
    handleSelectTransferStudent,
    // 新增导出
    isQuickAddStudentModalVisible,
    quickAddStudentForm,
    showQuickAddStudentModal,
    handleQuickAddStudentOk,
    handleQuickAddStudentCancel
  };
};