import { DownSquareOutlined, UpSquareOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import './index.less';

interface IProps {
  headerRender?: () => ReactNode;
  children?: ReactNode;
}
const VCollapse: React.FC<IProps> = React.memo(({ headerRender, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <div className="lg-v-collapse">
      {/* 头部 */}
      <header className="lg-v-collapse__header">
        {/* 左侧 */}
        {headerRender && <div style={{ flex: 1 }}>{headerRender()}</div>}
        {/* 右侧 */}
        <Tooltip title={isExpanded ? '收起' : '展开'}>
          <div className="lg-v-collapse__btn" onClick={toggleExpansion}>
            {isExpanded ? <UpSquareOutlined /> : <DownSquareOutlined />}
          </div>
        </Tooltip>
      </header>
      {/* 内容 */}
      <main
        className={clsx(['lg-v-collapse__contents', { expanded: isExpanded }])}
      >
        {children}
      </main>
    </div>
  );
});

export default VCollapse;
