import { apiAudit } from '@/api/apiServer';
import ImageBox from '@/components/@lgs/ImageBox';

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
import { App, Button, Popconfirm, Space, Table } from 'antd';
import { useRef, useState } from 'react';

export default function Page() {
  // -- APPs
  const { message } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();
  const vSearchForm = useRef<ProFormInstance>();

  // - state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  // - methods
  const audit = async (data: {
    type: 'RESOLVE' | 'REJECT';
    ids?: number[];
    rejectReason?: string;
  }) => {
    const { type, ids, rejectReason } = data;
    console.log(data);
    message.loading('处理中...', 0);
    setTimeout(() => {
      message.destroy();
      message.success(type === 'REJECT' ? '已驳回' : '已通过');
    }, 1000);
  };

  // - columns
  const columns: Array<ProColumns<API.AuditProps>> = [
    {
      title: '提交作品',
      dataIndex: 'works',
      search: false,
      render: (_, { works }) => (
        <ImageBox src={works} width={100} height={60} />
      ),
    },
    {
      title: '审核状态',
      dataIndex: 'state',
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
        onChange: () => vSearchForm.current?.submit(),
      },
      valueType: 'select',
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
    },
    {
      title: '家园告白',
      dataIndex: 'desc',
      search: false,
      ellipsis: true,
    },
    { title: '业主姓名', dataIndex: 'name', search: false, width: 100 },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      copyable: true,
      fieldProps: {
        maxLength: 11,
      },
    },
    {
      title: '单元信息',
      dataIndex: 'roomName',
      search: false,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      search: false,
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
            onConfirm={() => {
              audit({
                type: 'RESOLVE',
                ids: [id],
              });
            }}
          >
            <Button disabled={state !== 1}>通过</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // -- renders
  return (
    <PageContainer>
      <ProTable<API.AuditProps>
        actionRef={vTable}
        formRef={vSearchForm}
        headerTitle={' '}
        columns={columns}
        rowKey={'id'}
        scroll={{ x: 1100 }}
        options={false}
        search={{ span: 6, labelWidth: 'auto' }}
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
          hideOnSinglePage: true,
          style: { paddingBottom: 16 },
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
          <Button onClick={() => setShowRejectModal(true)}>批量驳回</Button>
          <Button
            type="primary"
            onClick={() =>
              audit({
                type: 'RESOLVE',
                ids: selectedRowKeys,
              })
            }
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
          onCancel: () => setShowRejectModal(false),
        }}
        onFinish={async ({ rejectReason, id }) => {
          const ids =
            selectedRowKeys.length > 0 ? selectedRowKeys : [id as number];
          setShowRejectModal(false);
          audit({
            type: 'REJECT',
            ids,
            rejectReason,
          });
        }}
      >
        <ProFormText name="id" noStyle hidden />
        <ProFormTextArea
          name="rejectReason"
          placeholder="请填写驳回原因，最多100个字符"
          fieldProps={{ maxLength: 100 }}
          rules={[{ required: true, message: '请填写驳回原因' }]}
        />
      </ModalForm>
    </PageContainer>
  );
}
