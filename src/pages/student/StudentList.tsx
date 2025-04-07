import React, { useState } from 'react';
import { Card, Typography, Row, Col, Button, Modal } from 'antd';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import StudentSearchBar from './components/StudentSearchBar';
import StudentTable from './components/StudentTable';
import StudentFormModal from './components/StudentFormModal';
import StudentDeleteModal from './components/StudentDeleteModal';
import { useStudentData } from './hooks/useStudentData';
import { useStudentSearch } from './hooks/useStudentSearch';
import { useStudentForm } from './hooks/useStudentForm';
import { Student } from '@/pages/student/types/student';
import { exportToCSV } from './utils/exportData';
import './student.css';

const { Title } = Typography;

const StudentList: React.FC = () => {
  // 使用数据管理钩子
  const {
    students,
    totalStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    filterStudents,
    resetData
  } = useStudentData();
  
  // 使用搜索功能钩子
  const {
    searchParams,
    setSearchText,
    setSelectedStatus,
    setSelectedCourse,
    setEnrollMonth,
    setSortOrder,
    handleSearch,
    handleReset
  } = useStudentSearch(filterStudents);
  
  // 使用表单管理钩子
  const {
    form,
    visible,
    loading,
    editingStudent,
    courseGroups,
    tempCourseGroup,
    currentEditingGroupIndex,
    isEditing,
    showAddModal,
    showEditModal,
    handleSubmit,
    handleCancel,
    updateTempCourseGroup,
    updateCourseGroup,
    confirmAddCourseGroup,
    cancelAddCourseGroup,
    editCourseGroup,
    removeCourseGroup,
    startAddCourseGroup
  } = useStudentForm(addStudent, updateStudent);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // 删除确认模态框状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  // 课程记录模态框状态
  const [classRecordModalVisible, setClassRecordModalVisible] = useState(false);
  const [currentViewingStudent, setCurrentViewingStudent] = useState<Student | null>(null);
  
  // 处理分页变化
  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };
  
  // 处理删除确认
  const showDeleteConfirm = (id: string) => {
    setRecordToDelete(id);
    setDeleteModalVisible(true);
  };
  
  // 执行删除
  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      deleteStudent(recordToDelete);
      setDeleteModalVisible(false);
      setRecordToDelete(null);
    }
  };
  
  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  
  // 显示课程记录模态框
  const showClassRecordModal = (student: Student) => {
    setCurrentViewingStudent(student);
    setClassRecordModalVisible(true);
    // 在实际应用中，这里可能需要加载课程记录
  };

  // 处理缴费
  const handlePayment = (student: Student) => {
    Modal.info({
      title: '功能提示',
      content: '缴费功能需配合后台接口调用，暂未实现。',
    });
  };

  // 处理退费
  const handleRefund = (student: Student) => {
    Modal.info({
      title: '功能提示',
      content: '退费功能需配合后台接口调用，暂未实现。',
    });
  };

  // 处理转课
  const handleTransfer = (student: Student) => {
    Modal.info({
      title: '功能提示',
      content: '转课功能需配合后台接口调用，暂未实现。',
    });
  };

  // 处理转班
  const handleTransferClass = (student: Student) => {
    Modal.info({
      title: '功能提示',
      content: '转班功能需配合后台接口调用，暂未实现。',
    });
  };
  
  return (
    <div className="student-list-container">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>学员管理</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
            style={{ marginRight: 8 }}
          >
            添加学员
          </Button>
          {/* <Button 
            icon={<ExportOutlined />} 
            onClick={() => exportToCSV(students)}
          >
            导出
          </Button> */}
        </Col>
      </Row>
      
      <Card>
        {/* 搜索栏 */}
        <StudentSearchBar
          params={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          onExport={() => exportToCSV(students)}
          onTextChange={setSearchText}
          onStatusChange={setSelectedStatus}
          onCourseChange={setSelectedCourse}
          onMonthChange={setEnrollMonth}
          onSortOrderChange={setSortOrder}
        />
        
        {/* 数据表格 */}
        <StudentTable
          data={students}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalStudents,
            onChange: handlePaginationChange,
          }}
          onEdit={showEditModal}
          onClassRecord={showClassRecordModal}
          onPayment={handlePayment}
          onRefund={handleRefund}
          onTransfer={handleTransfer}
          onTransferClass={handleTransferClass}
          onDelete={showDeleteConfirm}
        />
      </Card>
      
      {/* 添加/编辑模态框 */}
      <StudentFormModal
        visible={visible}
        form={form}
        editingStudent={editingStudent}
        courseGroups={courseGroups}
        tempCourseGroup={tempCourseGroup}
        currentEditingGroupIndex={currentEditingGroupIndex}
        isEditing={isEditing}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        updateTempCourseGroup={updateTempCourseGroup}
        updateCourseGroup={updateCourseGroup}
        confirmAddCourseGroup={confirmAddCourseGroup}
        cancelAddCourseGroup={cancelAddCourseGroup}
        editCourseGroup={editCourseGroup}
        removeCourseGroup={removeCourseGroup}
        startAddCourseGroup={startAddCourseGroup}
      />
      
      {/* 删除确认模态框 */}
      <StudentDeleteModal
        visible={deleteModalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default StudentList; 