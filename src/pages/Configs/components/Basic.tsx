import EditorWang, { EditorWangRefs } from '@/components/@lgs/EditorWang';
import ImagePreview from '@/components/@lgs/ImagePreview';
import PhoneModel from '@/components/@lgs/PhoneModel';
import {
  ActionType,
  ProFormInstance,
  ProList,
} from '@ant-design/pro-components';
import { App, Button, Modal, Space } from 'antd';
import React, { useRef, useState } from 'react';

const Basic: React.FC = () => {
  // -- APPs
  const { message } = App.useApp();
  // -- refs
  const vList = useRef<ActionType>();
  const vForm = useRef<ProFormInstance>();
  const vEditor = useRef<EditorWangRefs>();
  // -- state
  const [openModal, setOpenModal] = useState(false);
  const [htmlString, setHtmlString] = useState('');
  const [previewImgTitle, setPreviewImgTitle] = useState('');
  const [previewImgUrl, setPreviewImgUrl] = useState('');
  // -- events
  const onLooks = (record: API.ConfigProps) => {
    if (record.key === 'zczn') {
      setHtmlString(`
        <p>具体如下：</p>
        <p>1.今天天气不错</p>
      `);
    } else {
      setPreviewImgTitle(record.title);
      setPreviewImgUrl(record.value!);
    }
  };
  // -- render
  return (
    <>
      <ProList<API.ConfigProps>
        rowKey={'key'}
        editable={{
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.save, defaultDoms.cancel];
          },
          onSave: async (key, record, originRow) => {
            console.log(key, record, originRow);
            return true;
          },
        }}
        request={async () => {
          return Promise.resolve({
            success: true,
            data: [
              {
                id: 1,
                title: '租车指南',
                key: 'zczn',
                value: '2',
              },
              {
                id: 2,
                title: '客服微信二维码链接',
                key: 'customerServiceQrCode',
                value:
                  'https://zylcjc.oss-cn-chengdu.aliyuncs.com/configs/20230527/IZB1685197807006.jpg',
              },
              {
                id: 3,
                title: '客服电话',
                key: 'customerServicePhone',
                value: '17398888669',
              },
              {
                id: 4,
                title: '对接人分润比例',
                key: 'contactPersonProfitRatio',
                value: '2',
              },
              {
                id: 5,
                title: '平台负责人分润比例',
                key: 'principalProfitRatio',
              },
            ],
          });
        }}
        metas={{
          title: { dataIndex: 'title', editable: false },
          description: {
            dataIndex: 'value',
            render: (_, record) => {
              const { value, key } = record;
              if (!value) {
                return '暂未配置';
              }
              if (['customerServiceQrCode', 'zczn'].includes(key)) {
                return (
                  <Button size={'small'} onClick={() => onLooks(record)}>
                    点击查看
                  </Button>
                );
              }
              if (
                ['contactPersonProfitRatio', 'principalProfitRatio'].includes(
                  key,
                )
              ) {
                return value + '%';
              }
              return value;
            },
          },
          actions: {
            render: (text, row, index, action) => {
              return [
                <Button
                  size={'small'}
                  key={'set_and_edit'}
                  type={'link'}
                  onClick={() => {
                    console.log(row);
                    if (row.key === 'zczn') {
                      vEditor.current?.setContent('<span>租车指南...</span>');
                      setOpenModal(true);
                    } else {
                      action?.startEditable(row.key);
                    }
                  }}
                >
                  {row.value ? '编辑' : '配置'}
                </Button>,
              ];
            },
          },
        }}
      />

      {/* 手机预览 */}
      <PhoneModel
        title={'租车指南'}
        open={!!htmlString}
        onCancel={() => setHtmlString('')}
        __html={htmlString}
      />
      {/* 富文本编辑 */}
      <Modal
        title="租车指南"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        width={1200}
        footer={false}
      >
        <EditorWang
          ref={vEditor}
          placeholder={'请填写租车指南'}
          onChange={(value: string) => {
            console.log(value);
          }}
          onPreview={(htmlString: string) => {
            console.log('预览');
          }}
          onUploadFile={(opts) => {
            console.log(opts);
          }}
        />
        <div style={{ marginTop: 16, textAlign: 'end' }}>
          <Space align="end">
            <Button
              onClick={() => {
                vEditor.current?.clear();
                setOpenModal(false);
              }}
            >
              取消
            </Button>
            <Button type={'primary'}>确定</Button>
          </Space>
        </div>
      </Modal>
      {/* 图片预览 */}
      <ImagePreview
        name={previewImgTitle}
        width={300}
        url={previewImgUrl}
        onCancel={() => setPreviewImgUrl('')}
      />
    </>
  );
};

export default React.memo(Basic);
