import { apiSystems } from '@/api/apiServer';
import {
  ApartmentOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePptOutlined,
  PlusOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
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
import React, { useRef, useState } from 'react';

const Catalogues: React.FC = () => {
  // -- APPs
  const { message, modal } = App.useApp();
  // -- constants
  const MAX_DEPTH = 3;
  // -- refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();
  const source = useRef<API.SystemsAccessProps[]>([]);
  // -- state
  const [tips, setTips] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // -- columns
  const columns: ProColumns<any>[] = [
    {
      title: '权限名称',
      dataIndex: '',
      key: 'name',
    },
    {
      title: 'CODE',
      dataIndex: 'code',
      key: 'code',
    },
    {
      width: 120,
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              vForm.current?.setFieldsValue({
                authId: record.id,
                name: record.name,
                code: record.code,
              });
              setOpenForm(true);
            }}
          />
          <Popconfirm
            title={'温馨提示'}
            description={'您确定要删除该项及其下所有子类么？'}
            cancelText={'点错了'}
            placement={'bottomLeft'}
            onConfirm={async () => {
              message.loading('处理中...', 0);
              const resp = await apiSystems.accessDelete(record.id);
              message.destroy();
              if (resp && resp.code === 200) {
                setTips('删除成功');
                vTable.current?.reloadAndRest!();
              }
            }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>

          <Button
            icon={<PlusSquareOutlined />}
            disabled={record.depth === MAX_DEPTH}
            onClick={() => {
              vForm.current?.setFieldsValue({
                parentId: record.id,
              });
              setOpenForm(true);
            }}
          />
        </Space>
      ),
    },
  ];

  // -- 查找父级节点ID的递归函数
  const findParentIds = (data: any[], childId: string): string[] => {
    const parentIds: string[] = [];
    const findParent = (nodes: any[], targetId: string) => {
      for (const node of nodes) {
        // -- 如果找到当前节点的父节点，则继续查找
        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            if (child.id === targetId) {
              // 记录父节点的ID
              parentIds.push(node.id);
              // 递归查找父节点
              findParent(data, node.id);
              return;
            }
          }
        }
      }
    };

    findParent(data, childId);
    return parentIds;
  };

  const handleExpand = (expanded: boolean, record: any) => {
    // 查找当前节点的所有父节点并将其展开
    const parentKeys = findParentIds(source.current, record.id);
    if (expanded) {
      console.log(parentKeys);
      setExpandedRowKeys([...parentKeys, record.id]);
    } else {
      setExpandedRowKeys([...parentKeys]);
    }
  };

  // 递归遍历 dataSource，为每个节点加上 depth 字段
  const addDepthToData = (data: any[], currentDepth: number = 1): any[] => {
    return data.map((item) => {
      // 为当前项添加 depth 字段
      const newItem = { ...item, depth: currentDepth };
      // 如果有子节点，则递归调用，为子节点加上 depth
      if (newItem.children) {
        newItem.children = addDepthToData(newItem.children, currentDepth + 1);
      }
      return newItem;
    });
  };

  // -- rnders
  return (
    <PageContainer>
      <ProTable<API.SystemsAccessProps>
        actionRef={vTable}
        columns={columns}
        rowKey="id"
        search={false}
        options={false}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        expandable={{
          expandedRowKeys,
          indentSize: 30,
          expandIcon: ({ expanded, onExpand, record }) => {
            console.log(record);
            if (record.depth === 1) {
              return (
                <Space
                  onClick={(e) => onExpand(record, e)}
                  style={{ cursor: 'pointer' }}
                >
                  <FilePptOutlined style={{ color: 'orange' }} />
                  <span>{record.name}</span>
                </Space>
              );
            }
            return (
              <Space style={{ cursor: 'pointer' }}>
                <ApartmentOutlined color="blue" style={{ color: '#ccc' }} />
                <span>{record.name}</span>
              </Space>
            );
          },
          onExpand: handleExpand,
        }}
        toolBarRender={() => [
          <Button
            key={'create_access'}
            onClick={() => {
              vForm.current?.resetFields();
              setOpenForm(true);
            }}
          >
            <PlusOutlined />
            新建一级目录
          </Button>,
        ]}
        postData={(data: API.SystemsAccessProps[]) => {
          tips && message.success(tips);
          setTips('');
          source.current = addDepthToData(data);
          return source.current;
        }}
        request={async () => {
          const resp = await apiSystems.access();
          return Promise.resolve({
            data: resp.data,
            success: true,
            total: resp.data.length,
          });
        }}
      />
      <ModalForm
        formRef={vForm}
        title={
          !!vForm.current?.getFieldValue('authId') ? '编辑权限' : '新建权限'
        }
        open={openForm}
        width={400}
        modalProps={{
          forceRender: true,
          onCancel: () => setOpenForm(false),
        }}
        onFinish={async (value) => {
          message.loading('处理中...', 0);
          const resp = await apiSystems.accessAddOrUpdate(value);
          message.destroy();
          if (resp && resp.code === 200) {
            setTips('添加成功');
            vTable.current?.reloadAndRest!();
            setOpenForm(false);
          }
        }}
      >
        <ProFormText name="parentId" noStyle hidden />
        <ProFormText name="authId" noStyle hidden />
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

export default Catalogues;
