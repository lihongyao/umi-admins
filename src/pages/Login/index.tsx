import { apiSys } from '@/api/apiServer';
import InitParticles from '@/components/@lgs/InitParticles';
import Footer from '@/components/Footer';
import Utils from '@/utils';

import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, App, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );
};

type LoginType = 'mobile' | 'account';

const Login: React.FC = () => {
  // -- APPs
  const { message } = App.useApp();
  // -- refs
  const vForm = useRef<ProFormInstance>();
  // -- state
  const [type, setType] = useState<LoginType>('account');
  const [errorMsg, setErrorMsg] = useState('');

  // -- model
  const { setInitialState } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  // -- events

  const onSubmit = async (
    values: API.LoginWithAccount & { memorize: boolean },
  ) => {
    try {
      const resp = await apiSys.login({
        username: values.username,
        password: Utils.md5(values.password),
      });
      if (resp.code === 200) {
        // 1. 存储账号信息
        if (values.memorize) {
          localStorage.setItem('XXX_ACCOUNT_INFOs', JSON.stringify(values));
        } else {
          localStorage.removeItem('XXX_ACCOUNT_INFOs');
        }
        // 2. 存储Token
        localStorage.setItem('XXX_TOKEN', resp.data.token);
        // 3. 存储用户信息
        localStorage.setItem('XXX_USERINFOs', JSON.stringify(resp.data));
        // 4. 更新initialState
        flushSync(async () => {
          await setInitialState((prev) => ({
            ...prev,
            currentUser: resp.data,
          }));
        });
        // 5. 跳转数据看板
        history.push('/dashboard');
      }
    } catch (error) {}
  };

  // -- effects
  useEffect(() => {
    const info = localStorage.getItem('XXX_ACCOUNT_INFOs');
    if (info) {
      const _ = JSON.parse(info) as API.LoginWithAccount & {
        memorize: boolean;
      };
      vForm.current?.setFieldsValue(_);
    }
  }, []);

  return (
    <div className={containerClassName}>
      {/* 显示在标签上的标题：document.title */}
      <Helmet>
        <title>登录 - 后台管理系统</title>
      </Helmet>
      {/* 例子效果 */}
      <InitParticles />
      {/* 表单 */}
      <div style={{ flex: '1', padding: '32px 0', position: 'relative' }}>
        <LoginForm
          formRef={vForm}
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          logo={
            <img
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
          }
          title="Umi Admins"
          subTitle={'基于Umijs + TypeScript + axios + ProCompoents 实现'}
          onFinish={async (
            values: API.LoginWithAccount & { memorize: boolean },
          ) => {
            setErrorMsg('');
            await onSubmit(values);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={(k: string) => setType(k as LoginType)}
            centered
            items={[
              { key: 'account', label: '账户密码登录' },
              { key: 'mobile', label: '手机号登录' },
            ]}
          />

          {errorMsg && type === 'account' && (
            <LoginMessage content={errorMsg} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
                placeholder={'admin'}
                allowClear
                rules={[{ required: true, message: '请输入用户名!' }]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                  autoComplete: 'off',
                }}
                placeholder={'1234'}
                allowClear
                rules={[{ required: true, message: '请输入密码!' }]}
              />
            </>
          )}

          {errorMsg && type === 'mobile' && <LoginMessage content={errorMsg} />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  maxLength: 11,
                  prefix: <MobileOutlined />,
                }}
                name={'mobile'}
                placeholder={'手机号'}
                rules={[
                  { required: true, message: '请输入手机号！' },
                  { pattern: /^1\d{10}$/, message: '手机号格式错误！' },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
                captchaProps={{ size: 'large' }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} 获取验证码`;
                  }
                  return '获取验证码';
                }}
                name={'captcha'}
                phoneName={'mobile'}
                rules={[{ required: true, message: '请输入验证码！' }]}
                onGetCaptcha={async (phone) => {
                  const resp = await apiSys.sendCaptcha(phone);
                  if (resp.code === 200) {
                    message.success('验证码为：1234!');
                  }
                }}
              />
            </>
          )}
          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="memorize">
              记住密码
            </ProFormCheckbox>
            <a
              style={{ float: 'right' }}
              onClick={() => message.info('请联系客服重置密码')}
            >
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
