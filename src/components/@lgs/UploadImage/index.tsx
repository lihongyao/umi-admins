import { apiCommon } from '@/api/apiServer';
import {
  DeleteOutlined,
  LoadingOutlined,
  PictureOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Tools from '@likg/tools';
import Validator from '@likg/validator';
import OSS from 'ali-oss';
import { message } from 'antd';
import React, {
  ChangeEvent,
  CSSProperties,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

export enum UploadMode {
  /** 后端直接上传 */
  BackendUpload = 'BackendUpload',
  /** 自定义上传 */
  CustomUpload = 'CustomUpload',
  /** 使用 STS token 的 OSS 直传 */
  OssDirectWithSts = 'OssDirectWithSts',
  /** 后端签名的 OSS 直传 */
  OssDirectWithSignature = 'OssDirectWithSignature',
}
type UploadStatus = 'default' | 'loading' | 'success' | 'fail';
type ItemProps = {
  url: string;
  status: UploadStatus;
};
interface UploadImageProps {
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
  /** 文件类型，默认 “image/*” */
  accept?: string;
  /** 最大尺寸,单位MB */
  maxSize?: number;
  /** 最大上传数，默认为 1，=== 时，值为字符串，> 1 时，值为字符串数组 */
  max?: number;
  /** 提示信息 */
  extra?: string;
  /** 上传模式 */
  uploadMode?: UploadMode;
  /** 上传目录，如：/images */
  dir?: string;
  /** 图片地址 */
  value?: string | string[];
  /** 值变化 */
  onChange?: (value: string | string[]) => void;
  /** 自定义上传 */
  customRequest?: (
    file: File,
    next: (data: { success: boolean; url?: string }) => void,
  ) => void;
}
const UploadImage: React.FC<UploadImageProps> = (props) => {
  // -- 解构
  const {
    value,
    maxSize = 20,
    width = 100,
    height = 100,
    max = 1,
    accept = 'image/*',
    extra = '',
    dir = '/images',
    uploadMode = UploadMode.BackendUpload,
    onChange,
    customRequest,
  } = props;

  // -- constants
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(auto-fill, ${width}px)`,
  };
  const defaultUrl =
    'https://img2.baidu.com/it/u=2631564363,2063588676&fm=253&fmt=auto&app=138&f=PNG?w=499&h=247';

  // -- refs
  const inputRef = useRef<HTMLInputElement | null>(null);

  // -- state
  const [data, setData] = useState<ItemProps[]>([
    { url: '', status: 'default' },
  ]);
  const [client, setClient] = useState<OSS | null>(null);
  const [ossData, setOssData] = useState<API.OssConfigProps | null>(null);
  const [ossStsData, setOssStsData] = useState<API.OssStsConfigProps | null>(
    null,
  );

  /**
   * 重置输入框，避免选择文件之后无法再次选择
   */
  const resetInput = () => {
    const inputElem = inputRef.current;
    if (inputElem) inputElem.value = '';
  };

  /**
   * 更新数据
   * @param path
   */
  const triggerChange = (path: string) => {
    if (max === 1) {
      onChange?.(path);
    } else {
      const t = data.map((item) => item.url).filter((url) => !!url);
      t.push(path);
      onChange?.(t);
    }
  };

  /**
   * 更新状态
   * @param index
   * @param status
   */
  const updateStatus = (index: number, status: UploadStatus) => {
    setData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, status } : item)),
    );
  };

  const initOssConfig = async () => {
    const resp = await apiCommon.getOssConfigs();
    if (resp.code === 200) {
      setOssData(resp.data);
    }
  };

  const initStsConfig = async () => {
    const resp = await apiCommon.getOssStsConfigs();
    if (resp.code === 200) {
      const client = new OSS({
        bucket: resp.data.bucket,
        region: resp.data.region,
        endpoint: resp.data.endpoint,
        accessKeyId: resp.data.accessKeyId,
        accessKeySecret: resp.data.accessKeySecret,
        stsToken: resp.data.stsToken,
      });
      setClient(client);
      setOssStsData(ossStsData);
    }
  };

  /**
   * 执行上传
   * @param file
   * @param index
   */
  const upload = async (file: File, index: number) => {
    updateStatus(index, 'loading');
    resetInput();
    const path = defaultUrl;
    try {
      switch (uploadMode) {
        case UploadMode.BackendUpload:
          setTimeout(() => {
            index % 2 === 0 ? triggerChange(path) : updateStatus(index, 'fail');
          }, 1000);
          break;
        case UploadMode.CustomUpload:
          customRequest?.(file, ({ success, url }) => {
            if (success && url) {
              triggerChange(url);
            } else {
              updateStatus(index, 'fail');
            }
          });
          break;
        case UploadMode.OssDirectWithSignature:
          if (ossData) {
            const expire = new Date(ossData.expiration).getTime();
            if (expire < Date.now()) {
              await initOssConfig();
            }
            const key = Tools.getFilePath(file, `${ossData.dir}${dir}`);
            const formData = new FormData();
            formData.append('key', key);
            formData.append('OSSAccessKeyId', ossData.accessKeyId);
            formData.append('policy', ossData.policy);
            formData.append('Signature', ossData.signature);
            formData.append('file', file);
            fetch(ossData.host, { method: 'POST', body: formData }).then(
              (uploadResp) => {
                if ([200, 204].indexOf(uploadResp.status) !== -1) {
                  const url = uploadResp.url + key;
                  triggerChange(url);
                } else {
                  updateStatus(index, 'fail');
                }
              },
            );
          }
          break;
        case UploadMode.OssDirectWithSts:
          if (ossStsData) {
            // -- 判断是否过期
            const expire = new Date(ossStsData.expiration).getTime();
            if (expire < Date.now()) {
              await initStsConfig();
            }
            const key = Tools.getFilePath(file, `${ossStsData.dir}${dir}`);
            const resp = await client?.put(key, file);
            const url = resp?.url;
            url ? triggerChange(url) : updateStatus(index, 'fail');
          }
          break;
      }
    } catch {
      updateStatus(index, 'fail');
    }
  };

  /**
   * 选择文件
   * @param e
   * @param index
   * @returns
   */
  const onFileChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    // -- 获取选中文件
    const files = e.target.files;
    if (!(files && files.length > 0)) return;
    const file = files[0];

    // -- 校验文件类型
    if (!Validator.checkFile({ type: 'extension', file, accept })) {
      message.error(`仅支持格式为 ${accept} 的文件`);
      resetInput();
      return false;
    }

    // -- 校验文件限制
    if (!Validator.checkFile({ type: 'size', file, maxSize })) {
      message.error(`文件尺寸不能大于${maxSize}MB`);
      resetInput();
      return false;
    }

    // -- 执行上传
    upload(file, index);
  };

  /**
   * 删除
   * @param index
   */
  const onDelete = (index: number) => {
    setData((prev) => {
      const t = [...prev];
      t.splice(index, 1);
      if (t.length < max) {
        t.push({ url: '', status: 'default' });
      }
      return t;
    });
  };

  useEffect(() => {
    if (value) {
      if (max === 1) {
        setData([{ url: value as string, status: 'success' }]);
      } else {
        const t: ItemProps[] = (value as string[]).map((url) => ({
          url,
          status: 'success',
        }));
        if (t.length < max) {
          t.push({ url: '', status: 'default' });
        }
        setData(t);
      }
    }
  }, [value]);

  useEffect(() => {
    if (uploadMode === UploadMode.OssDirectWithSts) {
      initStsConfig();
    }
    if (uploadMode === UploadMode.OssDirectWithSignature) {
      initOssConfig();
    }
  }, [uploadMode]);

  // -- renders
  return (
    <div className="upload-file-container">
      {/* 列表 */}
      <div className="grid gap-5" style={gridStyle}>
        {data.map((item, index) => (
          <div
            className={`p-2 border border-dashed relative bg-[#FAFAFA]  rounded-sm ${item.status === 'fail' ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}`}
            style={{ height }}
            key={index}
          >
            {/* 文件拾取 */}
            {item.status !== 'success' && (
              <input
                ref={inputRef}
                type={'file'}
                accept={accept}
                className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => onFileChange(e, index)}
              />
            )}

            <div className="w-full h-full relative rounded-sm overflow-hidden group">
              {/* 默认样式 */}
              {item.status === 'default' && (
                <div className="h-full flex flex-col justify-center items-center">
                  <PlusOutlined />
                  <div className="mt-2">点击上传</div>
                </div>
              )}

              {/* 上传中 */}
              {item.status === 'loading' && (
                <div className="h-full flex flex-col justify-center items-center">
                  <LoadingOutlined />
                  <div className="mt-2">上传中</div>
                </div>
              )}

              {/* 上传成功 */}
              {item.status === 'success' && (
                <>
                  <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all">
                    <DeleteOutlined
                      className="text-xl cursor-pointer text-white "
                      onClick={() => onDelete(index)}
                    />
                  </div>
                  <div
                    className={'w-full h-full bg-cover bg-center '}
                    style={{ backgroundImage: `url('${item.url}')` }}
                  />
                </>
              )}
              {/* 上传失败 */}
              {item.status === 'fail' && (
                <div className="w-full h-full text-red-500 flex flex-col justify-center items-center ">
                  <PictureOutlined className="text-xl" />
                  <div className="mt-2">上传失败，请重新上传</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* 提示信息 */}
      {extra && <div className="mt-2 text-gray-400">{extra}</div>}
    </div>
  );
};

export default memo(UploadImage);
