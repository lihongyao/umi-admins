import EditorWang, { EditorWangRefs } from '@/components/@lgs/EditorWang';
import ImagePreview from '@/components/@lgs/ImagePreview';
import PhoneModel from '@/components/@lgs/PhoneModel';
import UploadForOSS from '@/components/@lgs/UploadForOSS';
import {
  ActionType,
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
  ProList,
} from '@ant-design/pro-components';
import Validator from '@likg/validator';
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
  const [record, setRecord] = useState<API.ConfigProps | null>(null);
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
      setPreviewImgUrl(record.value);
    }
  };
  // -- render
  return (
    <>
      <ProList<API.ConfigProps>
        headerTitle={'基础配置'}
        request={async () => {
          console.log('加载数据');
          return Promise.resolve({
            success: true,
            data: [
              {
                id: 0,
                title: '租车指南',
                key: 'zczn',
                value: '2',
              },
              {
                id: 1,
                title: '客服微信二维码链接',
                key: 'customerServiceQrCode',
                value:
                  'https://zylcjc.oss-cn-chengdu.aliyuncs.com/configs/20230527/IZB1685197807006.jpg',
              },
              {
                id: 2,
                title: '客服电话',
                key: 'customerServicePhone',
                value: '17398888669',
              },
              {
                id: 3,
                title: '对接人分润比例',
                key: 'contactPersonProfitRatio',
                value: '2',
              },
              {
                id: 4,
                title: '平台负责人分润比例',
                key: 'principalProfitRatio',
                value: '2',
              },
            ],
          });
        }}
        metas={{
          title: { dataIndex: 'title' },
          subTitle: {
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
            render: (_, record) => [
              <Button
                size={'small'}
                key={'k'}
                onClick={() => {
                  const { key, value } = record;
                  if (key === 'zczn') {
                    vEditor.current?.setContent('<span>租车指南...</span>');
                    setOpenModal(true);
                  } else {
                    vForm.current?.setFieldsValue({
                      key,
                      value: ['customerServiceQrCode'].includes(key)
                        ? value
                          ? [{ url: value }]
                          : []
                        : value,
                    });
                    setRecord({ ...record });
                  }
                }}
              >
                编辑
              </Button>,
            ],
          },
        }}
      />
      {/* 表单 */}
      <ModalForm
        title={record?.title || ''}
        formRef={vForm}
        open={!!record}
        width={300}
        modalProps={{
          closable: false,
          forceRender: true,
          onCancel: () => setRecord(null),
        }}
        onFinish={async ({ key, value }) => {
          // 救援热线
          if (key === 'hotline' && !Validator.isTel(value)) {
            return message.error('手机号码格式不正确');
          }
          // 客服微信二维码链接
          let newValue = '';
          if (key === 'customerServiceQrCode') {
            newValue = value[0].url;
          }
          console.log(`${key} - ${newValue}`);
          message.loading('处理中...', 0);
          try {
            setTimeout(() => {
              message.destroy();
              vList.current?.reload();
              message.success('设置成功');
              setRecord(null);
            }, 1000);
          } catch {}
        }}
      >
        <ProFormText name={'key'} noStyle hidden />
        {['customerServicePhone'].includes(record?.key || '') && (
          <ProFormText name={'value'} fieldProps={{ maxLength: 11 }} />
        )}
        {['customerServiceQrCode'].includes(record?.key || '') && (
          <ProForm.Item name={'value'}>
            <UploadForOSS max={1} dir="configs" />
          </ProForm.Item>
        )}
        {['contactPersonProfitRatio', 'principalProfitRatio'].includes(
          record?.key || '',
        ) && (
          <ProFormDigit
            name={'value'}
            min={0}
            max={100}
            fieldProps={{
              precision: 2,
            }}
            addonAfter={<span>%</span>}
          />
        )}
      </ModalForm>
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
        width={520}
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
