import axios from 'axios';
import { Student } from '@/pages/student/types/student';

// API基础URL，实际项目中应从环境变量获取
const API_BASE_URL = '/api';

// 学生API路径
const STUDENTS_PATH = `${API_BASE_URL}/students`;

/**
 * 获取所有学生
 */
export const fetchStudents = async () => {
  try {
    const response = await axios.get(STUDENTS_PATH);
    return response.data;
  } catch (error) {
    console.error('获取学生数据失败:', error);
    throw error;
  }
};

/**
 * 获取单个学生
 * @param id 学生ID
 */
export const fetchStudentById = async (id: string) => {
  try {
    const response = await axios.get(`${STUDENTS_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`获取学生(ID: ${id})详情失败:`, error);
    throw error;
  }
};

/**
 * 添加学生
 * @param student 学生数据
 */
export const addStudent = async (student: Omit<Student, 'id'>) => {
  try {
    const response = await axios.post(STUDENTS_PATH, student);
    return response.data;
  } catch (error) {
    console.error('添加学生失败:', error);
    throw error;
  }
};

/**
 * 更新学生
 * @param id 学生ID
 * @param student 更新的学生数据
 */
export const updateStudent = async (id: string, student: Partial<Student>) => {
  try {
    const response = await axios.put(`${STUDENTS_PATH}/${id}`, student);
    return response.data;
  } catch (error) {
    console.error(`更新学生(ID: ${id})失败:`, error);
    throw error;
  }
};

/**
 * 删除学生
 * @param id 学生ID
 */
export const deleteStudent = async (id: string) => {
  try {
    const response = await axios.delete(`${STUDENTS_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`删除学生(ID: ${id})失败:`, error);
    throw error;
  }
};

/**
 * 获取学生课程记录
 * @param studentId 学生ID
 */
export const fetchStudentClassRecords = async (studentId: string) => {
  try {
    const response = await axios.get(`${STUDENTS_PATH}/${studentId}/class-records`);
    return response.data;
  } catch (error) {
    console.error(`获取学生(ID: ${studentId})课程记录失败:`, error);
    throw error;
  }
};

/**
 * 获取学生缴费记录
 * @param studentId 学生ID
 */
export const fetchStudentPaymentRecords = async (studentId: string) => {
  try {
    const response = await axios.get(`${STUDENTS_PATH}/${studentId}/payment-records`);
    return response.data;
  } catch (error) {
    console.error(`获取学生(ID: ${studentId})缴费记录失败:`, error);
    throw error;
  }
}; 