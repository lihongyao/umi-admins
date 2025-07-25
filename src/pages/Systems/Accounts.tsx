import { apiSys } from '@/api/apiServer';
import UploadImage from '@/components/@lgs/UploadImage';
import Utils from '@/utils';

import { HomeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
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
  const vForm = useRef<ProFormInstance>();
  const vSearchForm = useRef<ProFormInstance>();

  // -- state
  const [tips, setTips] = useState('');
  const [openForm, setOpenForm] = useState(false);

  // -- methods
  const switchStatus = async (id: number, status: number, tips: string) => {
    message.loading('处理中...', 0);
    const resp = await apiSys.accountSwichStatus(id, status);

    if (resp.code === 200) {
      setTips(tips);
      vTable.current?.reload();
    }
  };

  // -- columns
  const columns: ProColumns<API.SysAccountProps>[] = [
    {
      dataIndex: 'status',
      valueType: 'select',
      hideInTable: true,
      fieldProps: {
        placeholder: '请选择状态',
        allowClear: true,
        onChange: () => vSearchForm.current?.submit(),
      },
      valueEnum: {
        0: { text: '已禁用', status: 'Error' },
        1: { text: '已启用', status: 'Processing' },
      },
    },
    {
      dataIndex: 'roleId',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择角色',
        fieldNames: {
          label: 'roleName',
          value: 'id',
        },
        allowClear: true,
        onChange: () => vSearchForm.current?.submit(),
      },
      request: async () => {
        const resp = await apiSys.roles();
        if (resp.code === 200) {
          return resp.data;
        }
        return [];
      },
    },
    {
      dataIndex: 'nickname',
      hideInTable: true,
      fieldProps: { placeholder: '请输入姓名', suffix: <SearchOutlined /> },
    },
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      search: false,
      render: (_, record) => (
        <Avatar
          src={record.avatarUrl}
          style={{ width: 50, height: 50 }}
          shape={'square'}
        />
      ),
    },
    { title: '登录账号', dataIndex: 'username', search: false, copyable: true },
    { title: '姓名', dataIndex: 'nickname', search: false },
    {
      title: '状态',
      tooltip: '该用户是否被拉入黑名单',
      dataIndex: 'status',
      search: false,
      valueEnum: {
        0: { text: '已禁用', status: 'Error' },
        1: { text: '已启用', status: 'Processing' },
      },
    },
    {
      title: '系统角色',
      dataIndex: 'roleId',
      search: false,
      valueType: 'select',
      fieldProps: {
        fieldNames: {
          label: 'roleName',
          value: 'id',
        },
      },
      request: async () => {
        const resp = await apiSys.roles();
        if (resp.code === 200) {
          return resp.data;
        }
        return [];
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
    },
    { title: '最后登录时间', dataIndex: 'lastLoginTime', search: false },
    {
      title: '操作',
      key: 'action',
      search: false,
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              vForm.current?.setFieldsValue({
                ...record,
                avatarUrl: [{ url: record.avatarUrl }],
              });
              setOpenForm(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title={'确定重置密码？'}
            onConfirm={async () => {
              message.loading('处理中...', 0);
              const resp = await apiSys.accountResetPsw(record.id);
              if (resp.code === 200) {
                message.success('密码已重置为【123456】');
              }
            }}
          >
            <Button>重置密码</Button>
          </Popconfirm>
          {record.status === 0 && (
            <Popconfirm
              title={'确定启用？'}
              onConfirm={() => switchStatus(record.id, 1, '已启用')}
            >
              <Button>启用</Button>
            </Popconfirm>
          )}
          {record.status === 1 && (
            <Popconfirm
              title={'确定禁用？'}
              onConfirm={() => switchStatus(record.id, 0, '已禁用')}
            >
              <Button danger>禁用</Button>
            </Popconfirm>
          )}
          <Popconfirm
            title={'确定删除？'}
            onConfirm={async () => {
              message.loading('处理中，请稍后...', 0);
              const resp = await apiSys.accountDelete(record.id);
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
          { title: <a onClick={() => navigate('/systems/roles')}>系统管理</a> },
          { title: '帐户管理' },
        ],
      }}
      extra={[
        <Button
          key={'create'}
          onClick={() => {
            vForm.current?.resetFields();
            setOpenForm(true);
          }}
        >
          <PlusOutlined />
          新建用户
        </Button>,
      ]}
    >
      <ProTable<API.SysAccountProps>
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
        postData={(data: API.SysAccountProps[]) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params) => {
          const resp = await apiSys.accounts(params);
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
      {/* modals */}
      <ModalForm
        formRef={vForm}
        title={
          !!vForm.current?.getFieldValue('id') ? '编辑用户信息' : '新建系统用户'
        }
        open={openForm}
        width={400}
        modalProps={{
          maskClosable: false,
          forceRender: true,
          onCancel: () => setOpenForm(false),
        }}
        onFinish={async (values) => {
          const isEdit = !!values.id;
          const fetchFn = isEdit ? apiSys.accountEdit : apiSys.accountAdd;
          message.loading('处理中...', 0);
          const resp = await fetchFn({
            ...values,
            // avatarUrl: values.avatar[0].url,
          });
          if (resp.code === 200) {
            setTips(isEdit ? '编辑成功' : '添加成功');
            setOpenForm(false);
            vTable.current?.reload();
          }
        }}
      >
        <ProFormText name="id" noStyle hidden />
        <ProForm.Item
          label="头像"
          name="avatarUrl"
          rules={[{ required: true, message: '请上传轮播图' }]}
          extra={'温馨提示：请上传1:1比例的图片'}
        >
          <UploadImage />
        </ProForm.Item>
        <ProFormText
          label="账号"
          name="username"
          fieldProps={{ size: 'large' }}
          placeholder={'请输入登录账号'}
          rules={[
            { required: true },
            { pattern: /^\w{4,16}$/, message: '仅支持 4-16 位字母数字下划线' },
          ]}
        />
        <ProFormDependency name={['id']}>
          {({ id }) => {
            return id ? null : (
              <ProFormText.Password
                label="密码"
                name="password"
                placeholder={'请输入登录密码'}
                rules={[{ required: true }]}
                fieldProps={{ autoComplete: 'off', size: 'large' }}
              />
            );
          }}
        </ProFormDependency>

        <ProFormText
          label="姓名"
          name="nickname"
          fieldProps={{ size: 'large' }}
          placeholder={'请输入姓名'}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          label="角色"
          name="roleId"
          fieldProps={{
            size: 'large',
            fieldNames: {
              label: 'roleName',
              value: 'id',
            },
          }}
          request={async () => {
            const resp = await apiSys.roles();
            if (resp.code === 200) {
              return resp.data;
            }
            return [];
          }}
          placeholder="请选择"
          rules={[{ required: true, message: '请选择用户角色' }]}
        />
      </ModalForm>
    </PageContainer>
  );
}
