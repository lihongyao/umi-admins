import request from '@/api/apiConfig';

export async function list(params: API.ListParams) {
  return request<API.List<API.UserProps>>({
    url: '/api/user',
    params,
  });
}
export async function del(id: number) {
  return request({
    url: `/api/user/${id}`,
    method: 'DELETE',
  });
}

export async function feedbacks(params: API.ListParams) {
  return request<API.List<API.FeedbackProps>>({
    url: '/api/user/feedbacks',
    params,
  });
}
