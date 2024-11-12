import { apiUser } from '@/api/apiServer';
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
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

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
        onChange: () => vSearchForm.current?.submit(),
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
          <Popconfirm title={'确定删除？'} onConfirm={async () => {}}>
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
        formRef={vSearchForm}
        columns={columns}
        rowKey="id"
        options={false}
        search={{ span: 6, labelWidth: 'auto' }}
        pagination={{
          current,
          pageSize,
          hideOnSinglePage: true,
          style: { paddingBottom: 16 },
          onChange: (page, pageSize) => {
            setCurrent(page);
            setPageSize(pageSize);
          },
        }}
        postData={(data: Array<API.UserProps>) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params) => {
          const resp = await apiUser.list(params);
          setTotal(resp.data.total);
          return Promise.resolve({
            data: resp.data.data || [],
            success: true,
            total: resp.data.total,
          });
        }}
      />
    </PageContainer>
  );
}
