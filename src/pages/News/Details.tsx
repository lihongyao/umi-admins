import { apiNews } from '@/api/apiServer';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Space } from 'antd';
import { useEffect, useState } from 'react';
export default function Details() {
  const params = useParams<{ id: string }>();
  const [details, setDetails] = useState<API.NewsProps | null>(null);
  const getDetails = async () => {
    if (params.id) {
      const resp = await apiNews.details(+params.id);
      if (resp.code === 200) {
        setDetails(resp.data);
      }
    }
  };
  useEffect(() => {
    getDetails();
  }, []);

  return (
    <PageContainer loading={!details}>
      <Space direction={'vertical'} className=" w-full">
        <ProCard>
          <h1 className="text-2xl">{details?.title}</h1>
          <Space className="my-2  text-gray-400" size={'large'}>
            <span>
              新闻类型：
              {details ? (details.type === 1 ? '行业动态' : '公司动态') : '-'}
            </span>
            <span>发布时间：{details?.publish_time}</span>
            <span>来源：{details?.source}</span>
          </Space>
        </ProCard>

        <ProCard>
          <div dangerouslySetInnerHTML={{ __html: details?.content || '' }} />
        </ProCard>
      </Space>
    </PageContainer>
  );
}
