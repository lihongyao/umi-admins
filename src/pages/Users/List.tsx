import { apiUser } from '@/api/apiServer';
import Utils from '@/utils';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { App, Avatar, Button, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';

export default function Page() {
  const navigate = useNavigate();
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  const vSearchForm = useRef<ProFormInstance>();
  // -- state
  const [tips, setTips] = useState('');

  // -- columns
  const columns: ProColumns<API.UserProps>[] = [
    {
      dataIndex: 'status',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        0: { text: '已启用', status: 'Processing' },
        1: { text: '已禁用', status: 'Error' },
      },
      fieldProps: {
        placeholder: '请选择状态',
        onChange: () => vSearchForm.current?.submit(),
      },
    },
    {
      dataIndex: 'nickname',
      hideInTable: true,
      fieldProps: { placeholder: '请输入用户昵称', suffix: <SearchOutlined /> },
    },
    {
      dataIndex: 'phone',
      copyable: true,
      hideInTable: true,
      fieldProps: { placeholder: '请输入联系电话', suffix: <SearchOutlined /> },
    },
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
      search: false,
      valueEnum: {
        0: { text: '已启用', status: 'Processing' },
        1: { text: '已禁用', status: 'Error' },
      },
    },
    { title: '用户昵称', dataIndex: 'nickname', search: false },
    { title: '联系电话', dataIndex: 'phone', copyable: true, search: false },
    { title: '注册时间', dataIndex: 'createTime', search: false },
    { title: '最后登录时间', dataIndex: 'lastLoginTime', search: false },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 120,
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
          <Popconfirm
            title={'确定删除？'}
            onConfirm={async () => {
              message.loading('处理中，请稍后...', 0);
              const resp = await apiUser.del(record.id);
              if (resp.code === 200) {
                setTips('删除成功');
                vTable.current?.setPageInfo!({
                  current: Utils.getNewPage(vTable.current.pageInfo),
                });
                vTable.current?.reload();
              }
            }}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // -- renders
  return (
    <PageContainer
      breadcrumb={{
        items: [
          {
            title: (
              <a onClick={() => navigate('/dashboard')}>
                <Space>
                  <HomeOutlined />
                  <span>首页</span>
                </Space>
              </a>
            ),
          },
          { title: <a onClick={() => navigate('/users/list')}>用户管理</a> },
          { title: '用户列表' },
        ],
      }}
    >
      <ProTable<API.UserProps>
        headerTitle={' '}
        actionRef={vTable}
        formRef={vSearchForm}
        columns={columns}
        rowKey="id"
        options={false}
        scroll={{ x: 'max-content' }}
        search={{
          span: 6,
          labelWidth: 'auto',
          collapsed: false,
          collapseRender: false,
        }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        postData={(data: API.UserProps[]) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params, sorter) => {
          params.sorter = Object.keys(sorter).length
            ? JSON.stringify(sorter)
            : undefined;
          const resp = await apiUser.list(params);
          return Promise.resolve({
            success: true,
            data: resp?.data?.items || [],
            total: resp?.data?.total || 0,
          });
        }}
      />
    </PageContainer>
  );
}
