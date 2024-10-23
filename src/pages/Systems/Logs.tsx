import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import Tools from '@likg/tools';
import React from 'react';

const Logs: React.FC = () => {
  // - methods
  const recursive = (arr: API.SystemsAccessProps[]): any => {
    return arr.map((item) => ({
      title: item.name,
      key: item.id,
      children: item.children ? recursive(item.children) : undefined,
    }));
  };

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
        search={false}
        options={false}
        pagination={{
          hideOnSinglePage: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        request={async () => {
          return Promise.resolve({
            data: [
              {
                id: 1,
                nickname: '李鸿耀同学',
                content: '新建商品',
                createTime: Tools.dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
              },
            ],
            success: true,
            total: 1,
          });
        }}
      />
    </PageContainer>
  );
};

export default Logs;
