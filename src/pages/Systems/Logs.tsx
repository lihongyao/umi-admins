import { apiSys } from '@/api/apiServer';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';

export default function Page() {
  // -- columns
  const columns: ProColumns<API.LogsProps>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },
    { title: '操作人', dataIndex: 'nickname' },
    { title: '操作时间', dataIndex: 'createTime', search: false },
    { title: '操作内容', dataIndex: 'content', search: false },
  ];
  return (
    <PageContainer>
      <ProTable<API.LogsProps>
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
          const resp = await apiSys.logs(params);
          return Promise.resolve({
            success: true,
            data: resp.data.data || [],
            total: resp.data.total,
          });
        }}
      />
    </PageContainer>
  );
}
