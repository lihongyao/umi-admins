import { apiNews } from '@/api/apiServer';
import PhoneModel from '@/components/@lgs/PhoneModel';
import Utils from '@/utils';
import { HomeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { App, Button, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';

export default function Page() {
  // -- APPs
  const navigate = useNavigate();
  const { message } = App.useApp();
  // - refs
  const vTable = useRef<ActionType>();
  const vSearchForm = useRef<ProFormInstance>();
  // -- state
  const [title, setTitle] = useState('');
  const [htmlString, setHtmlString] = useState('');
  const [tips, setTips] = useState('');

  const onSwitchStatus = async (data: { id: number; status: number }) => {
    message.loading('处理中...', 0);
    const resp = await apiNews.switchStatus(data);
    if (resp.code === 200) {
      setTips(data.status ? '已发布' : '已下架');
      vTable.current?.reload();
    }
  };

  // -- columns
  const columns: Array<ProColumns<API.NewsProps>> = [
    {
      dataIndex: 'publish_time',
      hideInTable: true,
      valueType: 'dateRange',
      fieldProps: { placeholder: ['开始时间', '结束时间'] },
    },
    {
      dataIndex: 'type',
      hideInTable: true,
      valueEnum: {
        1: { text: '案例新闻' },
        2: { text: '动态新闻' },
      },
      fieldProps: {
        placeholder: '请选择新闻类型',
        onChange: () => vSearchForm.current?.submit(),
      },
    },
    {
      dataIndex: 'status',
      hideInTable: true,
      valueEnum: {
        0: { text: '未发布', status: 'Default' },
        1: { text: '已发布', status: 'Processing' },
      },
      fieldProps: {
        placeholder: '请选择新闻状态',
        onChange: () => vSearchForm.current?.submit(),
      },
    },
    {
      dataIndex: 'title',
      hideInTable: true,
      fieldProps: { placeholder: '请输入新闻标题', suffix: <SearchOutlined /> },
    },
    {
      dataIndex: 'published_by',
      hideInTable: true,
      fieldProps: { placeholder: '请输入发布人员', suffix: <SearchOutlined /> },
    },
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 60 },
    { title: '新闻标题', dataIndex: 'title', search: false },
    {
      title: '新闻类型',
      dataIndex: 'type',
      search: false,
      valueEnum: {
        1: { text: '案例新闻' },
        2: { text: '动态新闻' },
      },
    },
    { title: '发布人员', dataIndex: 'published_by', search: false },
    { title: '发布时间', dataIndex: 'publish_time', search: false },
    {
      title: '新闻状态',
      dataIndex: 'status',
      search: false,
      valueEnum: {
        0: { text: '未发布', status: 'Default' },
        1: { text: '已发布', status: 'Processing' },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/news/details/${record.id}`)}>
            详情
          </Button>
          <Button
            onClick={() => {
              setHtmlString(record.content);
            }}
          >
            详情
          </Button>
          <Button onClick={() => navigate(`/news/edit/${record.id}`)}>
            编辑
          </Button>
          {record.status === 0 && (
            <Popconfirm
              title={'确定发布？'}
              onConfirm={() => onSwitchStatus({ id: record.id, status: 1 })}
            >
              <Button>发布</Button>
            </Popconfirm>
          )}
          {record.status === 1 && (
            <Popconfirm
              title={'确定下架？'}
              onConfirm={() => onSwitchStatus({ id: record.id, status: 0 })}
            >
              <Button danger>下架</Button>
            </Popconfirm>
          )}
          <Popconfirm
            title={'确定删除？'}
            onConfirm={async () => {
              message.loading('处理中，请稍后...', 0);
              const resp = await apiNews.del(record.id);
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
          { title: '新闻管理' },
        ],
      }}
      extra={[
        <Button key={'create'} onClick={() => navigate('/news/create')}>
          <PlusOutlined />
          <span>新建</span>
        </Button>,
      ]}
    >
      <ProTable<API.NewsProps>
        actionRef={vTable}
        formRef={vSearchForm}
        headerTitle={' '}
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
        postData={(data: API.NewsProps[]) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params) => {
          const resp = await apiNews.list(params);
          if (resp.code === 200) {
            return Promise.resolve({
              data: resp.data.data,
              total: resp.data.total,
            });
          }
          return Promise.resolve({
            data: [],
            total: 0,
          });
        }}
      />
      {/* modals */}
      <PhoneModel
        open={!!htmlString}
        onCancel={() => setHtmlString('')}
        __html={htmlString}
        title={title}
      />
    </PageContainer>
  );
}
