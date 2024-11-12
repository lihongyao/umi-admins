import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  DragSortTable,
  ModalForm,
  ProColumns,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Button, Space } from 'antd';
import React, { useRef, useState } from 'react';

const Types: React.FC = () => {
  // -- APPs
  const { message, modal } = App.useApp();
  // -- refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();
  // -- state
  const [tips, setTips] = useState('');
  const [openForm, setOpenForm] = useState(false);
  // -- columns
  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      search: false,
    },

    { dataIndex: 'typeName' },
    {
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size={'small'}>
          <Button
            type={'link'}
            size={'small'}
            onClick={() => {
              vForm.current?.setFieldsValue({
                ...record,
              });
              setOpenForm(true);
            }}
          >
            编辑
          </Button>
          <span style={{ color: '#EEEEEE' }}>|</span>
          <Button
            type={'link'}
            size={'small'}
            danger
            onClick={() => {
              modal.confirm({
                title: '温馨提示',
                content: '您确定要删除该项么？',
                cancelText: '点错了',
                onOk: () => {
                  message.loading('处理中...', 0);
                  try {
                    setTimeout(() => {
                      message.destroy();
                      setTips('删除成功');
                      vTable.current?.reload!();
                    }, 500);
                  } catch {}
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <DragSortTable
        style={{ width: 400 }}
        headerTitle={'装备类型'}
        ghost={true}
        dragSortKey="sort"
        actionRef={vTable}
        columns={columns}
        rowKey={'id'}
        size={'small'}
        search={false}
        options={false}
        showHeader={false}
        pagination={false}
        toolBarRender={() => [
          <Button
            size={'small'}
            key={'create'}
            onClick={() => {
              vForm.current?.resetFields();
              setOpenForm(true);
            }}
          >
            <PlusOutlined />
            <span>新建</span>
          </Button>,
        ]}
        postData={(data: any) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async () => {
          return Promise.resolve({
            success: true,
            data: [
              { id: 1, typeName: '头盔' },
              { id: 2, typeName: '骑行服' },
              { id: 3, typeName: '电子设备' },
              { id: 4, typeName: '手套' },
              { id: 5, typeName: '户外装备' },
            ],
          });
        }}
      />
      <ModalForm
        title={!!vForm.current?.getFieldValue('id') ? '编辑' : '新建'}
        formRef={vForm}
        open={openForm}
        width={300}
        modalProps={{
          maskClosable: false,
          closable: false,
          forceRender: true,
          onCancel: () => setOpenForm(false),
        }}
        onFinish={async (values) => {
          message.loading('处理中...', 0);
          try {
            setTips(values.id ? '编辑成功' : '添加成功');
            vTable.current?.reload!();
            setOpenForm(false);
          } catch {}
        }}
      >
        <ProFormText noStyle hidden name="id" />
        <ProFormText
          name="value"
          placeholder={'请输入装备类型'}
          rules={[{ required: true, message: '请输入装备类型' }]}
        />
      </ModalForm>
    </>
  );
};

export default React.memo(Types);
