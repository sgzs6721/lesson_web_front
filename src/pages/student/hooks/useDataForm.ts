import { useStudentData } from './useStudentData';
import { useStudentSearch } from './useStudentSearch';
import { useStudentForm } from './useStudentForm';
import { Student } from '../types/student';

/**
 * 数据和表单相关钩子的整合
 * @returns 整合的数据和表单相关状态和函数
 */
export const useDataForm = () => {
  // 数据管理钩子
  const dataProps = useStudentData();
  
  // 搜索功能钩子
  const searchProps = useStudentSearch(dataProps.filterStudents);
  
  // 表单管理钩子
  const formProps = useStudentForm(dataProps.addStudent, dataProps.updateStudent);

  // 包装handleSubmit以符合 StudentFormModal 的 onSubmit 类型 (Promise<boolean>)
  const handleSubmit = async (): Promise<boolean> => {
    // useStudentForm 的 handleSubmit 已经返回 Promise<boolean>
    return await formProps.handleSubmit(); 
  };
  
  return {
    // 数据相关
    data: {
      students: dataProps.students,
      totalStudents: dataProps.totalStudents,
      loading: formProps.loading,
      deleteStudent: dataProps.deleteStudent,
      addStudent: dataProps.addStudent
    },
    
    // 搜索相关
    search: {
      params: searchProps.searchParams,
      setSearchText: searchProps.setSearchText,
      setSelectedStatus: searchProps.setSelectedStatus,
      setSelectedCourse: searchProps.setSelectedCourse,
      setEnrollMonth: searchProps.setEnrollMonth,
      setSortOrder: searchProps.setSortOrder,
      handleSearch: searchProps.handleSearch,
      handleReset: searchProps.handleReset
    },
    
    // 表单相关
    form: {
      formInstance: formProps.form,
      visible: formProps.visible,
      editingStudent: formProps.editingStudent,
      courseGroups: formProps.courseGroups,
      tempCourseGroup: formProps.tempCourseGroup,
      currentEditingGroupIndex: formProps.currentEditingGroupIndex,
      isEditing: formProps.isEditing,
      showAddModal: formProps.showAddModal,
      showEditModal: formProps.showEditModal,
      handleSubmit,
      handleCancel: formProps.handleCancel,
      updateTempCourseGroup: formProps.updateTempCourseGroup,
      updateCourseGroup: formProps.updateCourseGroup,
      confirmAddCourseGroup: formProps.confirmAddCourseGroup,
      cancelAddCourseGroup: formProps.cancelAddCourseGroup,
      editCourseGroup: formProps.editCourseGroup,
      removeCourseGroup: formProps.removeCourseGroup,
      startAddCourseGroup: formProps.startAddCourseGroup
    }
  };
}; 