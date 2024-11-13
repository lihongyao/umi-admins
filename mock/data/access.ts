import { mock } from 'mockjs';

export default mock([
  {
    code: 'DASHBOARD',
    name: '数据看板',
    id: '63fdbb6095339b3d36e729d6',
  },
  {
    code: 'BANNER',
    name: '轮播广告',
    id: '63fdbb7695339b3d36e729d9',
    children: [
      {
        parentId: '63fdbb7695339b3d36e729d9',
        code: 'BANNER_ADD',
        name: '添加轮播图',
        id: '63fdbb8795339b3d36e729dc',
      },
      {
        parentId: '63fdbb7695339b3d36e729d9',
        code: 'BANNER_EDIT',
        name: '编辑轮播图',
        id: '63fdbb9895339b3d36e729df',
      },
      {
        parentId: '63fdbb7695339b3d36e729d9',
        code: 'BANNER_SWITCH_STATUS',
        name: '启用或禁用轮播图',
        id: '63fdbbd795339b3d36e729e2',
      },
    ],
  },
  {
    code: 'GOODS',
    name: '商品管理',
    id: '63fdbbfa95339b3d36e729ec',
    children: [
      {
        parentId: '63fdbbfa95339b3d36e729ec',
        code: 'GOODS_ADD',
        name: '添加商品',
        id: '63fdbc0a95339b3d36e729ef',
      },
      {
        parentId: '63fdbbfa95339b3d36e729ec',
        code: 'GOODS_EDIT',
        name: '编辑商品',
        id: '63fdbc1a95339b3d36e729f2',
      },
      {
        parentId: '63fdbbfa95339b3d36e729ec',
        code: 'GOODS_SWITCH_STATUS',
        name: '商品上下架',
        id: '63fdbc3a95339b3d36e729f5',
      },
    ],
  },
  {
    code: 'ORDERS',
    name: '订单管理',
    id: '63fdbc5495339b3d36e729f8',
    children: [
      {
        parentId: '63fdbc5495339b3d36e729f8',
        code: 'ORDERS_DELIVERY',
        name: '立即发货',
        id: '63fdbc6f95339b3d36e729fb',
      },
    ],
  },
  {
    code: 'USERS',
    name: '用户列表',
    id: '63fdbc7e95339b3d36e729fe',
  },
  {
    code: 'FEEDBACK',
    name: '意见反馈',
    id: '63fdbc8d95339b3d36e72a01',
  },
  {
    code: 'CFG',
    name: '配置中心',
    id: '63fdbc9e95339b3d36e72a04',
    children: [
      {
        parentId: '63fdbc9e95339b3d36e72a04',
        code: 'CFG_HOTLINE',
        name: '配置咨询电话',
        id: '63fdbd1695339b3d36e72a1b',
      },
      {
        parentId: '63fdbc9e95339b3d36e72a04',
        code: 'CFG_CATEGORIES',
        name: '配置商品分类',
        id: '63fdbd2b95339b3d36e72a1e',
      },
    ],
  },
  {
    code: 'SYS',
    name: '系统管理',
    id: '63fdbcaf95339b3d36e72a07',
    children: [
      {
        parentId: '63fdbcaf95339b3d36e72a07',
        code: 'SYS_ACCESS',
        name: '权限管理',
        id: '63fdbcc595339b3d36e72a0a',
      },
      {
        parentId: '63fdbcaf95339b3d36e72a07',
        code: 'SYS_ROLE',
        name: '角色管理',
        id: '63fdbcd495339b3d36e72a0d',
      },
      {
        parentId: '63fdbcaf95339b3d36e72a07',
        code: 'SYS_USERS',
        name: '用户管理',
        id: '63fdbce295339b3d36e72a10',
      },
    ],
  },
]);
