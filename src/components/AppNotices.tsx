import Utils from '@/utils';
import { BellOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import Bus from '@likg/bus';
import { useNavigate } from '@umijs/max';
import { useMount, useUnmount } from 'ahooks';
import { Avatar, Badge, Modal } from 'antd';
import { useRef, useState } from 'react';
import ic_agent_apply_src from './images/ic_agent_apply.png';
import ic_change_price_src from './images/ic_change_price.png';
import ic_refund_src from './images/ic_refund.png';
import ic_renewal_src from './images/ic_renewal.png';
import ic_signing_src from './images/ic_signing.png';
const defaultData = [
  {
    id: '1',
    business: 1,
    code: '202510210001',
    description: '销售【张三 19938060716】申请一级代理',
    createAt: Date.now(),
  },
  {
    id: '2',
    business: 2,
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】申请改价',
    createAt: Date.now(),
  },
  {
    id: '3',
    business: 3,
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】申请续签',
    createAt: Date.now(),
  },
  {
    id: '4',
    business: 4,
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】申请退款',
    createAt: Date.now(),
  },
  {
    id: '5',
    business: 4,
    code: '202510210001',
    description: '客户【张三 19938060716】已签约',
    createAt: Date.now(),
  },
  {
    id: '6',
    business: 4,
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】已签约',
    createAt: Date.now() + 24 * 60 * 60 * 1000,
  },
];

const businessEnum: Record<number, string> = {
  1: '代理商申请',
  2: '改价申请',
  3: '续签申请',
  4: '退款申请',
  5: '签约提醒',
};
const businessPath: Record<number, string> = {
  1: '/agent/application?q=notice',
  2: '/orders?q=notice&tab=1',
  3: '/orders?q=notice&tab=2',
  4: '/orders?q=notice&tab=2',
};
const businessIcon: Record<number, string> = {
  1: ic_agent_apply_src,
  2: ic_change_price_src,
  3: ic_renewal_src,
  4: ic_refund_src,
  5: ic_signing_src,
};

type DataItem = (typeof defaultData)[number];
export default function AppNotices() {
  const timer = useRef<NodeJS.Timeout>();
  const [dataSource, setDataSource] = useState<DataItem[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const getNotices = async () => {
    setDataSource(defaultData);
  };

  useMount(async () => {
    // 1. 获取通知
    getNotices();
    // 2. 启用定时器，每分钟获取一次通知
    timer.current = setInterval(getNotices, 50 * 1000);
    // 3. 监听刷新通知
    Bus.$on('refreshNotices', getNotices);
  });

  useUnmount(() => {
    // 清除定时器
    if (timer.current) clearInterval(timer.current);
  });

  return (
    <>
      <Badge
        key={'badge'}
        count={dataSource.length}
        size="small"
        offset={[0, 5]}
      >
        <Avatar
          style={{ backgroundColor: '#1890ff' }}
          size={'small'}
          onClick={() => setOpen(true)}
        >
          <BellOutlined style={{ color: '#fff', fontSize: 20 }} />
        </Avatar>
      </Badge>
      <Modal
        title={'消息通知'}
        open={open}
        onCancel={() => setOpen(false)}
        width={400}
        footer={null}
        styles={{
          header: { padding: 16 },
          content: { padding: 0 },
        }}
      >
        <div className="max-h-[500px] overflow-y-auto scroll-wrapper px-4">
          <ProList<DataItem>
            rowKey="id"
            ghost
            dataSource={dataSource}
            showActions="hover"
            onDataSourceChange={setDataSource}
            onRow={(record) => ({
              onClick: () => {
                console.log('点击行数据:', record);
                const path = businessPath[record?.business];
                if (path) navigate(`${path}&code=${record?.code}`);
                setOpen(false);
              },
            })}
            metas={{
              title: {
                dataIndex: 'title',
                render(dom, entity, index, action, schema) {
                  return (
                    <div className="font-bold">
                      {businessEnum[entity?.business]}
                    </div>
                  );
                },
              },
              avatar: {
                dataIndex: 'icon',
                editable: false,
                render: (_, entity) => (
                  <Avatar src={businessIcon[entity?.business]} size={50} />
                ),
              },
              description: {
                dataIndex: 'description',
                render(dom, entity, index, action, schema) {
                  return (
                    <div className="text-gray-700">
                      <div>{entity?.description}</div>
                      <div className="text-sm mt-1 text-gray-400">
                        {Utils.formatTimestamp(entity.createAt)}
                      </div>
                    </div>
                  );
                },
              },
              subTitle: {
                render: (_, entity) => (
                  <div className="text-gray-700 -ml-2">
                    申请编号：{entity.code}
                  </div>
                ),
              },
            }}
          />
        </div>
      </Modal>
    </>
  );
}
