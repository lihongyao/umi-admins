import { apiUser } from '@/api/apiServer';
import Utils from '@/utils';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { App, Avatar, Button, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';

export default function Page() {
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  const vSearchForm = useRef<ProFormInstance>();
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
      fieldProps: {
        placeholder: '请选择状态',
        onChange: () => vSearchForm.current?.submit(),
      },
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      fieldProps: { placeholder: '请输入用户昵称' },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      copyable: true,
      fieldProps: { placeholder: '请输入联系电话' },
    },
    { title: '注册时间', dataIndex: 'createTime', search: false },
    { title: '最后登录时间', dataIndex: 'lastLoginTime', search: false },
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
    <PageContainer>
      <ProTable<API.UserProps>
        headerTitle={' '}
        actionRef={vTable}
        formRef={vSearchForm}
        columns={columns}
        rowKey="id"
        options={false}
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 'auto', collapsed: false, collapseRender: false }}
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
        request={async (params) => {
          const resp = await apiUser.list(params);
          if (resp.code === 200) {
            return Promise.resolve({
              data: resp.data.data,
              total: resp.data.total,
            });
          }
          return Promise.resolve({
            data: [],
            total: 0,
          });
        }}
      />
    </PageContainer>
  );
}
