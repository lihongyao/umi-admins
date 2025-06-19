import { message } from '@/components/@lgs/GlobalMessage';
import { history } from '@umijs/max';
import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

// 1. 基础类型定义
interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

// 2. 创建实例
const instance = axios.create({
  baseURL: process.env.HOST,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

// 3. 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // -- GET请求拼接随机值
    if (/GET/i.test(config.method ?? '')) {
      const t = Math.random().toString(36).slice(2, 9);
      config.params = { ...config.params, t };
    }

    // -- 拼接token
    const token = localStorage.getItem('AUTHORIZATION_TOKEN') ?? '';
    const whiteList = ['/api/login'];

    if (token && !whiteList.some((path) => config.url?.startsWith(path))) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 4. 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // -- 清除Loadings
    message.destroy();

    // 处理流数据
    if (response.request.responseType === 'blob') {
      return { code: 200, data: response.data, msg: 'success' };
    }

    // 业务错误处理
    const { code } = response.data as unknown as ApiResponse;
    if (code === 401) {
      localStorage.removeItem('AUTHORIZATION_TOKEN');
      history.replace('/login');
    }
    return response.data;
  },
  (error: AxiosError) => {
    console.log('[request error] > ', error);
    return { code: 0, msg: error.message, data: null };
  },
);

// 5. 统一的 request 方法
const request = <R = any>(
  options: AxiosRequestConfig,
): Promise<ApiResponse<R>> => {
  return instance(options);
};

export default request;
