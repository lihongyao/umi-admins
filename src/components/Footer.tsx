import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { CSSProperties, memo } from 'react';

const links = [
  {
    key: 'Ant Design Pro',
    title: 'Ant Design Pro',
    href: 'https://pro.ant.design',
    blankTarget: true,
  },
  {
    key: 'github',
    title: <GithubOutlined />,
    href: 'https://github.com/ant-design/ant-design-pro',
    blankTarget: true,
  },
  {
    key: 'Ant Design',
    title: 'Ant Design',
    href: 'https://ant.design',
    blankTarget: true,
  },
];
export default memo(function Footer() {
  const copyright = `${new Date().getFullYear()} 李鴻耀同學出品`;
  const styleObj: CSSProperties = { background: 'transparent', zIndex: 1 };
  return <DefaultFooter style={styleObj} copyright={copyright} links={links} />;
});
