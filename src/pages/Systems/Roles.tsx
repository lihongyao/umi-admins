import { apiSys } from '@/api/apiServer';
import AccessTree from '@/components/@lgs/AccessTree';
import { PlusOutlined } from '@ant-design/icons';

import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormInstance,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Popconfirm, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Roles: React.FC = () => {
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();

  // -- state
  const [openForm, setOpenForm] = useState(false);
  const [auths, setAuths] = useState<API.SystemsAccessProps[]>([]);
  const [tips, setTips] = useState('');

  // - methods
  const recursive = (arr: API.SystemsAccessProps[]): any => {
    return arr.map((item) => ({
      title: item.name,
      key: item.id,
      children: item.children ? recursive(item.children) : undefined,
    }));
  };

  // -- methods
  const switchStatus = async (id: number, status: number, tips: string) => {
    message.loading('处理中...', 0);
    const resp = await apiSys.roleSwichStatus(id, status);

    if (resp.code === 200) {
      setTips(tips);
      vTable.current?.reloadAndRest!();
    }
  };
  // - effects
  useEffect(() => {
    apiSys.access().then((resp) => {
      if (resp && resp.code === 200) {
        setAuths(resp.data);
      }
    });
  }, []);

  // -- columns
  const columns: ProColumns<API.SystemRoleProps>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 48 },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      valueType: 'select',
      valueEnum: {
        0: { text: '已禁用', status: 'Error' },
        1: { text: '已启用', status: 'Processing' },
      },
    },
    { title: '角色名称', dataIndex: 'roleName', search: false },
    { title: '创建人', dataIndex: 'createBy', search: false },
    { title: '创建时间', dataIndex: 'createTime', search: false },
    { title: '更新人', dataIndex: 'createBy', search: false },
    { title: '更新时间', dataIndex: 'createTime', search: false },
    {
      title: '操作',
      key: 'action',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              vForm.current?.setFieldsValue({
                id: record.id,
                roleName: record.roleName,
                authIds: record.authIds,
              });
              setOpenForm(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="您确定要启用该角色么？"
            onConfirm={() => switchStatus(record.id, 1, '已启用')}
          >
            <Button disabled={record.status === 1}>启用</Button>
          </Popconfirm>
          <Popconfirm
            title="您确定要禁用该角色么？"
            onConfirm={() => switchStatus(record.id, 0, '已禁用')}
          >
            <Button disabled={record.status === 0} danger>
              禁用
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
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
          <span>新建角色</span>
        </Button>,
      ]}
    >
      <ProTable<API.SystemRoleProps>
        actionRef={vTable}
        columns={columns}
        rowKey="id"
        options={false}
        search={false}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          hideOnSinglePage: true,
          style: { paddingBottom: 16 },
        }}
        postData={(data: Array<API.SystemRoleProps>) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async () => {
          const resp = await apiSys.roles();
          return Promise.resolve({
            data: resp.data,
            success: true,
            total: resp.data.length,
          });
        }}
      />
      {/* modals */}
      <ModalForm
        formRef={vForm}
        title={
          !!vForm.current?.getFieldValue('roleId') ? '编辑角色信息' : '新建角色'
        }
        open={openForm}
        width={500}
        layout="horizontal"
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          forceRender: true,
          onCancel: () => setOpenForm(false),
        }}
        onFinish={async (values) => {
          message.loading('处理中...', 0);
          const isEdit = !!values.id;
          const fetchFn = isEdit ? apiSys.roleEdit : apiSys.roleAdd;
          const resp = await fetchFn(values);
          message.destroy();
          if (resp && resp.code === 200) {
            setTips(isEdit ? '编辑成功' : '添加成功');
            setOpenForm(false);
            vTable.current?.reloadAndRest!();
          }
        }}
      >
        <ProFormText name="id" noStyle hidden />
        <ProFormText
          label="角色名称"
          name="roleName"
          placeholder={'请输入角色名称'}
          rules={[{ required: true }]}
        />
        <ProFormText
          label="角色权限"
          name="authIds"
          rules={[{ required: true, message: '请分配角色权限' }]}
        >
          <AccessTree treeData={recursive(auths)} />
        </ProFormText>
      </ModalForm>
    </PageContainer>
  );
};

export default Roles;
