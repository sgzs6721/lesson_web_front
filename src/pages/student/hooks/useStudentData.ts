import { useState } from 'react';
import { Student, StudentSearchParams } from '@/pages/student/types/student';
import { mockStudents } from '@/pages/student/constants/mockData';
import dayjs from 'dayjs';
import { message } from 'antd';

export const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [total, setTotal] = useState(mockStudents.length);
  
  // 添加学员
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: `ST${100000 + Math.floor(Math.random() * 900000)}`,
    };
    
    const newStudents = [newStudent, ...students];
    setStudents(newStudents);
    setFilteredStudents(newStudents);
    setTotal(prev => prev + 1);
    message.success('学员添加成功');
    
    return newStudent;
  };
  
  // 更新学员
  const updateStudent = (id: string, updatedData: Partial<Student>) => {
    const newStudents = students.map(student => 
      student.id === id ? { ...student, ...updatedData } : student
    );
    
    setStudents(newStudents);
    setFilteredStudents(newStudents);
    message.success('学员信息已更新');
  };
  
  // 删除学员
  const deleteStudent = (id: string) => {
    const newStudents = students.filter(student => student.id !== id);
    setStudents(newStudents);
    setFilteredStudents(newStudents);
    setTotal(prev => prev - 1);
    message.success('学员已删除');
  };
  
  // 过滤学员数据
  const filterStudents = (params: StudentSearchParams) => {
    const { searchText, selectedStatus, selectedCourse, enrollMonth, sortOrder } = params;
    
    let filtered = students;
    
    // 按文本搜索
    if (searchText) {
      filtered = filtered.filter(
        student => 
          student.name.includes(searchText) || 
          student.id.includes(searchText) ||
          student.phone.includes(searchText)
      );
    }
    
    // 按状态过滤
    if (selectedStatus) {
      filtered = filtered.filter(student => student.status === selectedStatus);
    }
    
    // 按课程过滤
    if (selectedCourse) {
      filtered = filtered.filter(student => student.course === selectedCourse);
    }
    
    // 按报名月份过滤
    if (enrollMonth) {
      const year = enrollMonth.year();
      const month = enrollMonth.month() + 1;
      filtered = filtered.filter(student => {
        const studentDate = dayjs(student.enrollDate);
        return studentDate.year() === year && studentDate.month() + 1 === month;
      });
    }
    
    // 排序
    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        // 根据选择的排序类型进行排序
        switch(sortOrder) {
          case 'enrollDateAsc':
            return dayjs(a.enrollDate).unix() - dayjs(b.enrollDate).unix();
          case 'enrollDateDesc':
            return dayjs(b.enrollDate).unix() - dayjs(a.enrollDate).unix();
          case 'ageAsc':
            return a.age - b.age;
          case 'ageDesc':
            return b.age - a.age;
          case 'remainingClassesAsc': {
            const remainingA = parseInt(a.remainingClasses.split('/')[0], 10);
            const remainingB = parseInt(b.remainingClasses.split('/')[0], 10);
            return remainingA - remainingB;
          }
          case 'remainingClassesDesc': {
            const remainingA = parseInt(a.remainingClasses.split('/')[0], 10);
            const remainingB = parseInt(b.remainingClasses.split('/')[0], 10);
            return remainingB - remainingA;
         }
          case 'lastClassDateAsc': {
            if (!a.lastClassDate) return 1;
            if (!b.lastClassDate) return -1;
            return dayjs(a.lastClassDate).unix() - dayjs(b.lastClassDate).unix();
          }
          case 'lastClassDateDesc': {
            if (!a.lastClassDate) return 1;
            if (!b.lastClassDate) return -1;
            return dayjs(b.lastClassDate).unix() - dayjs(a.lastClassDate).unix();
          }
          default:
            return 0;
        }
      });
    }
    
    setFilteredStudents(filtered);
    setTotal(filtered.length);
    
    return filtered;
  };
  
  // 重置数据
  const resetData = () => {
    setFilteredStudents(students);
    setTotal(students.length);
  };
  
  return {
    students: filteredStudents,
    totalStudents: total,
    addStudent,
    updateStudent,
    deleteStudent,
    filterStudents,
    resetData
  };
}; 