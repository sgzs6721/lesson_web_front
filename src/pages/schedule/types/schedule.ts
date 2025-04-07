export interface Coach {
  id: string;
  name: string;
  color: string;
}

export interface CourseType {
  id: string;
  name: string;
  color: string;
}

export interface Student {
  id: string;
  name: string;
  remainingClasses: number;
  totalClasses: number;
  pricePerClass: number;
  courseTypeName?: string;
  courseName?: string;
  groupId?: string;
}

export interface StudentGroup {
  id: string;
  coachId: string;
  courseType: string;
  courseName: string;
  students: Student[];
}

export interface ScheduleCell {
  id: string;
  coachId: string;
  students: Student[];
  timeSlot: string;
  weekday: string;
}

export interface ScheduleChange {
  timeSlot: string;
  weekday: string;
  before: string[];
  after: string[];
}

export interface ScheduleState {
  [key: string]: string;
} 