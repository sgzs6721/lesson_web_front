import { useStudentData } from './useStudentData';
import { useStudentSearch } from './useStudentSearch';
import { useStudentForm } from './useStudentForm';
import { SimpleCourse } from '@/api/course/types';
import { Student } from '@/api/student/types';

/**
 * 数据和表单相关钩子的整合
 * @param courseList - Pass the course list from the parent component
 * @param createStudentApiFunc - The actual API function to create a student with course
 * @returns 整合的数据和表单相关状态和函数
 */
export const useDataForm = (
  courseList: SimpleCourse[],
  createStudentApiFunc: (payload: { studentInfo: any; courseInfo: any }) => Promise<Student>
) => {
  const dataProps = useStudentData();
  const searchProps = useStudentSearch(dataProps.filterStudents);
  const formProps = useStudentForm(
    createStudentApiFunc,
    dataProps.updateStudent,
    courseList
  );

  const handleSubmit = async (): Promise<boolean> => {
    return await formProps.handleSubmit();
  };

  return {
    data: {
      students: dataProps.students,
      totalStudents: dataProps.totalStudents,
      loading: dataProps.loading,
      deleteStudent: dataProps.deleteStudent,
      updateStudent: dataProps.updateStudent,
      fetchStudents: dataProps.fetchStudents,
      addNewStudentToList: dataProps.addNewStudentToList,
      updateStudentAttendanceLocally: dataProps.updateStudentAttendanceLocally
    },
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
    form: {
      ...formProps,
      handleSubmit: formProps.handleSubmit
    }
  };
};