import { auth } from './auth';
import { student } from './student';
import { course } from './course';
import { institution } from './institution';
import { campus } from './campus';
import { user } from './user';
import { coach } from './coach';
import { constants } from './constants';
import { schedule } from './schedule';
import { payment } from './payment';
import { financeAPI } from './finance';
import {
  studentAnalysisApi,
  courseAnalysisApi,
  coachAnalysisApi,
  financeAnalysisApi,
  statisticsApi
} from './statistics';

// 导出所有接口
export const API = {
  auth,
  student,
  course,
  institution,
  campus,
  user,
  coach,
  constants,
  schedule,
  payment,
  finance: financeAPI,
  statistics: {
    student: studentAnalysisApi,
    course: courseAnalysisApi,
    coach: coachAnalysisApi,
    finance: financeAnalysisApi,
    general: statisticsApi
  }
};