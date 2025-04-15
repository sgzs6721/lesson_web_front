import React from 'react';
import { Card, Table, Typography, Button, Space, Tag } from 'antd';
import { BuildOutlined, PlusOutlined } from '@ant-design/icons';
import { Campus } from '@/api/campus/types';
import { useNavigate } from '@/router/hooks';

const { Title } = Typography;

interface CampusListProps {
  campusList: Campus[];
  total: number;
}

const CampusList: React.FC<CampusListProps> = ({ campusList, total }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: '校区名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>{text}</span>
      ),
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'OPERATING' ? 'green' : 'red'}>
          {status === 'OPERATING' ? '营业中' : '已关闭'}
        </Tag>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '学员人数',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (count: number) => <span>{count || 0}</span>,
    },
    {
      title: '教练人数',
      dataIndex: 'coachCount',
      key: 'coachCount',
      render: (count: number) => <span>{count || 0}</span>,
    },
    {
      title: '课程数量',
      dataIndex: 'courseCount',
      key: 'courseCount',
      render: (count: number) => <span>{count || 0}</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Campus) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => handleViewCampus(String(record.id))}>
            查看
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewCampus = (id: string) => {
    navigate(`/campuses?id=${id}`);
  };

  const navigateToCampusManagement = () => {
    navigate('/campuses');
  };

  return (
    <Card
      className="dashboard-card"
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            <BuildOutlined style={{ marginRight: 8 }} />
            校区列表
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={navigateToCampusManagement}
          >
            添加校区
          </Button>
        </div>
      }
      style={{ marginBottom: 24 }}
    >
      {campusList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p>暂无校区信息</p>
          <Button type="primary" onClick={navigateToCampusManagement}>
            前往添加校区
          </Button>
        </div>
      ) : (
        <Table
          dataSource={campusList}
          columns={columns}
          rowKey="id"
          pagination={{
            total: total,
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (t) => `共 ${t} 个校区`
          }}
          size="small"
        />
      )}
    </Card>
  );
};

export default CampusList;