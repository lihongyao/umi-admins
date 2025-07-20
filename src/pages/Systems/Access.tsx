import { apiSys } from '@/api/apiServer';
import {
  CopyOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProCard,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import Tools from '@likg/tools';
import { App, Button, Popconfirm, Tree } from 'antd';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vForm = useRef<ProFormInstance>();

  // - state
  const [treeData, setTreeData] = useState<Array<API.SysAccessProps>>([]);
  const [open, setOpen] = useState(false);

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

  const onEdit = (nodeData: API.SysAccessProps) => {
    vForm.current?.setFieldsValue({
      id: nodeData.id,
      name: nodeData.name,
      code: nodeData.code,
    });
    setOpen(true);
  };
  // -- renders
  return (
    <PageContainer title={false}>
      {/* 树形结构 */}
      <ProCard
        title={'权限列表（树形结构）'}
        extra={
          <Button
            key={'ADD_ACCESS'}
            onClick={() => {
              vForm.current?.resetFields();
              setOpen(true);
            }}
          >
            <PlusOutlined />
            <span>新增权限</span>
          </Button>
        }
      >
        <Tree
          style={{ padding: 16 }}
          showLine={{ showLeafIcon: false }}
          fieldNames={{ key: 'id' }}
          selectable={false}
          // @ts-ignore
          treeData={treeData}
          // @ts-ignore
          titleRender={(nodeData: API.SysAccessProps) => (
            <div className="flex space-x-3">
              <div>
                {nodeData.name} - {nodeData.code}{' '}
              </div>
              <FormOutlined
                className={'text-blue-500 opacity-50 hover:opacity-100'}
                onClick={() => onEdit(nodeData)}
              />
              <PlusCircleOutlined
                className={'text-blue-500 opacity-50 hover:opacity-100'}
                onClick={() => {
                  vForm.current?.setFieldsValue({
                    parentId: nodeData.id,
                  });
                  setOpen(true);
                }}
              />
              <CopyOutlined
                className={'text-blue-500 opacity-50 hover:opacity-100'}
                onClick={() => {
                  Tools.clipboard(nodeData.code);
                  message.success('已复制');
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
                <DeleteOutlined className="text-red-500 opacity-50 hover:opacity-100" />
              </Popconfirm>
            </div>
          )}
        />
      </ProCard>
      <ModalForm
        formRef={vForm}
        title={!!vForm.current?.getFieldValue('id') ? '编辑权限' : '新建权限'}
        open={open}
        width={400}
        modalProps={{
          maskClosable: false,
          forceRender: true,
          onCancel: () => setOpen(false),
        }}
        onFinish={async (values) => {
          message.loading('处理中...', 0);
          const isEdit = !!values.id;
          const fetchFn = isEdit ? apiSys.accessEdit : apiSys.accessAdd;
          const resp = await fetchFn(values);

          if (resp.code === 200) {
            getData(isEdit ? '编辑成功' : '添加成功');
            setOpen(false);
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
}
