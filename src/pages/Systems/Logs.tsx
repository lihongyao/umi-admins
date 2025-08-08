import { apiSys } from '@/api/apiServer';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Space } from 'antd';

export default function Page() {
  const navigate = useNavigate();
  const columns: ProColumns<API.LogsProps>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },
    {
      dataIndex: 'nickname',
      hideInTable: true,
      fieldProps: { placeholder: '请输入操作人', suffix: <SearchOutlined /> },
    },
    { title: '操作人', dataIndex: 'nickname', search: false },
    { title: '操作时间', dataIndex: 'createTime', search: false },
    { title: '操作内容', dataIndex: 'content', search: false },
  ];
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
          { title: <a onClick={() => navigate('/systems/roles')}>系统管理</a> },
          { title: '操作日志' },
        ],
      }}
    >
      <ProTable<API.LogsProps>
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
          const resp = await apiSys.logs(params);
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
