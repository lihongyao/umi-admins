import { apiSys } from '@/api/apiServer';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';

export default function Logs() {
  const columns: ProColumns<API.LogsProps>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },
    { title: '操作人', dataIndex: 'nickname' },
    { title: '操作时间', dataIndex: 'createTime', search: false },
    { title: '操作内容', dataIndex: 'content', search: false },
  ];
  return (
    <PageContainer>
      <ProTable<API.LogsProps>
        headerTitle={' '}
        columns={columns}
        rowKey="id"
        options={false}
        search={{ labelWidth: 'auto' }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        request={async (params) => {
          const resp = await apiSys.logs(params);
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
