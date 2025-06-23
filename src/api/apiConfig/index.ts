import { message } from '@/components/@lgs/GlobalMessage';
import { history } from '@umijs/max';
import type {
  AxiosError,
  AxiosRequestConfig,
  CancelTokenSource,
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

// 3. 取消请求相关配置
const pendingRequests = new Map<string, CancelTokenSource>();

/**
 * 生成请求唯一标识
 */
const generateReqKey = (config: AxiosRequestConfig) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
};
/**
 * 取消重复请求
 */
const removePendingRequest = (config: AxiosRequestConfig) => {
  const requestKey = generateReqKey(config);
  if (pendingRequests.has(requestKey)) {
    const source = pendingRequests.get(requestKey);
    source?.cancel('请求被取消');
    pendingRequests.delete(requestKey);
  }
};

// 3. 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // -- 取消重复请求
    removePendingRequest(config);

    // -- 创建新的取消令牌
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;

    // -- 存储当前请求
    const requestKey = generateReqKey(config);
    pendingRequests.set(requestKey, source);

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
    // -- 请求完成后移除pending状态
    const requestKey = generateReqKey(response.config);
    pendingRequests.delete(requestKey);

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
    // 请求完成后移除pending状态
    if (error.config) {
      const requestKey = generateReqKey(error.config);
      pendingRequests.delete(requestKey);
    }

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

/**
 * 取消所有pending状态的请求
 */
const cancelAllRequests = () => {
  pendingRequests.forEach((source) => {
    source.cancel('批量取消请求');
  });
  pendingRequests.clear();
};

/**
 * 取消指定请求
 * @param config 请求配置或请求唯一标识
 */
const cancelRequest = (config: AxiosRequestConfig | string) => {
  const requestKey =
    typeof config === 'string' ? config : generateReqKey(config);
  if (pendingRequests.has(requestKey)) {
    const source = pendingRequests.get(requestKey);
    source?.cancel(`取消请求: ${requestKey}`);
    pendingRequests.delete(requestKey);
  }
};

export { cancelAllRequests, cancelRequest };
export default request;
