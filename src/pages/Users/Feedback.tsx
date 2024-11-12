import { apiUser } from '@/api/apiServer';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Avatar } from 'antd';

export default function Page() {
  // -- columns
  const columns: ProColumns<API.FeedbackProps>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },
    {
      title: '用户头像',
      dataIndex: 'avatarUrl',
      search: false,
      render: (_, { avatarUrl }) => (
        <Avatar src={avatarUrl} size={50} shape={'square'} />
      ),
    },
    { title: '用户昵称', dataIndex: 'nickname' },
    { title: '联系电话', dataIndex: 'phone', copyable: true },
    {
      title: '反馈时间',
      dataIndex: 'createTime',
      search: false,
    },
    { title: '反馈内容', dataIndex: 'content', search: false },
  ];

  // -- rnders
  return (
    <PageContainer>
      <ProTable<API.FeedbackProps>
        columns={columns}
        rowKey="id"
        options={false}
        search={{ span: 6, labelWidth: 'auto' }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          hideOnSinglePage: true,
          style: { paddingBottom: 16 },
        }}
        request={async (params) => {
          params.page = params.current;
          delete params.current;
          const resp = await apiUser.feedbacks(params);
          return Promise.resolve({
            data: resp.data.data || [],
            success: true,
            total: resp.data.total,
          });
        }}
      />
    </PageContainer>
  );
}
