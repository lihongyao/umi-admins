import { apiUser } from '@/api/apiServer';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { App, Avatar, Button, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';

const Users: React.FC = () => {
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  // -- state
  const [tips, setTips] = useState('');

  // -- columns
  const columns: ProColumns<API.UserProps>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },
    {
      title: '用户头像',
      dataIndex: 'avatarUrl',
      search: false,
      render: (_, { avatarUrl }) => (
        <Avatar src={avatarUrl} size={50} shape={'square'} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: '已启用', status: 'Processing' },
        1: { text: '已禁用', status: 'Error' },
      },
    },
    { title: '用户昵称', dataIndex: 'nickname' },
    { title: '联系电话', dataIndex: 'phone', copyable: true },
    { title: '注册时间', dataIndex: 'createTime', search: false },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      width: 100,
      render: (_, record) => (
        <Space>
          {record.status === 0 && (
            <Popconfirm title={'确定启用？'}>
              <Button>启用</Button>
            </Popconfirm>
          )}
          {record.status === 1 && (
            <Popconfirm title={'确定禁用？'}>
              <Button danger>禁用</Button>
            </Popconfirm>
          )}
          <Popconfirm title={'确定删除？'}>
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // -- renders
  return (
    <PageContainer>
      <ProTable<API.UserProps>
        actionRef={vTable}
        columns={columns}
        rowKey="id"
        options={false}
        search={{ span: 6, labelWidth: 'auto' }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          hideOnSinglePage: true,
          style: { paddingBottom: 16 },
        }}
        postData={(data: Array<API.UserProps>) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params) => {
          const resp = await apiUser.list(params);
          return Promise.resolve({
            data: resp.data.data || [],
            success: true,
            total: resp.data.total,
          });
        }}
      />
    </PageContainer>
  );
};

export default Users;
