import { apiNews } from '@/api/apiServer';
import EditorWang from '@/components/@lgs/EditorWang';
import UploadImage from '@/components/@lgs/UploadImage';
import Utils from '@/utils';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useNavigate, useParams } from '@umijs/max';
import { App } from 'antd';
import React, { useEffect, useRef } from 'react';
const AddOrUpdate: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vForm = useRef<ProFormInstance>();

  const { message, modal } = App.useApp();

  const getDetails = async () => {
    if (params.id) {
      const resp = await apiNews.details(+params.id);
      if (resp.code === 200) {
        vForm.current?.setFieldsValue(resp.data);
      }
    }
  };
  useEffect(() => {
    getDetails();
  }, []);

  return (
    <PageContainer>
      <ProCard>
        <ProForm
          formRef={vForm}
          submitter={{
            render: (_, dom) => (
              <div className="text-right space-x-4">{dom}</div>
            ),
          }}
          onFinish={async (values) => {
            message.loading('处理中...', 0);
            const resp = await apiNews.add(values);
            if (resp.code === 200) {
              modal.success({
                title: '温馨提示',
                content: values ? '编辑成功' : '创建成功',
                okText: '返回',
                onOk() {
                  navigate(-1);
                },
              });
            }
          }}
        >
          <ProFormText name="id" noStyle hidden />
          <ProFormText
            label="新闻标题"
            placeholder="请输入新闻标题"
            name="title"
            rules={[{ required: true }]}
            fieldProps={{
              style: {
                width: 425,
              },
            }}
          />
          <ProForm.Group>
            <ProFormSelect
              style={{ width: 200 }}
              name="type"
              label="新闻类型"
              rules={[{ required: true }]}
              options={[
                { label: '行业动态', value: 1 },
                { label: '公司动态', value: 2 },
              ]}
            />
            <ProFormText
              style={{ width: 200 }}
              name="source"
              label="来源"
              placeholder={'请输入来源'}
            />
          </ProForm.Group>
          <ProForm.Item label={'新闻封面'} name={'cover_url'} required>
            <UploadImage width={200} dir="/news" />
          </ProForm.Item>
          <ProFormText
            label="新闻详情"
            name="content"
            rules={[{ required: true }]}
          >
            <EditorWang
              onUploadFile={async ({ file, next }) => {
                const url = await Utils.upload({
                  file,
                  dir: '/news',
                  mode: 'oss_sts',
                });
                if (url) {
                  next(url);
                } else {
                  message.error('上传失败');
                }
              }}
            />
          </ProFormText>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default AddOrUpdate;
