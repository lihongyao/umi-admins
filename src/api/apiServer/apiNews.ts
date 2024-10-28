import request from '@/api/apiConfig';
export async function list(params: API.ListParams) {
  return request<API.List<API.NewsItemProps>>({
    url: '/admin/news',
    params,
  });
}
