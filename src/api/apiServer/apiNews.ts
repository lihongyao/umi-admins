import request from '@/api/apiConfig';
export async function list(params: API.ListParams) {
  return request<API.List<API.NewsProps>>({
    url: '/api/news',
    params,
  });
}

export async function details(id: string) {
  return request<API.NewsProps>({
    url: `/api/news/${id}`,
  });
}

export async function del(id: number) {
  return request({
    url: `/api/news/${id}`,
    method: 'DELETE',
  });
}
