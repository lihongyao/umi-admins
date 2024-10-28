import { apiNews } from '@/api/apiServer';
import PhoneModel from '@/components/@lgs/PhoneModel';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { App, Button, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
const News: React.FC = () => {
  // -- APPs
  const { modal } = App.useApp();
  const navigate = useNavigate();
  // - refs
  const vTable = useRef<ActionType>();

  // -- state
  const [title, setTitle] = useState('');
  const [htmlString, setHtmlString] = useState('');

  // -- columns
  const columns: Array<ProColumns<API.NewsItemProps>> = [
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
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      valueEnum: {
        1: { text: '文明实践' },
        2: { text: '爱国卫生月' },
        3: { text: '志愿服务' },
      },
    },
    {
      title: '新闻详情',
      key: 'content',
      search: false,
      render: (_, { content, title }) => (
        <a
          onClick={() => {
            setTitle(title);
            setHtmlString(content);
          }}
        >
          <span>查看详情</span>
          <RightOutlined />
        </a>
      ),
    },
    { title: '发布时间', dataIndex: 'date', search: false },
    {
      title: '操作',
      key: 'action',
      search: false,
      width: 120,
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/news/edit/${record.id}`)}>
            编辑
          </Button>
          <Popconfirm
            placement={'leftTop'}
            title={'温馨提示'}
            description={'您确定要删除该记录么？'}
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
      <ProTable<API.NewsItemProps>
        actionRef={vTable}
        headerTitle={' '}
        options={false}
        search={{ span: 6, labelWidth: 'auto' }}
        scroll={{ x: 1200 }}
        columns={columns}
        rowKey="id"
        pagination={{
          hideOnSinglePage: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        request={async (params) => {
          params.page = params.current;
          delete params.current;
          const resp = await apiNews.list(params);
          return Promise.resolve({
            data: resp.data.data || [],
            success: true,
            totla: resp.data.total,
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
};

export default News;
