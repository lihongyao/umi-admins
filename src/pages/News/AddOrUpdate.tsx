import { apiNews } from '@/api/apiServer';
import EditorWang from '@/components/@lgs/EditorWang';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useNavigate, useParams } from '@umijs/max';
import { App } from 'antd';
import { useEffect, useRef } from 'react';

export default function Page() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vForm = useRef<ProFormInstance>();

  const { message, modal } = App.useApp();

  const getDetails = async () => {
    message.loading('数据查询中...', 0);
    const resp = await apiNews.details(params.id!);
    if (resp.code === 200) {
      vForm.current?.setFieldsValue(resp.data);
    }
  };
  useEffect(() => {
    if (params.id) {
      getDetails();
    }
  }, []);
  return (
    <PageContainer>
      <ProCard>
        <ProForm
          formRef={vForm}
          onFinish={async () => {
            message.loading('处理中...');
            setTimeout(() => {
              message.destroy();
              modal.success({
                title: '温馨提示',
                content: params.id ? '编辑成功' : '创建成功',
                okText: '返回',
                onOk() {
                  navigate(-1);
                },
              });
            }, 1000);
          }}
        >
          {params.id && <ProFormText name="id" noStyle hidden />}
          <ProFormTextArea
            label="新闻标题"
            placeholder="请输入新闻标题"
            name="title"
            rules={[{ required: true }]}
          />
          <ProForm.Group>
            <ProFormRadio.Group
              layout="horizontal"
              name="type"
              label="新闻类型"
              rules={[{ required: true }]}
              options={[
                {
                  label: '案例新闻',
                  value: 1,
                },
                {
                  label: '动态新闻',
                  value: 2,
                },
              ]}
            />
            <ProFormRadio.Group
              layout="horizontal"
              name="category"
              label="新闻分类"
              rules={[{ required: true }]}
              options={[
                { label: '文明实践', value: 1 },
                { label: '爱国卫生月', value: 2 },
                { label: '志愿服务', value: 3 },
              ]}
            />
          </ProForm.Group>

          <ProFormText label="内容" name="content" rules={[{ required: true }]}>
            <EditorWang
              onUploadFile={({ file, type, next }) => {
                if (type === 'AUDIO') {
                  next(
                    'https://xingzhe-web-test.s3.cn-northwest-1.amazonaws.com.cn/temp/test/%E5%A4%A7%E6%B0%94%E5%AE%A3%E4%BC%A0%20%E5%A3%AE%E5%BF%97%E5%87%8C%E4%BA%91.mp3',
                  );
                }
              }}
            />
          </ProFormText>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
}
