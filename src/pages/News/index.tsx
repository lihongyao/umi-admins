import { apiNews } from '@/api/apiServer';
import PhoneModel from '@/components/@lgs/PhoneModel';
import { MobileOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

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
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
    },
    { title: '新闻标题', dataIndex: 'title' },
    {
      title: '新闻类型',
      dataIndex: 'type',
      valueEnum: {
        1: { text: '案例新闻' },
        2: { text: '动态新闻' },
      },
      fieldProps: {
        onChange: () => vSearchForm.current?.submit(),
      },
    },
    { title: '发布人员', dataIndex: 'published_by' },
    { title: '发布时间', dataIndex: 'publish_time' },
    {
      title: '新闻状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '未发布', status: 'Default' },
        1: { text: '已发布', status: 'Processing' },
      },
      fieldProps: {
        onChange: () => vSearchForm.current?.submit(),
      },
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      width: 120,
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
            <MobileOutlined />
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
              message.loading('处理中...', 0);
              const resp = await apiNews.del(record.id);
              if (resp.code === 200) {
                if (current > Math.ceil((total - 1) / pageSize)) {
                  setCurrent((prev) => prev - 1);
                }
                setTips('删除成功');
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
        options={false}
        scroll={{ x: 1200 }}
        columns={columns}
        rowKey="id"
        search={{ span: 6, labelWidth: 'auto' }}
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
        postData={(data: API.NewsProps[]) => {
          tips && message.success(tips);
          setTips('');
          return data;
        }}
        request={async (params) => {
          const resp = await apiNews.list(params);
          setTotal(resp.data.total);
          return Promise.resolve({
            data: resp.data.data || [],
            success: true,
            total: resp.data.total,
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
