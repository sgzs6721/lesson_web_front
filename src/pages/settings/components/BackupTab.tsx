import React from 'react';
import { Card, Button, Upload, Table, Space, Popconfirm, Typography } from 'antd';
import { DatabaseOutlined, UploadOutlined, DownloadOutlined, UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { IBackupItem } from '../types';

const { Title } = Typography;

interface IBackupTabProps {
  backupList: IBackupItem[];
  onCreateBackup: () => void;
  onRestoreBackup: (id: string) => void;
  onDeleteBackup: (id: string) => void;
  onDownloadBackup: (id: string) => void;
  onUploadBackup: (file: File) => void;
}

const BackupTab: React.FC<IBackupTabProps> = ({
  backupList,
  onCreateBackup,
  onRestoreBackup,
  onDeleteBackup,
  onDownloadBackup,
  onUploadBackup
}) => {
  const columns = [
    {
      title: '备份名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IBackupItem) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<DownloadOutlined />}
            onClick={() => onDownloadBackup(record.id)}
          >
            下载
          </Button>
          
          <Popconfirm
            title="确定要恢复此备份吗？"
            description="恢复此备份将覆盖当前数据。此操作无法撤销。"
            onConfirm={() => onRestoreBackup(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              size="small" 
              icon={<UndoOutlined />}
            >
              恢复
            </Button>
          </Popconfirm>
          
          <Popconfirm
            title="确定要删除此备份吗？"
            description="删除后将无法恢复。"
            onConfirm={() => onDeleteBackup(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const props = {
    name: 'file',
    beforeUpload: (file: File) => {
      onUploadBackup(file);
      return false;
    },
    showUploadList: false,
  };

  return (
    <>
      <Card className="settings-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title level={5}>数据备份与恢复</Title>
          <Space>
            <Button 
              type="primary" 
              icon={<DatabaseOutlined />}
              onClick={onCreateBackup}
            >
              创建备份
            </Button>
            
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>
                导入备份
              </Button>
            </Upload>
          </Space>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={backupList.map(item => ({ ...item, key: item.id }))} 
          className="backup-table"
          pagination={false}
          size="middle"
        />
      </Card>
    </>
  );
};

export default BackupTab;