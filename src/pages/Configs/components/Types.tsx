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

interface TypeItemProps {
  id: string | number;
  typeName: string;
}
const Types: React.FC = () => {
  // -- APPs
  const { message, modal } = App.useApp();
  // -- refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();
  // -- state
  const [openForm, setOpenForm] = useState(false);
  const [dataSource, setDataSource] = useState<Array<TypeItemProps>>([
    { id: 1, typeName: '复古' },
    { id: 2, typeName: '机车' },
    { id: 3, typeName: '冒险' },
    { id: 4, typeName: '巡航' },
    { id: 5, typeName: '特价车' },
  ]);
  // -- events
  const handleDragSortEnd = async (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: Array<TypeItemProps>,
  ) => {
    const sortIds = newDataSource.map((item) => item.id);
    setDataSource(newDataSource);
    console.log(sortIds);
  };
  // -- columns
  const columns: ProColumns[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      search: false,
    },

    { title: '分类名称', dataIndex: 'typeName' },
    {
      title: '操作',
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
                onOk: () => {},
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 20,
      search: false,
    },
  ];
  return (
    <>
      <DragSortTable
        style={{ width: 400 }}
        headerTitle={'车辆类型'}
        ghost={true}
        dragSortKey="sort"
        actionRef={vTable}
        columns={columns}
        dataSource={dataSource}
        rowKey={'id'}
        size={'small'}
        search={false}
        options={false}
        showHeader={false}
        pagination={false}
        toolBarRender={() => [
          <Button
            key={'create'}
            size={'small'}
            onClick={() => {
              vForm.current?.resetFields();
              setOpenForm(true);
            }}
          >
            <PlusOutlined />
            <span>新建</span>
          </Button>,
        ]}
        onDragSortEnd={handleDragSortEnd}
      />
      <ModalForm
        title={
          !!vForm.current?.getFieldValue('id') ? '编辑车辆类型' : '新建车辆类型'
        }
        formRef={vForm}
        open={openForm}
        width={300}
        modalProps={{
          closable: false,
          forceRender: true,
          onCancel: () => setOpenForm(false),
        }}
        onFinish={async (values) => {
          console.log(values);
        }}
      >
        <ProFormText noStyle hidden name="id" />
        <ProFormText
          name="typeName"
          placeholder={'请输入车辆类型'}
          rules={[{ required: true, message: '请输入车辆类型' }]}
        />
      </ModalForm>
    </>
  );
};

export default React.memo(Types);
