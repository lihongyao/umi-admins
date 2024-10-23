import { apiCommon } from '@/api/apiServer';
import { PlusOutlined } from '@ant-design/icons';
import Tools from '@likg/tools';
import OSS from 'ali-oss';
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
  const [client, setClient] = useState<OSS | null>(null);
  const [OSSData, setOSSData] = useState<API.OSSSTSConfigProps | null>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState('');

  // -- methods
  // -- 获取OSS配置参数
  const init = async () => {
    try {
      const resp = await apiCommon.ossConfig<API.OSSSTSConfigProps>();
      if (resp.code === 200) {
        const client = new OSS({
          bucket: resp.data.bucket,
          region: resp.data.region,
          endpoint: resp.data.endpoint,
          accessKeyId: resp.data.accessKeyId,
          accessKeySecret: resp.data.accessKeySecret,
          stsToken: resp.data.securityToken,
        });
        setClient(client);
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

    const expire = new Date(OSSData.expiration).getTime();
    if (expire < Date.now()) {
      await init();
    }

    return file;
  };

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

    onChange: handleChange,
    onRemove,
    onPreview,
    beforeUpload,
    customRequest: async (opts) => {
      // https://blog.csdn.net/solocao/article/details/137586991
      const { file, onProgress, onSuccess } = opts;
      const key = Tools.getFilePath(file as File, dir);
      const resp = await client?.put(key, file);
      if (resp) {
        // @ts-ignore
        file.url = resp.url;
        onProgress && onProgress({ percent: 100 });
        onSuccess && onSuccess({ code: 200 });
      }
    },
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
