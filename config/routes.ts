interface RouterConfig {
  path: string;
  component?: string;
  routes?: RouterConfig[];
  redirect?: string;
  wrappers?: any;
  name?: string;
  icon?: string;
  hideInBreadcrumb?: boolean;
  layout?: boolean;
  menuRender?: boolean;
  menuHeaderRender?: boolean;
  headerRender?: boolean;
  hideInMenu?: boolean;
  access?: string;
}

export default [
  { path: '/', redirect: '/login' },
  { path: '/*', component: '@/pages/404' },
  { path: '/login', component: '@/pages/Login', layout: false },
  {
    path: '/dashboard',
    name: '数据看板',
    component: '@/pages/Dashboard',
    icon: 'icon-shujukanban',
  },
  {
    path: '/banners',
    component: '@/pages/Banners',
    name: '轮播广告',
    icon: 'icon-shouyelunbotu',
  },
  {
    path: '/audit',
    component: '@/pages/Audit',
    name: '作品审核',
    icon: 'icon-shenhe',
  },
  {
    path: '/news',
    component: '@/pages/News',
    name: '新闻管理',
    icon: 'icon-24gl-newspaper4',
  },
  {
    path: '/news/create',
    component: '@/pages/News/AddOrUpdate',
    name: '新建新闻',
    hideInMenu: true,
  },
  {
    path: '/news/edit/:id',
    component: '@/pages/News/AddOrUpdate',
    name: '编辑新闻',
    hideInMenu: true,
  },
  {
    path: '/news/details/:id',
    component: '@/pages/News/Details',
    name: '新闻详情',
    hideInMenu: true,
  },
  {
    path: '/users',
    name: '用户管理',
    icon: 'icon-yonghuguanli',
    routes: [
      { path: '/users', redirect: '/users/list' },
      {
        path: '/users/list',
        name: '用户列表',
        component: '@/pages/Users/List',
      },
      {
        path: '/users/feedback',
        name: '意见反馈',
        component: '@/pages/Users/Feedback',
      },
    ],
  },
  {
    path: '/configs',
    component: '@/pages/Configs',
    name: '配置管理',
    icon: 'icon-peizhi',
  },
  {
    path: '/systems',
    name: '系统管理',
    icon: 'icon-xitong',
    routes: [
      { path: '/systems', redirect: '/systems/access' },
      {
        path: '/systems/access',
        name: '权限列表',
        component: '@/pages/Systems/Access',
      },
      {
        path: '/systems/access-table-tree',
        name: '权限列表（表格树）',
        component: '@/pages/Systems/AccessTableTree',
      },
      {
        path: '/systems/roles',
        name: '角色管理',
        component: '@/pages/Systems/Roles',
      },
      {
        path: '/systems/accounts',
        name: '帐户管理',
        component: '@/pages/Systems/Accounts',
      },
      {
        path: '/systems/logs',
        name: '操作日志',
        component: '@/pages/Systems/Logs',
      },
    ],
  },
  {
    path: '/lgtest',
    component: '@/pages/Lgtest',
    name: '测试专用',
    hideInMenu: true,
  },
  {
    name: '文档管理',
    path: '/document',
    component: '@/pages/LoadDocs',
    hideInMenu: true,
    menuRender: false,
  },
] as RouterConfig[];
