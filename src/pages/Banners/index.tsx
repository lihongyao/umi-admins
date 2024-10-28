import { apiBanners } from '@/api/apiServer';
import ImageBox from '@/components/@lgs/ImageBox';
import UploadForOSS from '@/components/@lgs/UploadForOSS';
import { PlusOutlined, SwapRightOutlined } from '@ant-design/icons';

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
import { App, Button, Space, Switch } from 'antd';
import React, { useRef, useState } from 'react';

const Banners: React.FC = () => {
  // -- APPs
  const { message } = App.useApp();
  // -- refs
  const vTable = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();

  // -- status
  const [dataSource, setDataSource] = useState<Array<API.BannerItemProps>>([]);
  const [tips, setTips] = useState('');
  const [openForm, setOpenForm] = useState(false);
  // -- effects

  // -- columns
  const columns: Array<ProColumns<API.BannerItemProps>> = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },

    {
      title: '图片预览',
      dataIndex: 'bannerPic',
      search: false,
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
        0: { text: '已禁用' },
        1: { text: '已启用' },
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
      width: 300,
      render: (_, { startTime, endTime }) => (
        <Space>
          <span>{startTime}</span>
          <SwapRightOutlined />
          <span>{endTime}</span>
        </Space>
      ),
    },

    {
      title: '操作',
      key: 'action',
      search: false,
      render: (_, record) => (
        <Button
          onClick={() => {
            vForm.current?.setFieldsValue({
              ...record,
              bannerPic: [{ url: record.bannerPic }],
              showTime: [record.startTime, record.endTime],
            });
            setOpenForm(true);
          }}
        >
          编辑
        </Button>
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
      <ProTable<API.BannerItemProps>
        actionRef={vTable}
        dataSource={dataSource}
        columns={columns}
        rowKey={'id'}
        scroll={{ x: 1000 }}
        options={false}
        search={{ span: 6, labelWidth: 'auto' }}
        pagination={{
          hideOnSinglePage: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        postData={(data: API.BannerItemProps[]) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params) => {
          params.pageNo = params.current;
          delete params.current;
          if (params.showTime) {
            params.start = `${params.showTime[0]} 00:00:00`;
            params.end = `${params.showTime[1]} 23:59:59`;
            delete params.showTime;
          }
          const resp = await apiBanners.list(params);
          setDataSource(resp.data.data || []);
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
          forceRender: true,
          onCancel: () => setOpenForm(false),
        }}
        onFinish={async (values) => {
          // -- 处理参数
          values.bannerPic = values.bannerPic[0].url;
          values.start = values.showTime[0];
          values.end = values.showTime[1];
          delete values.showTime;
          message.loading('处理中...', 0);
          const isEdit = !!values.id;
          const fetchFn = isEdit ? apiBanners.edit : apiBanners.add;
          const resp = await fetchFn(values);

          if (resp.code === 200) {
            setTips(isEdit ? '编辑成功' : '添加成功');
            vTable.current?.reloadAndRest!();
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
          <UploadForOSS dir="banner" />
        </ProForm.Item>

        <ProFormDigit
          label="权重"
          tooltip="数值越大越靠前，权重相同时根据根据创建时间排序。"
          name="weight"
          placeholder={'请输入权重'}
        />
        <ProFormTextArea
          allowClear
          label="跳转链接"
          tooltip="请填写 Scheme 地址"
          name="jumpUrl"
          placeholder={'请输入跳转链接'}
          rules={[{ required: true }]}
        />
        <ProFormDateTimeRangePicker
          label="展示时间"
          name="showTime"
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="locationCode"
          label="展示位置"
          fieldProps={{
            fieldNames: {
              label: 'locationName',
              value: 'locationCode',
            },
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
      </ModalForm>
    </PageContainer>
  );
};

export default Banners;
