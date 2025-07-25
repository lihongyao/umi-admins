import { HomeOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Menu, Space } from 'antd';
import { useState } from 'react';
import Basic from './components/Basic';
import Categories from './components/Categories';
import Types from './components/Types';
export default function Page() {
  const navigate = useNavigate();
  const menus: Record<string, string> = {
    base: '基础配置',
    categories: '装备类型',
    types: '车辆类型',
  };
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['base']);
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
          { title: '配置管理' },
        ],
      }}
    >
      <ProCard>
        <div className="w-full h-full py-4 bg-white flex">
          <div className="w-52 border-r border-solid border-orange-600">
            <Menu
              className="w-52 h-full"
              mode={'inline'}
              selectedKeys={selectedKeys}
              items={Object.keys(menus).map((key) => ({
                key,
                label: menus[key],
              }))}
              onClick={({ key }) => setSelectedKeys([key])}
            />
          </div>
          <div className="h-full flex-1 py-2 px-5 ">
            {/* 标题 */}
            <div className="text-2xl mb-4">{menus[selectedKeys[0]]}</div>
            {selectedKeys.includes('base') && <Basic />}
            {selectedKeys.includes('categories') && <Categories />}
            {selectedKeys.includes('types') && <Types />}
          </div>
        </div>
      </ProCard>
    </PageContainer>
  );
}
