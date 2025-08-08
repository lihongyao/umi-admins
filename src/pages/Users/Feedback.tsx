import { apiUser } from '@/api/apiServer';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Avatar, Space } from 'antd';

export default function Page() {
  const navigate = useNavigate();
  // -- columns
  const columns: ProColumns<API.FeedbackProps>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },
    {
      dataIndex: 'keywords',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入用户昵称/联系电话',
        suffix: <SearchOutlined />,
      },
    },
    {
      title: '用户头像',
      dataIndex: 'avatarUrl',
      search: false,
      render: (_, { avatarUrl }) => (
        <Avatar src={avatarUrl} size={50} shape={'square'} />
      ),
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      search: false,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      copyable: true,
      search: false,
    },
    {
      title: '反馈时间',
      dataIndex: 'createTime',
      search: false,
    },
    { title: '反馈内容', dataIndex: 'content', search: false, ellipsis: true },
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
          { title: <a onClick={() => navigate('/users/list')}>用户管理</a> },
          { title: '用户反馈' },
        ],
      }}
    >
      <ProTable<API.FeedbackProps>
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
        request={async (params, sorter) => {
          params.sorter = Object.keys(sorter).length
            ? JSON.stringify(sorter)
            : undefined;
          const resp = await apiUser.feedbacks(params);
          return Promise.resolve({
            success: true,
            data: resp?.data?.items || [],
            total: resp?.data?.total || 0,
          });
        }}
      />
    </PageContainer>
  );
}
