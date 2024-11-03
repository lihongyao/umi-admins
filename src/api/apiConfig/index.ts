// https://blog.csdn.net/wgh2820777641/article/details/129086408

import { message } from '@/components/@lgs/GlobalMessage';
import { history } from '@umijs/max';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResult,
} from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.HOST,
  timeout: 60000,
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    // -- GET请求拼接随机值
    if (/GET/i.test(config.method || '')) {
      const t = Math.random().toString(36).slice(2, 9);
      config.params = { ...config.params, t };
    }
    // -- 拼接token
    const token = localStorage.getItem('APP_TOKEN');
    config.headers = {
      Authorization: token ? `Bearer ${token}` : '',
      ...config.headers,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    // -- 清除Loadings
    message.destroy();
    // -- 二进制流数据
    if (response.request.responseType === 'blob') {
      return { code: 200, data: response.data, msg: 'success' };
    }

    // -- 判断code，统一处理异常
    const { code, msg } = response.data as unknown as AxiosResult;

    if (code === 200) {
      return response.data;
    } else if (code === 401) {
      history.replace('/login');
      return response.data;
    } else {
      message.warning(msg);
      return response.data;
    }
  },
  (error: AxiosError) => {
    // -- 清除Loadings
    message.destroy();
    // -- 输出错误消息
    console.log('[request error] > ', error);
    // -- 针对性处理
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误(400)';
          break;
        case 401:
          error.message = '未授权，请重新登录(401)';
          break;
        case 403:
          error.message = '拒绝访问(403)';
          break;
        case 404:
          error.message = '请求出错(404)';
          break;
        case 405:
          error.message = '请求方法不支持(405)';
          break;
        case 408:
          error.message = '请求超时(408)';
          break;
        case 500:
          error.message = '服务器异常(500)';
          break;
        case 501:
          error.message = '服务未实现(501)';
          break;
        case 502:
          error.message = '网络错误(502)';
          break;
        case 503:
          error.message = '网络超时(504)(503)';
          break;
        case 504:
          error.message = '网络超时(504)';
          break;
        case 505:
          error.message = 'HTTP版本不受支持(505)';
          break;
        default:
          error.message = `连接出错(${error.response.status})!`;
      }
    } else {
      error.message = '服务链接失败';
    }
    message.error(error.message);
    return Promise.reject(error);
  },
);

const request = <R = any>(
  options: AxiosRequestConfig,
): Promise<AxiosResult<R>> => {
  return axiosInstance(options);
};

export default request;
