import { apiUser } from '@/api/apiServer';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useRef, useState } from 'react';

const Feedback: React.FC = () => {
  // - refs
  const vTable = useRef<ActionType>();
  // -- state
  const [tips, setTips] = useState('');

  // -- columns
  const columns: ProColumns<API.FeedbackItemProps>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 50 },
    {
      title: '反馈时间',
      dataIndex: 'createTime',
      search: false,
      width: 180,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      search: false,
      width: 100,
    },
    { title: '联系电话', dataIndex: 'phone', copyable: true, width: 160 },
    { title: '反馈内容', dataIndex: 'content', search: false },
  ];

  // -- rnders
  return (
    <PageContainer>
      <ProTable<API.FeedbackItemProps>
        actionRef={vTable}
        headerTitle={' '}
        columns={columns}
        rowKey="id"
        options={false}
        pagination={false}
        postData={(data: Array<API.FeedbackItemProps>) => {
          tips && message.success(tips);
          setTips('');
          return data;
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
};

export default Feedback;
