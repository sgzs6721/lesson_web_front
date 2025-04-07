import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import ScheduleControls from './components/ScheduleControls';
import ScheduleGrid from './components/ScheduleGrid';
import ScheduleLegend from './components/ScheduleLegend';
import ScheduleChangeModal from './components/ScheduleChangeModal';
import { Coach, CourseType, ScheduleCell, Student, ScheduleChange } from './types/schedule';
import './schedule.css';

// 模拟数据
const mockCoaches: Coach[] = [
  { id: 'li', name: '李教练', color: '#e74c3c' },
  { id: 'wang', name: '王教练', color: '#3498db' },
  { id: 'zhang', name: '张教练', color: '#2ecc71' },
  { id: 'liu', name: '刘教练', color: '#f39c12' },
];

const mockCourseTypes: CourseType[] = [
  { id: 'dance', name: '舞蹈课', color: '#e74c3c' },
  { id: 'yoga', name: '瑜伽课', color: '#2ecc71' },
  { id: 'fitness', name: '健身课', color: '#f39c12' },
];

const mockStudents: Student[] = [
  { id: '1', name: '张小明', remainingClasses: 12, totalClasses: 24, pricePerClass: 200, courseTypeName: '舞蹈课', courseName: '少儿街舞' },
  { id: '2', name: '李华', remainingClasses: 15, totalClasses: 30, pricePerClass: 180, courseTypeName: '舞蹈课', courseName: '少儿街舞' },
  { id: '3', name: '王芳', remainingClasses: 8, totalClasses: 20, pricePerClass: 150, courseTypeName: '健身课', courseName: '有氧训练' },
  { id: '4', name: '赵强', remainingClasses: 10, totalClasses: 20, pricePerClass: 160, courseTypeName: '健身课', courseName: '有氧训练' },
  { id: '5', name: '陈丽', remainingClasses: 18, totalClasses: 36, pricePerClass: 190, courseTypeName: '健身课', courseName: '力量训练' },
  { id: '6', name: '孙红', remainingClasses: 14, totalClasses: 28, pricePerClass: 170, courseTypeName: '瑜伽课', courseName: '高温瑜伽' },
  { id: '7', name: '周杰', remainingClasses: 9, totalClasses: 18, pricePerClass: 200, courseTypeName: '瑜伽课', courseName: '高温瑜伽' },
  { id: '8', name: '吴敏', remainingClasses: 20, totalClasses: 40, pricePerClass: 180, courseTypeName: '健身课', courseName: '私教课程' },
  { id: '9', name: '刘洋', remainingClasses: 16, totalClasses: 32, pricePerClass: 190, courseTypeName: '瑜伽课', courseName: '初级瑜伽' },
];

