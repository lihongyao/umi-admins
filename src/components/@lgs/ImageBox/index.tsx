import { memo, useState } from 'react';
import ImagePreview from '../ImagePreview';
import './index.less';
export default memo(function ImageBox({
  width = 100,
  height = 100,
  src,
  spacing = 4,
  caption = '',
  desc = '',
  name,
}: {
  width?: string | number;
  height?: string | number;
  spacing?: number /** 相框间距 */;
  src: string;
  caption?: string;
  desc?: string;
  name?: string;
}) {
  const [url, setUrl] = useState('');
  return (
    <div className="lg-image-box" style={{ width }}>
      <div
        className="lg-image-box__content"
        style={{ width, height, padding: spacing }}
        onClick={() => setUrl(src)}
      >
        <div
          className="lg-image-box__spacing-img"
          style={{
            background: `url(${src}) no-repeat center center / cover`,
          }}
        />
      </div>
      {caption ? <div className="lg-image-box__caption">{caption}</div> : null}
      {desc ? <div className="lg-image-box__desc">{desc}</div> : null}
      {src && (
        <ImagePreview
          url={url}
          width={555}
          onCancel={() => setUrl('')}
          name={name}
        />
      )}
    </div>
  );
});
