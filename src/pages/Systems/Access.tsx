import { apiSys } from '@/api/apiServer';
import {
  DeleteOutlined,
  FormOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Button, Popconfirm, Space, Tree } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Access: React.FC = () => {
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vForm = useRef<ProFormInstance>();

  // - state
  const [treeData, setTreeData] = useState<Array<API.SystemsAccessProps>>([]);
  const [openModal, setOpenModal] = useState(false);

  // - methods
  const getData = async (tips?: string) => {
    const resp = await apiSys.access();
    vForm.current?.resetFields();
    if (resp.code === 200) {
      tips && message.success(tips);
      setTreeData(resp.data);
    }
  };

  // -- effects
  useEffect(() => {
    getData();
  }, []);

  const onEdit = (nodeData: API.SystemsAccessProps) => {
    vForm.current?.setFieldsValue({
      id: nodeData.id,
      name: nodeData.name,
      code: nodeData.code,
    });
    setOpenModal(true);
  };
  // -- renders
  return (
    <PageContainer
      extra={[
        <Button
          key={'ADD_ACCESS'}
          onClick={() => {
            vForm.current?.resetFields();
            setOpenModal(true);
          }}
        >
          <PlusOutlined />
          <span>新增权限</span>
        </Button>,
      ]}
    >
      {/* 树形解构 */}
      <Tree
        style={{ padding: 16 }}
        showLine={{ showLeafIcon: false }}
        fieldNames={{ key: 'id' }}
        selectable={false}
        // @ts-ignore
        treeData={treeData}
        // @ts-ignore
        titleRender={(nodeData: API.SystemsAccessProps) => (
          <Space>
            <span>
              {nodeData.name} - {nodeData.code}
            </span>
            <FormOutlined
              style={{ color: '#4169E1' }}
              onClick={() => onEdit(nodeData)}
            />
            <PlusCircleOutlined
              style={{ color: '#4169E1' }}
              onClick={() => {
                vForm.current?.setFieldsValue({
                  parentId: nodeData.id,
                });
                setOpenModal(true);
              }}
            />
            <Popconfirm
              title={'您确定要删除该项及其下所有子类么？'}
              onConfirm={async () => {
                message.loading('处理中...', 0);
                const resp = await apiSys.accessDelete(nodeData.id as number);
                if (resp.code === 200) {
                  getData('删除成功');
                }
              }}
            >
              <DeleteOutlined style={{ color: '#DC143C' }} />
            </Popconfirm>
          </Space>
        )}
      />
      <ModalForm
        formRef={vForm}
        title={!!vForm.current?.getFieldValue('id') ? '编辑权限' : '新建权限'}
        open={openModal}
        width={400}
        modalProps={{
          forceRender: true,
          onCancel: () => setOpenModal(false),
        }}
        onFinish={async (values) => {
          message.loading('处理中...', 0);
          const isEdit = !!values.id;
          const fetchFn = isEdit ? apiSys.accessEdit : apiSys.accessAdd;
          const resp = await fetchFn(values);

          if (resp.code === 200) {
            getData(isEdit ? '编辑成功' : '添加成功');
            setOpenModal(false);
          }
        }}
      >
        <ProFormText name="parentId" noStyle hidden />
        <ProFormText name="id" noStyle hidden />
        <ProFormText
          label="权限名称"
          name="name"
          placeholder={'请输入权限名称'}
          rules={[{ required: true }]}
          extra={'Tips：权限名称一般为页面名称或者相应的操作描述'}
        />
        <ProFormText
          label="权限代码"
          name="code"
          placeholder={'请输入权限代码'}
          rules={[{ required: true }]}
          extra={'Tips：权限代码尽量使用标准缩写，见名知意'}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Access;
