import { FileImageOutlined } from '@ant-design/icons';
import Validator from '@likg/validator';
import { App, Popconfirm, Tooltip } from 'antd';
import React, { useState } from 'react';
import ImagePreview from '../ImagePreview';
import './index.less';
interface IProps {
  accept?: string;
  maxSize?: number;
  value?: string;
  onChange?: (value: string) => void;
}
const UploadOption: React.FC<IProps> = React.memo((props) => {
  const { value, accept = 'image/*', maxSize = 20, onChange } = props;
  const { message } = App.useApp();
  const [previewUrl, setPreviseUrl] = useState('');

  const onFileChange = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      // 校验文件类型
      if (!Validator.checkFile({ type: 'extension', file, accept })) {
        return message.error(`仅支持格式为 ${accept} 的文件`);
      }

      // 校验文件限制
      if (!Validator.checkFile({ type: 'size', file, maxSize })) {
        return message.error(`文件尺寸不能大于${maxSize}MB`);
      }
      try {
        message.loading('文件上传中，请稍后...');
        // const resp = await apiCommon.uploadFile(file);
        // if (resp.code === 200) {
        //   onChange && onChange(resp.data.full_path);
        // }
      } catch (error) {}
    }
  };

  return (
    <div className="lg-upload-option">
      {/* 图片上传区域 */}
      <Tooltip title={'上传图片'}>
        <div className="upload-box">
          <FileImageOutlined />
          <input
            type={'file'}
            accept="image/*"
            multiple={false}
            onChange={(event) => onFileChange(event.target.files)}
          />
        </div>
      </Tooltip>
      {/* 图片显示区域 */}
      {value && value?.length > 0 && (
        <Popconfirm
          title={'选择操作'}
          cancelText="删除"
          okText="查看大图"
          onConfirm={() => setPreviseUrl(value)}
          onCancel={() => {
            onChange && onChange('');
          }}
        >
          <img
            src={value}
            height={30}
            width={30}
            style={{ cursor: 'pointer', borderRadius: 4 }}
          />
        </Popconfirm>
      )}
      {/* 图片预览区域 */}
      <ImagePreview url={previewUrl} onCancel={() => setPreviseUrl('')} />
    </div>
  );
});

export default UploadOption;
