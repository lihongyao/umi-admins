import Utils from '@/utils';
import { BellOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import Bus from '@likg/bus';
import { useMount, useUnmount } from 'ahooks';
import { Avatar, Badge, Modal } from 'antd';
import { useRef, useState } from 'react';
import ic_change_price_src from './images/ic_change_price.png';
import ic_notice_src from './images/ic_notice.png';
import ic_refund_src from './images/ic_refund.png';
const defaultData = [
  {
    id: '1',
    title: '代理商申请',
    code: '202510210001',
    description: '销售【张三 19938060716】申请一级代理',
    date: Date.now(),
    icon: ic_notice_src,
  },
  {
    id: '2',
    title: '改价申请',
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】申请改价',
    date: Date.now(),
    icon: ic_change_price_src,
  },
  {
    id: '3',
    title: '续签申请',
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】申请续签',
    date: Date.now(),
    icon: ic_notice_src,
  },
  {
    id: '4',
    title: '退款申请',
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】申请退款',
    date: Date.now(),
    icon: ic_refund_src,
  },
  {
    id: '5',
    title: '签约提醒',
    code: '202510210001',
    description: '客户【张三 19938060716】已签约',
    date: Date.now(),
    icon: ic_refund_src,
  },
  {
    id: '6',
    title: '签约提醒',
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】已签约',
    date: Date.now() + 24 * 60 * 60 * 1000,
    icon: ic_refund_src,
  },
];

type DataItem = (typeof defaultData)[number];
export default function AppNotices() {
  const timer = useRef<NodeJS.Timeout>();
  const [dataSource, setDataSource] = useState<DataItem[]>([]);
  const [open, setOpen] = useState(false);

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
        width={500}
        footer={null}
      >
        <ProList<DataItem>
          rowKey="id"
          ghost
          dataSource={dataSource}
          showActions="hover"
          onDataSourceChange={setDataSource}
          onRow={(record) => ({
            onClick: () => {
              console.log('点击行数据:', record);
            },
          })}
          metas={{
            title: { dataIndex: 'title' },
            avatar: {
              dataIndex: 'icon',
              editable: false,
              render: (_, entity) => <Avatar src={entity.icon} size={50} />,
            },
            description: {
              dataIndex: 'description',
              render(dom, entity, index, action, schema) {
                return (
                  <div>
                    <div>{entity.description}</div>
                    <div>{Utils.formatTimestamp(entity.date)}</div>
                  </div>
                );
              },
            },
            subTitle: {
              render: (_, entity) => <div>申请编号：{entity.code}</div>,
            },
          }}
        />
      </Modal>
    </>
  );
}
