import { Image } from 'antd';
import { memo } from 'react';
import './index.less';
export default memo(function ImageBox({
  width = 100,
  height = 100,
  src,
  spacing = 4,
  caption = '',
  desc = '',
}: {
  width?: string | number;
  height?: string | number;
  spacing?: number /** 相框间距 */;
  src: string;
  caption?: string;
  desc?: string;
  name?: string;
}) {
  return (
    <div className="lg-image-box" style={{ width }}>
      <div className="__content" style={{ width, height, padding: spacing }}>
        <Image
          width={'100%'}
          height={'100%'}
          src={src}
          style={{ objectFit: 'cover' }}
        />
      </div>
      {caption ? <div className="__caption">{caption}</div> : null}
      {desc ? <div className="__desc">{desc}</div> : null}
    </div>
  );
});
