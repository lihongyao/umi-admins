import { defineConfig } from '@umijs/max';

export default defineConfig({
  // 1. 部署至二级目录 →
  // base: '/二级目录名/',
  // publicPath: '/二级目录名/',

  // 2. 输出目录
  outputPath: 'dist',

  // 3. 定义环境变量
  define: {
    'process.env.BASE': '',
    'process.env.NAME': 'production',
    'process.env.HOST': '此处为测试环境服务器地址',
    'process.env.SECRET_KEY': '盐值',
  },
});
