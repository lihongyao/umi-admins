import { apiAudit } from '@/api/apiServer';
import ImageBox from '@/components/@lgs/ImageBox';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';

import {
  ActionType,
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { App, Button, Popconfirm, Space, Table } from 'antd';
import { useRef, useState } from 'react';

export default function Page() {
  const navigate = useNavigate();
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();
  const vSearchForm = useRef<ProFormInstance>();

  // - state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tips, setTips] = useState('');

  // - methods
  const audit = async (data: {
    status: 0 | 1;
    ids?: number[];
    rejectReason?: string;
  }) => {
    message.loading('处理中...', 0);
    const resp = await apiAudit.audit(data);
    if (resp.code === 200) {
      setTips(data.status ? '已通过' : '已驳回');
      vTable.current?.reload();
    }
  };

  // - columns
  const columns: Array<ProColumns<API.AuditProps>> = [
    {
      dataIndex: 'state',
      fieldProps: {
        placeholder: '请选择审核状态',
        allowClear: true,
        onChange: () => vSearchForm.current?.submit(),
      },
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '待审核', status: 'Processing' },
        1: { text: '已通过', status: 'Success' },
        2: { text: '已驳回', status: 'Error' },
      },
    },
    {
      dataIndex: 'mobile',
      hideInTable: true,
      fieldProps: {
        suffix: <SearchOutlined />,
        placeholder: '请输入联系电话',
        maxLength: 11,
      },
    },
    {
      title: '提交作品',
      dataIndex: 'works',
      fixed: 'left',
      search: false,
      render: (_, { works }) => (
        <ImageBox src={works} width={100} height={60} />
      ),
    },
    { title: '业主姓名', dataIndex: 'name', search: false, width: 100 },
    {
      title: '审核状态',
      dataIndex: 'state',
      search: false,
      valueEnum: {
        0: { text: '待审核', status: 'Processing' },
        1: { text: '已通过', status: 'Success' },
        2: { text: '已驳回', status: 'Error' },
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      search: false,
      ellipsis: true,
    },
    {
      title: '家园告白',
      dataIndex: 'desc',
      search: false,
      ellipsis: true,
    },
    { title: '联系方式', dataIndex: 'mobile', copyable: true, search: false },
    {
      title: '单元信息',
      dataIndex: 'roomName',
      search: false,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, { state, id }) => (
        <Space>
          <Button
            disabled={state !== 1}
            danger
            onClick={() => {
              vForm.current?.setFieldsValue({ id });
              setShowRejectModal(true);
            }}
          >
            驳回
          </Button>

          <Popconfirm
            title={'确定通过？'}
            cancelText={'点错了'}
            onConfirm={() => audit({ status: 1, ids: [id] })}
          >
            <Button disabled={state !== 1}>通过</Button>
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
          { title: '数据看板' },
        ],
      }}
    >
      <ProTable<API.AuditProps>
        headerTitle={' '}
        actionRef={vTable}
        formRef={vSearchForm}
        columns={columns}
        rowKey={'id'}
        scroll={{ x: 'max-content' }}
        options={false}
        search={{
          span: 6,
          labelWidth: 'auto',
          collapsed: false,
          collapseRender: false,
        }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          getCheckboxProps({ state }) {
            return {
              disabled: state !== 1,
            };
          },
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys as number[]);
          },
        }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        postData={(data: API.AuditProps[]) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params: any) => {
          const resp = await apiAudit.list(params);
          return Promise.resolve({
            data: resp.data.data || [],
            success: true,
            total: resp.data.total,
          });
        }}
      />

      {/* 渲染 */}
      {selectedRowKeys.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <span>已选择</span>
              <a style={{ fontWeight: 600, margin: '0 6px' }}>
                {selectedRowKeys.length}
              </a>
              <span>项</span>
            </div>
          }
        >
          <Button danger onClick={() => setShowRejectModal(true)}>
            批量驳回
          </Button>
          <Button
            type="primary"
            onClick={() => audit({ status: 0, ids: selectedRowKeys })}
          >
            批量通过
          </Button>
        </FooterToolbar>
      )}
      {/* 驳回 */}
      <ModalForm
        formRef={vForm}
        title={'驳回原因'}
        open={showRejectModal}
        width={500}
        modalProps={{
          maskClosable: false,
          forceRender: true,
          cancelText: '点错了',
          destroyOnHidden: true,
          onCancel: () => setShowRejectModal(false),
        }}
        onFinish={async ({ rejectReason, id }) => {
          const ids =
            selectedRowKeys.length > 0 ? selectedRowKeys : [id as number];
          setShowRejectModal(false);
          audit({ status: 0, ids, rejectReason });
        }}
      >
        <p className="my-4 text-gray-500">
          已选 {selectedRowKeys.length || 1} 条申请
        </p>
        <ProFormText name="id" noStyle hidden />
        <ProFormTextArea
          name="rejectReason"
          placeholder="请填写驳回原因，最多100个字符"
          fieldProps={{ maxLength: 100, showCount: true }}
          rules={[{ required: true, message: '请填写驳回原因' }]}
        />
      </ModalForm>
    </PageContainer>
  );
}
