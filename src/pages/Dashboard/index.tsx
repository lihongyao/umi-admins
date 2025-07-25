import { HomeOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Space } from 'antd';

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
      <ProCard>
        <h1 className="text-[#eee] text-center m-0 text-4xl -tracking-wider py-20">
          — Umi Admins —
        </h1>
      </ProCard>
    </PageContainer>
  );
}
