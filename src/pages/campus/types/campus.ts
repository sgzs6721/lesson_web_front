import { ReactNode } from 'react';

// 定义校区数据类型
export interface Campus {
  id: string | number;
  name: string;
  address: string;
  phone?: string;
  contactPerson?: string; // 非必填的联系人
  capacity?: number;
  area?: number; // 面积，单位：平方米
  facilities?: string[];
  image?: string;
  status: 'OPERATING' | 'CLOSED';
  openDate?: string;
  studentCount?: number;
  coachCount?: number;
  courseCount?: number;
  pendingLessonCount?: number;
  monthlyRent?: number; // 月租金
  propertyFee?: number; // 物业费
  utilityFee?: number; // 固定水电费
  createdTime?: string;
  updateTime?: string;
  managerName?: string;
  managerPhone?: string;
  editable?: boolean;
}

// 搜索参数类型
export interface CampusSearchParams {
  searchText: string;
  selectedStatus: string | undefined;
}

// 设施选项类型
export interface FacilityOption {
  value: string;
  label: string;
}