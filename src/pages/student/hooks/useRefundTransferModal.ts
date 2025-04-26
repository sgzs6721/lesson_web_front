import { useState } from 'react';
import { Form, message } from 'antd';
import { Student } from '@/pages/student/types/student';
import { getStudentAllCourses, searchStudentsByKeyword } from '@/pages/student/utils/student';
import { courseOptions } from '@/pages/student/constants/options';
import dayjs from 'dayjs'; // 引入 dayjs

/**
 * 退费转课模态框相关的hook
 * @param students 所有学生列表
 * @param onAddStudent 外部添加学生的回调函数
 * @returns 退费转课模态框相关的状态和函数
 */
export const useRefundTransferModal = (
  students: Student[],
  // 新增：接收外部添加学生的回调
  onAddStudent?: (student: Omit<Student, 'id'> & { remainingClasses?: string; lastClassDate?: string }) => Student
) => {
  const [visible, setVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [refundTransferForm] = Form.useForm();
  const [transferStudentSearchResults, setTransferStudentSearchResults] = useState<Student[]>([]);
  const [isSearchingTransferStudent, setIsSearchingTransferStudent] = useState<boolean>(false);
  const [selectedTransferStudent, setSelectedTransferStudent] = useState<Student | null>(null);
  const [transferStudentSearchText, setTransferStudentSearchText] = useState<string>('');

  // 新增：快速添加学员模态框状态
  const [isQuickAddStudentModalVisible, setIsQuickAddStudentModalVisible] = useState(false);
  const [quickAddStudentForm] = Form.useForm();

  // 处理退费
  const handleRefund = (student: Student) => {
    setCurrentStudent(student);
    refundTransferForm.resetFields();

    // 获取学生所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );

    // 设置初始值
    refundTransferForm.setFieldsValue({
      fromCourseId: courses.length > 0 ? courses[0].id : '',
      studentId: student.id,
      studentName: student.name,
      operationType: 'refund', // 设置为退费
      refundAmount: 0,
      serviceFee: 0,
      otherFee: 0,
      actualRefund: 0,
    });

    setVisible(true);
  };

  // 处理转课
  const handleTransfer = (student: Student) => {
    setCurrentStudent(student);
    refundTransferForm.resetFields();
    setSelectedTransferStudent(null);
    setTransferStudentSearchResults([]);
    setTransferStudentSearchText('');

    // 获取学生所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );

    // 设置初始值
    refundTransferForm.setFieldsValue({
      fromCourseId: courses.length > 0 ? courses[0].id : '',
      studentId: student.id,
      studentName: student.name,
      operationType: 'transfer', // 设置为转课
      transferClassHours: 1, // 默认转课课时为1
      priceDifference: 0,
    });

    setVisible(true);
  };

  // 处理转班
  const handleTransferClass = (student: Student) => {
    setCurrentStudent(student);
    refundTransferForm.resetFields();

    // 获取学生所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );

    // 设置初始值
    refundTransferForm.setFieldsValue({
      fromCourseId: courses.length > 0 ? courses[0].id : '',
      studentId: student.id,
      studentName: student.name,
      operationType: 'transferClass', // 设置为转班
      transferClassHours: 1, // 默认转班课时为1
      priceDifference: 0,
    });

    setVisible(true);
  };

  // 处理退费转课提交
  const handleRefundTransferOk = () => {
    refundTransferForm.validateFields()
      .then(values => {
        // 根据操作类型执行不同的逻辑
        if (values.operationType === 'refund') {
          // 退费逻辑
          message.success(`退费处理成功，实际退款金额: ¥${values.actualRefund}`);

          // 在实际应用中这里应该调用API更新数据库
          // 这里只是示例代码 - 可以更新currentStudent的状态等

          setVisible(false);
          setCurrentStudent(null);
          refundTransferForm.resetFields();
        } else if (values.operationType === 'transfer') {
          // 转课逻辑
          if (!selectedTransferStudent && !values.targetStudentId) {
            message.error('请选择要转课给哪个学员');
            return;
          }

          // 获取目标学员信息
          const targetStudentId = values.targetStudentId || selectedTransferStudent?.id;
          const targetStudent = students.find(s => s.id === targetStudentId);

          if (!targetStudent) {
            message.error('未找到目标学员信息');
            return;
          }

          // 获取课程信息
          const toCourse = courseOptions.find(c => c.value === values.toCourseId);
          const courseName = toCourse ? toCourse.label : '未知课程';

          const priceDifferenceInfo = values.priceDifference > 0 ?
            `，需补差价: ¥${values.priceDifference}` :
            (values.priceDifference < 0 ?
              `，退还差价: ¥${Math.abs(values.priceDifference)}` :
              '');

          message.success(`转课处理成功，课程转给: ${targetStudent.name}(${targetStudent.id})，课程: ${courseName}，课时: ${values.transferClassHours}${priceDifferenceInfo}`);

          // 在实际应用中这里应该调用API更新数据库
          // 这里只是示例代码

          setVisible(false);
          setCurrentStudent(null);
          setSelectedTransferStudent(null);
          refundTransferForm.resetFields();
        } else if (values.operationType === 'transferClass') {
          // 转班逻辑 - 同一学员换课程
          if (!currentStudent) {
            message.error('未找到学员信息');
            return;
          }

          // 获取课程信息
          const toCourse = courseOptions.find(c => c.value === values.toCourseId);
          const courseName = toCourse ? toCourse.label : '未知课程';

          const fromCourse = courseOptions.find(c => c.value === values.fromCourseId);
          const fromCourseName = fromCourse ? fromCourse.label : '未知课程';

          const priceDifferenceInfo = values.priceDifference > 0 ?
            `，需补差价: ¥${values.priceDifference}` :
            (values.priceDifference < 0 ?
              `，退还差价: ¥${Math.abs(values.priceDifference)}` :
              '');

          message.success(`转班处理成功，从 ${fromCourseName} 转到 ${courseName}${priceDifferenceInfo}`);

          // 在实际应用中这里应该调用API更新数据库
          // 这里只是示例代码

          setVisible(false);
          setCurrentStudent(null);
          refundTransferForm.resetFields();
        }
        // 在成功处理后，重置相关状态
        setVisible(false);
        setCurrentStudent(null);
        setSelectedTransferStudent(null);
        refundTransferForm.resetFields();
        setTransferStudentSearchResults([]);
        setTransferStudentSearchText('');
      })
      .catch(info => {
        console.log('Validate Failed:', info);
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