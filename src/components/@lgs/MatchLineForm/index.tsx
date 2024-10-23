import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-components';
import MatchLine, {
  MatchLineAnswers,
  MatchLineOptions,
} from '@likg/match-line';
import Validator from '@likg/validator';
import { App, Button, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';

export interface MatchLineFormValue {
  options: MatchLineOptions;
  answers?: MatchLineAnswers;
}

interface IProps {
  type?: 'TEXT' | 'IMAGE';
  frozen?: boolean;
  value?: MatchLineFormValue;
  onChange?: (value: MatchLineFormValue) => void;
}

const MatchLineForm: React.FC<IProps> = React.memo(
  ({ value, type = 'TEXT', frozen = false, onChange }) => {
    const { message } = App.useApp();
    const defaultValue: MatchLineFormValue = {
      options: [
        { leftOption: '', rightOption: '' },
        { leftOption: '', rightOption: '' },
      ],
      answers: undefined,
    };

    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const backCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const [matchline, setMatchline] = useState<MatchLine | null>(null);
    const [showAnchor, setShowAnchor] = useState(false);
    const [dataSource, setDataSource] = useState<MatchLineFormValue>(
      value || defaultValue,
    );

    const onPushOption = () => {
      const t = { ...dataSource };
      t.options.push({ leftOption: '', rightOption: '' });
      t.answers = undefined;
      setDataSource(t);
      onChange && onChange(t);
    };

    const onDeleteOption = (index: number) => {
      if (dataSource.options.length <= 2) {
        return message.warning('至少需要两组选项');
      }
      const t = { ...dataSource };
      t.options.splice(index, 1);
      t.answers = undefined;
      setDataSource(t);
      onChange && onChange(t);
    };

    const onInputChange = (
      value: string,
      index: number,
      key: 'leftOption' | 'rightOption',
    ) => {
      const t = { ...dataSource };
      t.options[index][key] = value;
      t.answers = undefined;
      setDataSource(t);
      onChange && onChange(t);
    };

    const onFileChange = async (
      files: FileList | null,
      index: number,
      key: 'leftOption' | 'rightOption',
    ) => {
      if (files && files.length > 0) {
        const file = files[0];
        const accept = '.jpg, .jpeg, .png, .webp, .gif, .bmp';
        if (!Validator.checkFile({ type: 'extension', file, accept })) {
          return message.warning(`仅支持格式为 ${accept} 的文件！`);
        }
        // 2. 校验文件大小
        if (!Validator.checkFile({ type: 'size', file, maxSize: 20 })) {
          return message.warning(`文件大小不能大于 20 MB！`);
        }
        try {
          message.loading('图片上传中...', 0);
          // const resp = await apiCommon.uploadFile(file);
          // if (resp.code === 200) {
          //   const t = { ...dataSource };
          //   t.options[index][key] = resp.data.full_path;
          //   t.answers = undefined;
          //   setDataSource(t);
          //   onChange && onChange(t);
          // }
        } catch (error) {}
      }
    };

    useEffect(() => {
      const { options, answers } = dataSource;
      if (answers) {
        setShowAnchor(true);
      } else {
        const see: Record<string, boolean> = {};
        let flag = true;
        for (let i = 0; i < options.length; i++) {
          const { leftOption, rightOption } = options[i];
          if (!leftOption || !rightOption) {
            flag = false;
            break;
          }
          if (see[leftOption]) {
            flag = false;
            break;
          }
          see[leftOption] = true;
          if (see[rightOption]) {
            flag = false;
            break;
          }
          see[rightOption] = true;
        }
        setShowAnchor(flag);
      }
    }, [dataSource]);

    useEffect(() => {
      if (canvasRef.current && backCanvasRef.current && containerRef.current) {
        const items = containerRef.current.querySelectorAll('.anchor');
        if (items) {
          const matchline = new MatchLine({
            container: containerRef.current,
            items: items as NodeListOf<HTMLElement>,
            canvas: canvasRef.current,
            backCanvas: backCanvasRef.current,
            answers: dataSource?.answers,
            onChange(answers) {
              const t = { ...dataSource };
              t.answers = answers;
              setDataSource(t);
              onChange && onChange(t);
            },
          });
          setMatchline(matchline);
        }
      }
    }, [
      onChange,
      dataSource,
      showAnchor,
      canvasRef,
      backCanvasRef,
      containerRef,
    ]);

    const renderItems = () => {
      return dataSource.options.map((option, i) => {
        return (
          <div className="row" key={i}>
            <div className="wrap">
              {/* 左侧 */}
              <div className="item leftOption">
                {type === 'TEXT' ? (
                  <ProFormText
                    placeholder="左侧"
                    noStyle
                    fieldProps={{
                      value: option.leftOption,
                      onChange: (e) => {
                        const v = e.target.value;
                        onInputChange(v ? v.trim() : v, i, 'leftOption');
                      },
                    }}
                  />
                ) : (
                  <div
                    className="upload-box"
                    style={{
                      backgroundImage: `url('${option.leftOption}')`,
                    }}
                  >
                    {option.leftOption ? null : (
                      <Space direction={'vertical'} align={'center'}>
                        <UploadOutlined style={{ color: '#C5C5C5' }} />
                      </Space>
                    )}
                    <input
                      type={'file'}
                      onChange={(event) => {
                        onFileChange(event.target.files, i, 'leftOption');
                      }}
                    />
                  </div>
                )}

                {showAnchor && (
                  <div
                    draggable={false}
                    className="anchor"
                    data-value={option.leftOption}
                    data-ownership={'L'}
                    data-checked="0"
                  />
                )}
              </div>
              {/* 右侧 */}
              <div className="item rightOption">
                {showAnchor && (
                  <div
                    draggable={false}
                    className="anchor"
                    data-value={option.rightOption}
                    data-ownership={'R'}
                    data-checked="0"
                  />
                )}
                {type === 'TEXT' ? (
                  <ProFormText
                    placeholder="右侧"
                    noStyle
                    fieldProps={{
                      value: option.rightOption,
                      onChange: (e) => {
                        const v = e.target.value;
                        onInputChange(v ? v.trim() : v, i, 'rightOption');
                      },
                    }}
                  />
                ) : (
                  <div
                    className="upload-box"
                    style={{
                      backgroundImage: `url('${option.rightOption}')`,
                    }}
                  >
                    {option.rightOption ? null : (
                      <Space direction={'vertical'} align={'center'}>
                        <UploadOutlined style={{ color: '#C5C5C5' }} />
                      </Space>
                    )}
                    <input
                      type={'file'}
                      onChange={(event) => {
                        onFileChange(event.target.files, i, 'rightOption');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* 删除 */}
            {!frozen && (
              <Button
                className="deleteBtn"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  onDeleteOption(i);
                }}
              />
            )}
          </div>
        );
      });
    };
    return (
      <div className="match-line">
        {/* 工具栏 */}
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={() => matchline?.reset()}>重置</Button>
          <Button onClick={() => matchline?.undo()}>撤销</Button>
        </Space>
        {/* 连线容器 */}
        <div
          className="match-line__container"
          ref={containerRef}
          draggable={false}
        >
          {/* 内容 */}
          <div className="match-line__contents">{renderItems()}</div>
          {/* 画板 */}
          <canvas ref={canvasRef}></canvas>
          <canvas ref={backCanvasRef}></canvas>
        </div>
        {/* 操作项 */}
        {!frozen && (
          <Button
            onClick={onPushOption}
            style={{ marginTop: 16, marginBottom: 16 }}
          >
            添加一组数据
          </Button>
        )}
      </div>
    );
  },
);

export default MatchLineForm;
