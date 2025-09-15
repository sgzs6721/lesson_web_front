import React, { useState, useEffect } from 'react';
import { Modal, List, Checkbox, Button, Typography, Card, Tag, message } from 'antd';
import { Student, CourseInfo } from '../types/student';

const { Text, Title } = Typography;

interface ShareManagementModalProps {
  visible: boolean;
  student: Student | null;
  onCancel: () => void;
  onOk: (selectedSharingIds: number[]) => void;
  loading?: boolean;
}

const ShareManagementModal: React.FC<ShareManagementModalProps> = ({
  visible,
  student,
  onCancel,
  onOk,
  loading = false
}) => {
  const [selectedSharingIds, setSelectedSharingIds] = useState<number[]>([]);

  // 重置选中状态当模态框打开时
  useEffect(() => {
    if (visible) {
      setSelectedSharingIds([]);
    }
  }, [visible]);

  // 获取源课程信息
  const getSourceCourses = () => {
    if (!student || !student.courses) {
      return [];
    }

    const sourceCourses: Array<{
      courseName: string;
      courseTypeName: string;
      sharingCount: number;
    }> = [];

    student.courses.forEach(course => {
      if (course.sharingInfoList && course.sharingInfoList.length > 0) {
        sourceCourses.push({
          courseName: course.courseName,
          courseTypeName: course.courseTypeName || '标准课程',
          sharingCount: course.sharingInfoList.length
        });
      }
    });

    return sourceCourses;
  };

  // 获取所有共享课程信息
  const getAllSharingInfo = () => {
    if (!student || !student.courses) {
      return [];
    }

    const allSharingInfo: Array<{
      id: number;
      targetCourseName: string;
      coachName: string;
      courseTypeName: string;
    }> = [];

    student.courses.forEach(course => {
      if (course.sharingInfoList && course.sharingInfoList.length > 0) {
        course.sharingInfoList.forEach(sharing => {
          allSharingInfo.push({
            id: sharing.targetCourseId, // 使用targetCourseId作为唯一标识
            targetCourseName: sharing.targetCourseName,
            coachName: sharing.coachName,
            courseTypeName: course.courseTypeName || '标准课程'
          });
        });
      }
    });

    return allSharingInfo;
  };

  const sourceCourses = getSourceCourses();
  const sharingInfoList = getAllSharingInfo();

  const handleCheckboxChange = (sharingId: number, checked: boolean) => {
    if (checked) {
      setSelectedSharingIds(prev => [...prev, sharingId]);
    } else {
      setSelectedSharingIds(prev => prev.filter(id => id !== sharingId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSharingIds(sharingInfoList.map(item => item.id));
    } else {
      setSelectedSharingIds([]);
    }
  };

  const handleRemoveSelected = () => {
    if (selectedSharingIds.length === 0) {
      message.warning('请先选择要取消共享的课程');
      return;
    }
    onOk(selectedSharingIds);
  };

  return (
    <Modal
      title={<span style={{ fontSize: '20px', fontWeight: '600' }}>共享课程管理</span>}
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="remove"
          type="primary"
          danger
          onClick={handleRemoveSelected}
          disabled={selectedSharingIds.length === 0}
          loading={loading}
        >
          取消共享 ({selectedSharingIds.length})
        </Button>
      ]}
    >
      {student && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Title level={5} style={{ margin: 0 }}>
              学员：{student.name} (ID: {student.id})
            </Title>
          </div>

          {sharingInfoList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              该学员暂无共享课程
            </div>
          ) : (
            <div>
              {/* 源课程信息区域 */}
              <div style={{ 
                marginBottom: '20px', 
                padding: '12px 16px', 
                backgroundColor: '#f6ffed', 
                borderRadius: '8px',
                border: '1px solid #b7eb8f'
              }}>
                <Text strong style={{ fontSize: '14px', color: '#52c41a', marginBottom: '8px', display: 'block' }}>
                  源课程信息：
                </Text>
                {sourceCourses.map((source, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: index < sourceCourses.length - 1 ? '4px' : '0'
                  }}>
                    <Tag color="green" style={{ borderRadius: '4px' }}>
                      {source.courseTypeName}
                    </Tag>
                    <Text style={{ fontSize: '14px', color: '#52c41a' }}>
                      {source.courseName}
                    </Text>
                    <Text style={{ fontSize: '12px', color: '#999' }}>
                      (共享出 {source.sharingCount} 个课程)
                    </Text>
                  </div>
                ))}
              </div>

              {/* 全选区域 */}
              <div style={{ 
                marginBottom: '12px', 
                padding: '8px 12px', 
                backgroundColor: '#f0f9ff', 
                borderRadius: '6px',
                border: '1px solid #91d5ff'
              }}>
                <Checkbox
                  checked={selectedSharingIds.length === sharingInfoList.length && sharingInfoList.length > 0}
                  indeterminate={selectedSharingIds.length > 0 && selectedSharingIds.length < sharingInfoList.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  <Text strong>全选 ({sharingInfoList.length} 个共享课程)</Text>
                </Checkbox>
              </div>

              {/* 共享课程列表 */}
              <List
                dataSource={sharingInfoList}
                renderItem={(item) => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <Card
                      size="small"
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: selectedSharingIds.includes(item.id) 
                          ? '2px solid #ff4d4f' 
                          : '1px solid #f0f0f0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Checkbox
                          checked={selectedSharingIds.includes(item.id)}
                          onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                        />
                        
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Tag color="blue" style={{ borderRadius: '4px' }}>
                            {item.courseTypeName}
                          </Tag>
                          <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                            {item.targetCourseName}
                          </Text>
                          <Text style={{ fontSize: '14px', color: '#666' }}>
                            教练：{item.coachName}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ShareManagementModal;
