import { apiBanners } from '@/api/apiServer';
import ImageBox from '@/components/@lgs/ImageBox';
import UploadImage from '@/components/@lgs/UploadImage';
import { PlusOutlined } from '@ant-design/icons';

import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Popconfirm, Space, Switch } from 'antd';
import { useRef, useState } from 'react';

export default function Page() {
  // -- APPs
  const { message } = App.useApp();
  // -- refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();
  const vSearchForm = useRef<ProFormInstance>();

  // -- status
  const [dataSource, setDataSource] = useState<Array<API.BannerProps>>([]);
  const [tips, setTips] = useState('');
  const [openForm, setOpenForm] = useState(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // -- columns
  const columns: Array<ProColumns<API.BannerProps>> = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },
    {
      title: '图片预览',
      dataIndex: 'bannerPic',
      search: false,
      width: 120,
      render: (_, { bannerPic }) => (
        <ImageBox src={bannerPic} width={100} height={60} />
      ),
    },
    {
      title: '展示位置',
      dataIndex: 'locationCode',
      valueType: 'select',
      fieldProps: {
        fieldNames: {
          label: 'locationName',
          value: 'locationCode',
        },
        onChange: () => vSearchForm.current?.submit(),
      },
      request: async () => {
        const resp = await apiBanners.getShowLocations();
        if (resp.code === 200) {
          return resp.data;
        }
        return [];
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: '已下架' },
        1: { text: '已上架' },
      },
      fieldProps: {
        onChange: () => vSearchForm.current?.submit(),
      },
      render: (_, { status, id }) => (
        <Switch
          checkedChildren={'已上架'}
          checked={!!status}
          onChange={async (v) => {
            message.loading('处理中...', 0);
            const resp = await apiBanners.switchStatus(+id, +v);
            if (resp.code === 200) {
              setDataSource((prev) =>
                prev.map((item) =>
                  item.id === id ? { ...item, status: +v } : { ...item },
                ),
              );
              message.success(v ? '已上架' : '已下架');
            }
          }}
        />
      ),
    },
    { title: '权重', dataIndex: 'weight', search: false },
    {
      title: '跳转链接',
      tooltip: '请填写 Scheme 地址',
      dataIndex: 'jumpUrl',
      ellipsis: true,
      search: false,
      copyable: true,
    },
    {
      title: '展示时间',
      key: 'showTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '展示开始时间',
      dataIndex: 'startTime',
      search: false,
    },
    {
      title: '展示结束时间',
      dataIndex: 'endTime',
      search: false,
    },

    {
      title: '操作',
      key: 'action',
      search: false,
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              vForm.current?.setFieldsValue({
                ...record,
                showTime: [record.startTime, record.endTime],
              });
              setOpenForm(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title={'确定删除？'}
            onConfirm={async () => {
              message.loading('处理中...', 0);
              const resp = await apiBanners.del(record.id);
              if (resp.code === 200) {
                if (current > Math.ceil((total - 1) / pageSize)) {
                  setCurrent((prev) => prev - 1);
                }
                setTips('删除成功');
                vTable.current?.reload!();
              }
            }}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // -- renders
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
          新建
        </Button>,
      ]}
    >
      {/* 表格 */}
      <ProTable<API.BannerProps>
        actionRef={vTable}
        formRef={vSearchForm}
        dataSource={dataSource}
        columns={columns}
        rowKey={'id'}
        scroll={{ x: 1000 }}
        options={false}
        search={{ labelWidth: 'auto' }}
        pagination={{
          current,
          pageSize,
          hideOnSinglePage: true,
          style: { paddingBottom: 16 },
          onChange: (page, pageSize) => {
            setCurrent(page);
            setPageSize(pageSize);
          },
        }}
        postData={(data: API.BannerProps[]) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params) => {
          if (params.showTime) {
            params.start = `${params.showTime[0]} 00:00:00`;
            params.end = `${params.showTime[1]} 23:59:59`;
            delete params.showTime;
          }
          const resp = await apiBanners.list(params);
          setDataSource(resp.data.data || []);
          setTotal(resp.data.total);
          return Promise.resolve({
            data: resp.data.data || [],
            success: true,
            total: resp.data.total,
          });
        }}
      />
      {/* 新建表单 */}
      <ModalForm
        formRef={vForm}
        title={
          !!vForm.current?.getFieldValue('id') ? '编辑轮播图' : '新建轮播图'
        }
        open={openForm}
        width={500}
        modalProps={{
          maskClosable: false,
          forceRender: true,
          destroyOnClose: true,
          onCancel: () => setOpenForm(false),
        }}
        onFinish={async (values) => {
          // -- 处理参数
          values.start = values.showTime[0];
          values.end = values.showTime[1];
          delete values.showTime;
          message.loading('处理中...', 0);
          const isEdit = !!values.id;
          const fetchFn = isEdit ? apiBanners.edit : apiBanners.add;
          const resp = await fetchFn(values);

          if (resp.code === 200) {
            setTips(isEdit ? '编辑成功' : '添加成功');
            vTable.current?.reload!();
            setOpenForm(false);
          }
        }}
      >
        <ProFormText noStyle hidden name="id" />
        <ProForm.Item
          label="轮播图片"
          name="bannerPic"
          rules={[{ required: true, message: '请上传轮播图' }]}
        >
          <UploadImage width={200} />
        </ProForm.Item>
        <ProForm.Group>
          <ProFormDigit
            label="权重"
            tooltip="数值越大越靠前，权重相同时根据根据创建时间排序。"
            name="weight"
            placeholder={'请输入权重'}
            fieldProps={{
              style: { width: 110 },
            }}
          />
          <ProFormSelect
            name="locationCode"
            label="展示位置"
            fieldProps={{
              fieldNames: {
                label: 'locationName',
                value: 'locationCode',
              },
              style: { width: 150 },
            }}
            request={async () => {
              const resp = await apiBanners.getShowLocations();
              if (resp.code === 200) {
                return resp.data;
              }
              return [];
            }}
            rules={[{ required: true }]}
          />
        </ProForm.Group>
        <ProFormDateTimeRangePicker
          label="展示时间"
          name="showTime"
          rules={[{ required: true }]}
          fieldProps={{
            format: 'YYYY-MM-DD HH:mm',
          }}
        />
        <ProFormTextArea
          allowClear
          label="跳转链接"
          tooltip="请填写 Scheme 地址"
          name="jumpUrl"
          placeholder={'请输入跳转链接'}
          rules={[{ required: true }]}
        />
      </ModalForm>
    </PageContainer>
  );
}
