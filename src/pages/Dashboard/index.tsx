import { HomeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Space } from 'antd';
import GroupBarChat from './components/GroupBarChat';
import HorizontalBarChart from './components/HorizontalBarChart';
import HorizontalBarXChart from './components/HorizontalBarXChart';
export default function Page() {
  const navigate = useNavigate();
  return (
    <PageContainer
      title={false}
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
          { title: '数据看板' },
        ],
      }}
    >
      <div className="bg-white p-6 rounded-xl flex flex-col gap-6">
        <div className="w-1/2 h-[300px] mx-auto">
          <GroupBarChat />
        </div>
        <div className="flex justify-center">
          <div className="w-[300px] ">
            <HorizontalBarChart />
          </div>
          <div className="w-[300px] ">
            <HorizontalBarXChart />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
