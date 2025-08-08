import request from '@/api/apiConfig';
export async function list(params: any) {
  return request<API.List<API.NewsProps>>({
    url: '/api/news',
    params,
  });
}
export async function add(data: any) {
  return request({
    url: `/api/news/`,
    method: 'POST',
    data,
  });
}
export async function edit(data: any) {
  return request({
    url: `/api/news/`,
    method: 'PUT',
    data,
  });
}

export async function details(id: number) {
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

export async function switchStatus(data: any) {
  return request({
    url: '/api/news/switch_status/',
    method: 'PUT',
    data,
  });
}
