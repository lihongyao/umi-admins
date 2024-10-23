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
    { title: '联系电话', dataIndex: 'phone' },
    { title: '注册时间', dataIndex: 'createTime', search: false },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={'温馨提示'}
            description={'您确定要禁启用该用户吗？'}
          >
            <Button disabled={record.status === 1}>启用</Button>
          </Popconfirm>
          <Popconfirm
            title={'温馨提示'}
            description={'您确定要禁禁用该用户吗？'}
          >
            <Button danger disabled={record.status === 0}>
              禁用
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // -- rnders
  return (
    <PageContainer>
      <ProTable<API.UserProps>
        actionRef={vTable}
        columns={columns}
        rowKey="id"
        options={false}
        pagination={{
          hideOnSinglePage: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        postData={(data: Array<API.UserProps>) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params) => {
          params.page = params.current;
          delete params.current;
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
