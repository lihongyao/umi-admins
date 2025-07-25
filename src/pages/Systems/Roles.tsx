import { apiSys } from '@/api/apiServer';
import AccessTree from '@/components/@lgs/AccessTree';
import Utils from '@/utils';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';

import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormInstance,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { App, Button, Form, Popconfirm, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const navigate = useNavigate();
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();
  const vSearchForm = useRef<ProFormInstance>();

  // -- state
  const [openForm, setOpenForm] = useState(false);
  const [auths, setAuths] = useState<API.SysAccessProps[]>([]);
  const [tips, setTips] = useState('');

  // - methods
  const recursive = (arr: API.SysAccessProps[]): any => {
    return arr.map((item) => ({
      title: item.name,
      key: item.id,
      children: item.children ? recursive(item.children) : undefined,
    }));
  };

  const traverse = (notes: API.SysAccessProps[]) => {
    let result: Array<string | number> = []; // 内部定义结果数组
    notes.forEach((note) => {
      result.push(note.id); // 收集当前节点的 ID
      if (note.children && note.children.length > 0) {
        result = result.concat(traverse(note.children)); // 递归子节点，并合并结果
      }
    });
    return result;
  };

  // -- methods
  const switchStatus = async (id: number, status: number, tips: string) => {
    message.loading('处理中...', 0);
    const resp = await apiSys.roleSwichStatus(id, status);
    if (resp.code === 200) {
      setTips(tips);
      vTable.current?.reload();
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
  const columns: ProColumns<API.SysRoleProps>[] = [
    {
      dataIndex: 'status',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        0: { text: '已禁用', status: 'Error' },
        1: { text: '已启用', status: 'Processing' },
      },
      fieldProps: {
        placeholder: '请选择状态',
        onChange: () => vSearchForm.current?.submit(),
      },
    },
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 48 },
    { title: '角色名称', dataIndex: 'roleName', search: false },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      valueEnum: {
        0: { text: '已禁用', status: 'Error' },
        1: { text: '已启用', status: 'Processing' },
      },
    },
    { title: '创建人', dataIndex: 'createBy', search: false },
    { title: '创建时间', dataIndex: 'createTime', search: false },
    { title: '更新人', dataIndex: 'createBy', search: false },
    { title: '更新时间', dataIndex: 'createTime', search: false },
    {
      title: '操作',
      key: 'action',
      search: false,
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              vForm.current?.setFieldsValue({
                id: record.id,
                roleName: record.roleName,
                permissionIds: record.permissionIds,
              });
              setOpenForm(true);
            }}
          >
            编辑
          </Button>

          {record.status === 1 ? (
            <Popconfirm
              title={'确定禁用？'}
              onConfirm={() => switchStatus(record.id, 0, '已禁用')}
            >
              <Button danger>禁用</Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title={'确定启用？'}
              onConfirm={() => switchStatus(record.id, 0, '已启用')}
            >
              <Button disabled={record.status === 1}>启用</Button>
            </Popconfirm>
          )}
          <Popconfirm
            title={'确定删除？'}
            onConfirm={async () => {
              message.loading('处理中，请稍后...', 0);
              const resp = await apiSys.roleDelete(record.id);
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
          { title: '角色管理' },
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
          <span>新建角色</span>
        </Button>,
      ]}
    >
      <ProTable<API.SysRoleProps>
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
        postData={(data: API.SysRoleProps[]) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async () => {
          const resp = await apiSys.roles();
          if (resp.code === 200) {
            return Promise.resolve({
              data: resp.data,
              total: resp.data.length,
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
          !!vForm.current?.getFieldValue('roleId') ? '编辑角色信息' : '新建角色'
        }
        open={openForm}
        width={500}
        layout="horizontal"
        modalProps={{
          maskClosable: false,
          destroyOnHidden: true,
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
            vTable.current?.reload();
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
        <ProForm.Item label="角色权限" required>
          <Form.Item className={'mb-4'}>
            <Space>
              <Button
                size={'small'}
                onClick={() =>
                  vForm.current?.setFieldValue('permissionIds', traverse(auths))
                }
              >
                全选
              </Button>
              <Button
                size={'small'}
                danger
                onClick={() => {
                  vForm.current?.setFieldValue('permissionIds', undefined);
                }}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
          <ProFormText
            name="permissionIds"
            rules={[{ required: true, message: '请分配角色权限' }]}
          >
            <AccessTree treeData={recursive(auths)} />
          </ProFormText>
        </ProForm.Item>
      </ModalForm>
    </PageContainer>
  );
}
