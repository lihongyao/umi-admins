import { Modal } from 'antd';
import { memo } from 'react';

export default memo(function ImagePreview({
  url,
  name,
  onCancel,
  width = 600,
}: {
  url: string;
  onCancel: () => void;
  width?: number;
  name?: string;
}) {
  return (
    <Modal
      title={name || url.slice(url.lastIndexOf('/') + 1)}
      open={!!url}
      onCancel={onCancel}
      maskClosable={false}
      width={width}
      footer={null}
    >
      <img src={url} width={'100%'} />
    </Modal>
  );
});
