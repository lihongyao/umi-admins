import {
  DeleteOutlined,
  LoadingOutlined,
  PictureOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Validator from '@likg/validator';
import { message } from 'antd';
import React, {
  ChangeEvent,
  CSSProperties,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

type UploadStatus = 'default' | 'loading' | 'success' | 'fail';
interface ItemProps {
  url: string;
  status: UploadStatus;
}
interface UploadImageProps {
  /** 组件宽度 */
  width?: number;
  /** 组件高度 */
  height?: number;
  /** 文件类型，默认 image/* */
  accept?: string;
  /** 最大尺寸,单位MB */
  maxSize?: number;
  /** 最大上传数，默认为 1 */
  max?: number;
  /** 图片地址 */
  value?: string | string[];
  /** 提示信息 */
  extra?: string;
  /** 变换 */
  onChange?: (value: string | string[]) => void;
  /** 自定义上传 */
  customRequest?: (
    file: File,
    next: (data: { success: boolean; url?: string }) => void,
  ) => void;
}
const UploadImage: React.FC<UploadImageProps> = (props) => {
  const {
    value,
    maxSize = 20,
    width = 100,
    height = 100,
    max = 1,
    accept = 'image/*',
    extra = '',
    onChange,
    customRequest,
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<ItemProps[]>([
    {
      url: '',
      status: 'default',
    },
  ]);

  const resetInput = () => {
    const inputElem = inputRef.current;
    if (inputElem) inputElem.value = '';
  };

  const updateData = (path: string) => {
    if (max === 1) {
      onChange?.(path);
    } else {
      const t = data.map((item) => item.url).filter((url) => !!url);
      t.push(path);
      onChange?.(t);
    }
  };

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
    try {
      setData((prev) => {
        const t = [...prev];
        t[index].status = 'loading';
        return t;
      });

      resetInput();

      if (customRequest) {
        customRequest(file, ({ success, url }) => {
          if (success && url) {
            updateData(url);
          } else {
            setData((prev) => {
              const t = [...prev];
              t[index].status = 'fail';
              return t;
            });
          }
        });
      } else {
        const path =
          'https://img2.baidu.com/it/u=2631564363,2063588676&fm=253&fmt=auto&app=138&f=PNG?w=499&h=247';
        setTimeout(() => {
          if (index % 2 === 0) {
            updateData(path);
          } else {
            setData((prev) => {
              const t = [...prev];
              t[index].status = 'fail';
              return t;
            });
          }
        }, 1000);
      }
    } catch {
      message.error('上传失败');
    }
  };
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
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(auto-fill, ${width}px)`,
  };
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
                  <div className="mt-2">上传失败</div>
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