const ScheduleView: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<string[]>([]);
  const [selectedCourseType, setSelectedCourseType] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [scheduleCells, setScheduleCells] = useState<ScheduleCell[]>([]);
  const [initialState, setInitialState] = useState<{ [key: string]: string }>({});
  const [changes, setChanges] = useState<ScheduleChange[]>([]);
  const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);
  const [filteredCells, setFilteredCells] = useState<ScheduleCell[]>([]);

  useEffect(() => {
    // 初始化课表数据
    const initialCells: ScheduleCell[] = [];
    const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const timeSlots = ['9:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];

    timeSlots.forEach(timeSlot => {
      weekdays.forEach(weekday => {
        // 为每个单元格随机选择学生
        const coachId = mockCoaches[Math.floor(Math.random() * mockCoaches.length)].id;
        const cellStudents = mockStudents
          .slice(0, Math.floor(Math.random() * 3) + 1)
          .map(student => ({ ...student })); // 创建学生对象的副本
          
        const cell: ScheduleCell = {
          id: `${timeSlot}-${weekday}`,
          coachId,
          students: cellStudents,
          timeSlot,
          weekday,
        };
        
        // 应用学生分组逻辑
        initialCells.push(cell);
      });
    });
    
    // 为每个单元格应用分组逻辑
    initialCells.forEach(cell => {
      reorganizeGroups(cell);
    });

    setScheduleCells(initialCells);
    setFilteredCells(initialCells);
  }, []);

  // 当选择的教练或课程类型变化时，过滤课表
  useEffect(() => {
    let filtered = [...scheduleCells];
    
    // 按教练过滤
    if (selectedCoach.length > 0) {
      filtered = filtered.map(cell => ({
        ...cell,
        students: selectedCoach.includes(cell.coachId) ? cell.students : []
      }));
    }
    
    // 按课程类型过滤
    if (selectedCourseType.length > 0) {
      const courseTypeNames = selectedCourseType.map(typeId => 
        mockCourseTypes.find(ct => ct.id === typeId)?.name
      ).filter(Boolean) as string[];
      
      filtered = filtered.map(cell => {
        // 先保留当前单元格中所有学生
        const cellStudents = [...cell.students];
        
        // 如果指定了课程类型，则只保留符合任一类型的学生
        return {
          ...cell,
          students: cellStudents.filter(student => 
            student.courseTypeName && courseTypeNames.includes(student.courseTypeName)
          )
        };
      });
    }
    
    // 按具体课程名称过滤
    if (selectedType.length > 0) {
      const courseNameMap: {[key: string]: string} = {
        'type1': '少儿街舞',
        'type2': '有氧训练',
        'type3': '力量训练',
        'type4': '高温瑜伽',
        'type5': '初级瑜伽',
        'type6': '私教课程'
      };
      
      const courseNames = selectedType.map(typeId => courseNameMap[typeId]).filter(Boolean);
      
      filtered = filtered.map(cell => ({
        ...cell,
        students: cell.students.filter(student => 
          student.courseName && courseNames.includes(student.courseName)
        )
      }));
    }
    
    setFilteredCells(filtered);
  }, [selectedCoach, selectedCourseType, selectedType, scheduleCells]);

  const handleEditModeToggle = () => {
    if (!isEditMode) {
      // 进入编辑模式时保存初始状态
      const state: { [key: string]: string } = {};
      scheduleCells.forEach(cell => {
        state[cell.id] = JSON.stringify(cell.students);
      });
      setInitialState(state);
    }
    setIsEditMode(!isEditMode);
  };

  const handleDragStart = (e: React.DragEvent, student: Student, cellId: string) => {
    // 防止在非编辑模式下进行拖动
    if (!isEditMode) return;
    
    const groupId = student.groupId;
    
    // 如果学生有分组ID，将该分组中的所有学生信息传递
    if (groupId) {
      const cell = scheduleCells.find(c => c.id === cellId);
      if (cell) {
        const groupStudents = cell.students.filter(s => s.groupId === groupId);
        e.dataTransfer.setData('students', JSON.stringify(groupStudents));
        e.dataTransfer.setData('sourceCellId', cellId);
        e.dataTransfer.setData('isGroup', 'true');
        
        // 添加视觉效果
        const dragIcon = document.createElement('div');
        dragIcon.className = 'drag-ghost';
        dragIcon.innerHTML = `<span>拖动 ${groupStudents.length} 名学生</span>`;
        document.body.appendChild(dragIcon);
        e.dataTransfer.setDragImage(dragIcon, 0, 0);
        setTimeout(() => document.body.removeChild(dragIcon), 0);
        return;
      }
    }
    
    // 单个学生的情况
    e.dataTransfer.setData('student', JSON.stringify(student));
    e.dataTransfer.setData('sourceCellId', cellId);
    e.dataTransfer.setData('isGroup', 'false');
  };

  const handleDragOver = (e: React.DragEvent, cellId: string) => {
    // 防止在非编辑模式下响应拖动
    if (!isEditMode) return;
    
    e.preventDefault();
    const cell = document.querySelector(`[data-cell-id="${cellId}"]`);
    if (cell) {
      cell.classList.add('drop-target');
    }
  };

  const handleDrop = (e: React.DragEvent, targetCellId: string) => {
    // 防止在非编辑模式下响应拖动
    if (!isEditMode) return;
    
    e.preventDefault();
    // 移除所有目标样式
    document.querySelectorAll('.drop-target').forEach(el => {
      el.classList.remove('drop-target');
    });
    
    const sourceCellId = e.dataTransfer.getData('sourceCellId');
    if (!sourceCellId) return; // 确保有有效的源单元格ID
    
    const isGroup = e.dataTransfer.getData('isGroup') === 'true';

    setScheduleCells(prevCells => {
      const newCells = [...prevCells];
      const sourceCell = newCells.find(c => c.id === sourceCellId);
      const targetCell = newCells.find(c => c.id === targetCellId);

      if (sourceCell && targetCell) {
        if (isGroup) {
          // 处理分组拖动
          const groupStudentsData = e.dataTransfer.getData('students');
          if (groupStudentsData) {
            const groupStudents = JSON.parse(groupStudentsData);
            const studentIds = groupStudents.map((s: Student) => s.id);
            
            // 从源单元格移除学生
            sourceCell.students = sourceCell.students.filter(s => !studentIds.includes(s.id));
            
            // 添加到目标单元格
            targetCell.students = [...targetCell.students, ...groupStudents];
          }
        } else {
          // 处理单个学生拖动
          const studentData = e.dataTransfer.getData('student');
          if (studentData) {
            const student = JSON.parse(studentData);
            sourceCell.students = sourceCell.students.filter(s => s.id !== student.id);
            targetCell.students = [...targetCell.students, student];
          }
        }
        
        // 拖放完成后重新组织目标单元格中的学生分组
        reorganizeGroups(targetCell);
      }

      return newCells;
    });
  };
  
  // 重新组织单元格中的学生分组
  const reorganizeGroups = (cell: ScheduleCell) => {
    // 按课程类型和课程名称进行分组
    const groupsMap: { [key: string]: Student[] } = {};
    
    // 先清除现有的分组ID
    cell.students.forEach(student => {
      // 创建组合键: 教练ID + 课程类型 + 课程名称
      const groupKey = `${cell.coachId}_${student.courseTypeName || ''}_${student.courseName || ''}`;
      
      if (!groupsMap[groupKey]) {
        groupsMap[groupKey] = [];
      }
      
      groupsMap[groupKey].push({
        ...student,
        groupId: undefined // 暂时清除原有的groupId
      });
    });
    
    // 创建新的分组ID并应用
    const newStudents: Student[] = [];
    Object.entries(groupsMap).forEach(([groupKey, students]) => {
      // 只有超过1个学生的才需要分组
      if (students.length > 1) {
        const newGroupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        students.forEach(student => {
          newStudents.push({
            ...student,
            groupId: newGroupId
          });
        });
      } else {
        // 单个学生不需要分组
        newStudents.push(students[0]);
      }
    });
    
    // 更新单元格中的学生列表
    cell.students = newStudents;
  };

  const handleFinishEdit = () => {
    // 收集变更信息
    const newChanges: ScheduleChange[] = [];
    scheduleCells.forEach(cell => {
      const initialStudents = JSON.parse(initialState[cell.id] || '[]');
      const currentStudents = cell.students;
      
      if (JSON.stringify(initialStudents) !== JSON.stringify(currentStudents)) {
        newChanges.push({
          timeSlot: cell.timeSlot,
          weekday: cell.weekday,
          before: initialStudents.map((s: Student) => s.name),
          after: currentStudents.map(s => s.name),
        });
      }
    });

    setChanges(newChanges);
    setIsChangeModalVisible(true);
  };

  const handleChangeConfirm = () => {
    message.success('课表更新已保存');
    setIsChangeModalVisible(false);
    setIsEditMode(false);
  };

  const handleChangeCancel = () => {
    setIsChangeModalVisible(false);
    // 恢复初始状态
    setScheduleCells(prevCells => {
      return prevCells.map(cell => ({
        ...cell,
        students: JSON.parse(initialState[cell.id] || '[]'),
      }));
    });
    setIsEditMode(false);
  };

  return (
    <div className="schedule-view-container">
      <div className="page-header">
        <div className="page-title">固定课表</div>
      </div>

      <Card>
        <div className="filter-and-actions">
          <ScheduleControls
            coaches={mockCoaches}
            courseTypes={mockCourseTypes}
            selectedCoach={selectedCoach}
            selectedCourseType={selectedCourseType}
            selectedType={selectedType}
            onCoachChange={setSelectedCoach}
            onCourseTypeChange={setSelectedCourseType}
            onTypeChange={setSelectedType}
          />
          <div className="action-buttons">
            <Button
              type={isEditMode ? 'default' : 'primary'}
              icon={isEditMode ? <CheckOutlined /> : <EditOutlined />}
              onClick={isEditMode ? handleFinishEdit : handleEditModeToggle}
            >
              {isEditMode ? '完成' : '编辑'}
            </Button>
          </div>
        </div>

        <ScheduleLegend
          coaches={mockCoaches}
          selectedCoach={selectedCoach}
          onCoachChange={setSelectedCoach}
        />

        <div className="schedule-container">
          <ScheduleGrid
            cells={filteredCells}
            isEditMode={isEditMode}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>
      </Card>

      <ScheduleChangeModal
        visible={isChangeModalVisible}
        changes={changes}
        onConfirm={handleChangeConfirm}
        onCancel={handleChangeCancel}
      />
    </div>
  );
};

export default ScheduleView; 