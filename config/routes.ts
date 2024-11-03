/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */

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

const routes: RouterConfig[] = [
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
    icon: 'icon-lunbotuguanli',
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
    icon: 'icon-xinwen',
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
        path: '/systems/users',
        name: '用户管理',
        component: '@/pages/Systems/Users',
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
];

export default routes;
