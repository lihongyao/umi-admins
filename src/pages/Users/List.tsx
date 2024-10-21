import { apiUser } from '@/api/apiServer';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { App, Avatar, Button, Space } from 'antd';
import React, { useRef, useState } from 'react';

const Users: React.FC = () => {
  // -- APPs
  const { message, modal } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  // -- state
  const [tips, setTips] = useState('');

  // -- columns
  const columns: ProColumns<API.UserProps>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 48 },
    {
      title: '用户头像',
      dataIndex: 'avatarUrl',
      hideInSearch: true,
      render: (_, { avatarUrl }) => <Avatar src={avatarUrl} size={50} />,
    },
    { title: '用户昵称', dataIndex: 'nickname', hideInSearch: true },
    { title: '联系电话', dataIndex: 'phone' },
    { title: '注册时间', dataIndex: 'createDate', hideInSearch: true },
    {
      title: '操作',
      dataIndex: 'action',
      width: 160,
      render: () => (
        <Space>
          <Button>启用</Button>
          <Button danger>禁用</Button>
        </Space>
      ),
    },
  ];

  // -- rnders
  return (
    <PageContainer pageHeaderRender={false}>
      <ProTable<API.UserProps>
        actionRef={vTable}
        headerTitle={'用户列表'}
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
