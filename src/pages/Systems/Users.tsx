import { apiSys } from '@/api/apiServer';
import UploadForOSS from '@/components/@lgs/UploadForOSS';

import { PlusOutlined } from '@ant-design/icons';
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
import { App, Avatar, Button, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';

const Users: React.FC = () => {
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();

  // -- state
  const [tips, setTips] = useState('');
  const [openForm, setOpenForm] = useState(false);

  // -- methods
  const switchStatus = async (id: number, status: number, tips: string) => {
    message.loading('处理中...', 0);
    const resp = await apiSys.userSwichStatus(id, status);

    if (resp.code === 200) {
      setTips(tips);
      vTable.current?.reloadAndRest!();
    }
  };

  // -- columns
  const columns: ProColumns<API.SystemsUserProps>[] = [
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
    { title: '登录账号', dataIndex: 'username', search: false },
    { title: '姓名', dataIndex: 'nickname' },
    {
      title: '状态',
      tooltip: '该用户是否被拉入黑名单',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { placeholder: '全部', allowClear: true },
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
      render: (_, record) => (
        <Space>
          {record.status === 1 && (
            <Popconfirm
              title={'温馨提示'}
              description={'您确定要禁用该用户么？'}
              onConfirm={() => switchStatus(record.id, 0, '已禁用')}
            >
              <Button danger>禁用</Button>
            </Popconfirm>
          )}
          {record.status === 0 && (
            <Popconfirm
              title={'温馨提示'}
              description={'您确定要启用该用户么？'}
              onConfirm={() => switchStatus(record.id, 1, '已启用')}
            >
              <Button>启用</Button>
            </Popconfirm>
          )}
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
            title={'温馨提示'}
            description={'您确定要重置该用户的密码么？'}
            onConfirm={async () => {
              message.loading('处理中...', 0);
              const resp = await apiSys.userResetPsw(record.id);

              if (resp.code === 200) {
                message.success('密码已重置为【123456】');
              }
            }}
          >
            <Button>重置密码</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // -- rnders
  return (
    <PageContainer
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
      <ProTable<API.SystemsUserProps>
        actionRef={vTable}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        options={false}
        search={{ span: 6, labelWidth: 'auto' }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          hideOnSinglePage: true,
          style: { paddingBottom: 16 },
        }}
        postData={(data: Array<API.SystemsUserProps>) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params) => {
          const resp = await apiSys.users({
            ...params,
          });
          return Promise.resolve({
            data: resp.data.data || [],
            success: true,
            total: resp.data.total,
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
        width={450}
        modalProps={{
          maskClosable: false,
          forceRender: true,
          onCancel: () => setOpenForm(false),
        }}
        onFinish={async (values) => {
          message.loading('处理中...', 0);
          const isEdit = !!values.id;
          const fetchFn = isEdit ? apiSys.userEdit : apiSys.userAdd;
          const resp = await fetchFn({
            ...values,
            avatarUrl: values.avatar[0].url,
          });

          if (resp.code === 200) {
            setTips(isEdit ? '编辑成功' : '添加成功');
            setOpenForm(false);
            vTable.current?.reloadAndRest!();
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
          <UploadForOSS dir="fruites_pro" />
        </ProForm.Item>
        <ProFormText
          label="账号"
          name="username"
          fieldProps={{ size: 'large' }}
          placeholder={'请输入登录账号'}
          rules={[{ required: true }]}
        />
        <ProFormDependency name={['id']}>
          {({ id }) => {
            return id ? null : (
              <ProFormText.Password
                label="密码"
                name="password"
                fieldProps={{ size: 'large' }}
                placeholder={'请输入登录密码'}
                rules={[{ required: true }]}
              />
            );
          }}
        </ProFormDependency>

        <ProForm.Group>
          <ProFormText
            label="姓名"
            name="nickname"
            fieldProps={{ size: 'large' }}
            placeholder={'请输入姓名'}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="roleId"
            label="角色"
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
        </ProForm.Group>
      </ModalForm>
    </PageContainer>
  );
};

export default Users;
