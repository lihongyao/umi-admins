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
      width: 100,
      render: (_, { avatarUrl }) => (
        <Avatar src={avatarUrl} size={50} shape={'square'} />
      ),
    },
    { title: '用户昵称', dataIndex: 'nickname', width: 100 },
    { title: '联系电话', dataIndex: 'phone', copyable: true, width: 150 },
    {
      title: '反馈时间',
      dataIndex: 'createTime',
      search: false,
      width: 250,
    },
    { title: '反馈内容', dataIndex: 'content', search: false, ellipsis: true },
  ];

  // -- rnders
  return (
    <PageContainer>
      <ProTable<API.FeedbackProps>
        headerTitle={' '}
        columns={columns}
        rowKey="id"
        options={false}
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 'auto', collapsed: false, collapseRender: false }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        request={async (params) => {
          params.page = params.current;
          delete params.current;
          const resp = await apiUser.feedbacks(params);
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
    </PageContainer>
  );
}
