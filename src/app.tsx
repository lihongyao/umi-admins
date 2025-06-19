import AntWrapApp from '@/components/@lgs/GlobalMessage';
import Footer from '@/components/Footer';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { Link, RunTimeLayoutConfig, history } from '@umijs/max';
import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import defaultSettings from '../config/defaultSettings';
import { AvatarDropdown, AvatarName } from './components/AvatarDropdown';
const loginPath = '/login';
export const rootContainer = (root: JSX.Element) => {
  return (
    <ConfigProvider locale={zhCN}>
      <App>
        <AntWrapApp />
        {root}
      </App>
    </ConfigProvider>
  );
};

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.LoginResponse;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.LoginResponse | undefined>;
}> {
  const fetchUserInfo = async () => {
    const user = localStorage.getItem('USERINFOS');
    if (user) {
      return JSON.parse(user) as API.LoginResponse;
    }
    history.push(loginPath);
    return undefined;
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    siderWidth: 220,
    actionsRender: () => [
      <div key={'dateString'} style={{ color: '#fff', fontSize: 14 }}>
        {dayjs().locale('zh-cn').format('YYYY年MM月DD日 dddd')}
      </div>,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatarUrl,
      title: <AvatarName />,
      shape: 'square',
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: [
      <Link key={1} to="https://www.baidu.com" target="_blank">
        <LinkOutlined />
        <span>百度百科</span>
      </Link>,
      <Link key={2} to="https://www.baidu.com/" target="_blank">
        <BookOutlined />
        <span>帮助文档</span>
      </Link>,
    ],
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return children;
    },
    ...initialState?.settings,
  };
};
