import { PageContainer, ProCard } from '@ant-design/pro-components';
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <PageContainer title={false}>
      <ProCard>
        <h1 className="text-[#eee] text-center m-0 text-4xl -tracking-wider py-20">
          — Umi Admins —
        </h1>
      </ProCard>
    </PageContainer>
  );
};

export default Dashboard;
