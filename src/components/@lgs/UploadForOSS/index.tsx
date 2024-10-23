import { apiCommon } from '@/api/apiServer';
import { PlusOutlined } from '@ant-design/icons';
import Tools from '@likg/tools';
import type { UploadProps } from 'antd';
import { message, Modal, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { memo, useEffect, useState } from 'react';

// -- 组件Props
interface IProps {
  dir?: string;
  max?: number;
  title?: string;
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
}

const AliyunOSSUpload: React.FC<IProps> = ({
  value,
  onChange,
  dir = 'images',
  max = 1,
  title = '上传图片',
}) => {
  // -- state
  const [OSSData, setOSSData] = useState<API.OSSConfigProps | null>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState('');

  // -- methods
  // -- 获取OSS配置参数
  const init = async () => {
    try {
      const resp = await apiCommon.ossConfig<API.OSSConfigProps>();
      if (resp.code === 200) {
        setOSSData(resp.data);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // -- events
  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    onChange?.([...fileList]);
  };

  const onRemove = (file: UploadFile) => {
    const files = (value || []).filter((v) => v.url !== file.url);
    if (onChange) {
      onChange(files);
    }
  };

  const onPreview = ({ url }: UploadFile) => {
    setPreviewImgUrl(url || '');
  };

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!OSSData) return false;

    const expire = Number(OSSData.expire) * 1000;
    if (expire < Date.now()) {
      await init();
    }

    // @ts-ignore
    file.url = OSSData.host + '/' + Tools.getFilePath(file, dir);
    return file;
  };

  const getExtraData: UploadProps['data'] = (file) => ({
    key: file.url?.replace(OSSData?.host + '/', ''),
    OSSAccessKeyId: OSSData?.accessKeyId,
    policy: OSSData?.policy,
    Signature: OSSData?.signature,
  });

  // -- effects
  useEffect(() => {
    init();
  }, []);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{title}</div>
    </div>
  );

  const uploadProps: UploadProps = {
    name: 'file',
    maxCount: max,
    listType: 'picture-card',
    fileList: value,
    action: OSSData?.host,
    onChange: handleChange,
    onRemove,
    onPreview,
    data: getExtraData,
    beforeUpload,
  };

  return (
    <>
      {/* 上传 */}
      <Upload {...uploadProps} style={{ width: 300 }}>
        {/* ts */}
        {(value || []).length >= max ? null : uploadButton}
      </Upload>
      {/* 预览 */}
      <Modal
        width={400}
        title="图片预览"
        open={!!previewImgUrl}
        onCancel={() => setPreviewImgUrl('')}
        footer={null}
      >
        <img width="100%" src={previewImgUrl} />
      </Modal>
    </>
  );
};

export default memo(AliyunOSSUpload);
