import { defineConfig } from '@umijs/max';

// TODO: 本地运行请根据本机IP修改HOST地址
const HOST = {
  后台A: 'http://172.20.50.142:8888',
  后台B: '此处为后台B服务器地址',
};

export default defineConfig({
  define: {
    'process.env.BASE': '',
    'process.env.NAME': 'development',
    'process.env.HOST': HOST.后台A,
    'process.env.SECRET_KEY': '盐值',
  },
});
