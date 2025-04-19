import React from 'react';
import { List, Card, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Course } from '../types/course';
import dayjs from 'dayjs';
import { categoryOptions, coachOptions } from '../constants/courseOptions';
import { renderStatusTag } from '../constants/tableColumns';

const { Paragraph } = Typography;

interface CourseCardListProps {
  data: Course[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onEdit: (record: Course) => void;
  onDelete: (id: string, name: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

const CourseCardList: React.FC<CourseCardListProps> = ({
  data,
  loading,
  currentPage,
  pageSize,
  total,
  onEdit,
  onDelete,
  onPageChange
}) => {
  // 获取课程分类名称
  const getCategoryName = (categoryId: string) => {
    const category = categoryOptions.find(c => c.value === categoryId);
    return category ? category.label : categoryId;
  };

  // 获取教练名称
  const getCoachNames = (coachIds: string[]) => {
    if (!coachIds || coachIds.length === 0) return '';
    // 只取第一个教练
    const id = coachIds[0];
    const coach = coachOptions.find(c => c.value === id);
    return coach ? coach.label : id;
  };

  return (
    <>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 4
        }}
        dataSource={data}
        loading={loading}
        pagination={total > 0 ? {
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`,
          onChange: onPageChange,
          locale: {
            items_per_page: '条/页',
            jump_to: '跳至',
            jump_to_confirm: '确定',
            page: '页',
            prev_page: '上一页',
            next_page: '下一页',
            prev_5: '向前 5 页',
            next_5: '向后 5 页',
            prev_3: '向前 3 页',
            next_3: '向后 3 页'
          }
        } : false}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              style={{ height: 280 }}
              actions={[
                <EditOutlined key="edit" style={{ color: '#1890ff' }} onClick={() => onEdit(item)} />,
                <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} onClick={() => onDelete(item.id, item.name)} />
              ]}
            >
              <Card.Meta
                title={<div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
                  <span>{item.name}</span>
                </div>}
                description={
                  <div style={{ height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'auto' }}>
                    <div>
                      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          <Tag color="blue" style={{ padding: '0 8px', fontSize: '12px', lineHeight: '20px', height: '20px' }}>{getCategoryName(item.category)}</Tag>
                          <Tag color="purple" style={{ padding: '0 8px', fontSize: '12px', lineHeight: '20px', height: '20px' }}>{getCoachNames(item.coaches)}</Tag>
                        </div>
                        {renderStatusTag(item.status)}
                      </div>
                      <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 12, paddingBottom: 8 }}></div>
                      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 'bold', flex: 1 }}>总课时：</div>
                        <div style={{ width: '70px', textAlign: 'right' }}>{item.totalHours}小时</div>
                      </div>
                      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 'bold', flex: 1 }}>已销课时：</div>
                        <div style={{ width: '70px', textAlign: 'right' }}>{item.consumedHours}小时</div>
                      </div>
                      {item.unitPrice && (
                        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ fontWeight: 'bold', flex: 1 }}>教练课筹单价：</div>
                          <div style={{ width: '70px', textAlign: 'right' }}>¥{item.unitPrice}</div>
                        </div>
                      )}
                      {item.description && (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 'bold', display: 'block' }}>课程描述：</div>
                          <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 4 }}>{item.description}</Paragraph>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', fontSize: '12px', borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 8 }}><span style={{ fontWeight: 'bold' }}>更新时间:</span> {dayjs(item.updatedAt).format('YYYY-MM-DD')}</div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

export default CourseCardList;