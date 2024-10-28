import request from '@/api/apiConfig';

export async function ossConfig<T>() {
  return request<T>({
    url: '/api/upload/getSignForOSS',
  });
}
