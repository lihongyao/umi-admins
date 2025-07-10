import { BellOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { Avatar, Badge, Modal } from 'antd';
import { useState } from 'react';
import ic_change_price_src from './images/ic_change_price.png';
import ic_notice_src from './images/ic_notice.png';
import ic_refund_src from './images/ic_refund.png';
const defaultData = [
  {
    id: '1',
    title: '代理商申请',
    code: '202510210001',
    description: '销售【张三 19938060716】申请一级代理',
    date: '今天 12:30:18',
    icon: ic_notice_src,
  },
  {
    id: '2',
    title: '改价申请',
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】申请改价',
    date: '今天 12:30:18',
    icon: ic_change_price_src,
  },
  {
    id: '3',
    title: '续签申请',
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】申请续签',
    date: '今天 12:30:18',
    icon: ic_notice_src,
  },
  {
    id: '4',
    title: '退款申请',
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】申请退款',
    date: '今天 12:30:18',
    icon: ic_refund_src,
  },
  {
    id: '5',
    title: '签约提醒',
    code: '202510210001',
    description: '客户【张三 19938060716】已签约',
    date: '今天 12:30:18',
    icon: ic_refund_src,
  },
  {
    id: '6',
    title: '签约提醒',
    code: '202510210001',
    description: '代理商【四川君越科技有限公司】已签约',
    date: '今天 12:30:18',
    icon: ic_refund_src,
  },
];

type DataItem = (typeof defaultData)[number];
export default function AppNotices() {
  const [dataSource, setDataSource] = useState<DataItem[]>(defaultData);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Badge key={'badge'} count={3} size="small" offset={[0, 5]}>
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
          editable={{
            onSave: async (key, record, originRow) => {
              console.log(key, record, originRow);
              return true;
            },
          }}
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
                    <div>{entity.date}</div>
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
